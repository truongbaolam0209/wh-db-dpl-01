import Axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { SelectColumnFilter } from '../components/TableDrawingList';




export const api = Axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});


export const getDataConverted = (projectArray) => {

    let dataOutput = {};
    for (let i = 0; i < projectArray.length; i++) {

        // get the column header
        const project = projectArray[i];
        const categoryArray = _.map(project.columns, 'title');
        let columnsIndexArray = {};
        categoryArray.forEach(cate => {
            project.columns.forEach(cl => {
                if (cl.title === cate) columnsIndexArray[cate] = cl.index;
            });
        });

        const indexDrawingName = columnsIndexArray['Drawing Name'];
        const indexRev = columnsIndexArray['Rev'];

        let allDrawings = [];
        let allDrawingsLatestRevision = [];

        for (let i = 0; i < project.rows.length; i++) {
            const dwg = project.rows[i];
            if (dwg.cells[indexDrawingName].value === undefined) continue; // make sure all drawing name is keyed in
            allDrawings.push([...dwg.cells]);

            if (dwg.cells[indexRev].value === undefined) {
                allDrawingsLatestRevision.push([...dwg.cells]);
                continue;
            };

            let found = false;
            for (let j = 0; j < allDrawingsLatestRevision.length; j++) {
                if (allDrawingsLatestRevision[j][indexDrawingName].value === dwg.cells[indexDrawingName].value) {
                    found = true;
                    if (String(allDrawingsLatestRevision[j][indexRev].value) < String(dwg.cells[indexRev].value)) {
                        allDrawingsLatestRevision.splice(j, 1);
                        allDrawingsLatestRevision.push([...dwg.cells]);
                    };
                    break;
                };
            };
            if (!found) allDrawingsLatestRevision.push([...dwg.cells]);
        };
        dataOutput[project.name.slice(0, project.name.length - 17)] = {
            columnsIndexArray,
            allDrawings,
            allDrawingsLatestRevision
        };
    };
    return dataOutput;
};



export const getAllDrawingSameValueInOneColumn = (data, column, dataType) => {

    const { columnsIndexArray, allDrawings, allDrawingsLatestRevision } = data;

    const drawings = dataType === 'all' ? allDrawings : allDrawingsLatestRevision;
    const indexCategory = columnsIndexArray[column];

    let drawingCount = {};
    let drawingList = {};

    drawings.forEach(dwg => {
        const { value } = dwg[indexCategory];

        drawingCount[value] = (drawingCount[value] || 0) + 1;
        drawingList[value] = [...drawingList[value] || [], dwg];
    });

    return {
        drawingCount,
        drawingList
    };
};



export const getDrawingLateNow = (data, type) => {

    const { allDrawingsLatestRevision, columnsIndexArray } = data;

    const dwgsLateNow = [];
    const columnHeader = type === 'getApproval' ? 'get Approval'
        : type === 'drgToConsultant' ? 'Drg to Consultant' : null;

    allDrawingsLatestRevision.forEach(dwg => {
        const status = dwg[columnsIndexArray['Status']].value;
        // make sure drawing is not approved or consultant reviewing
        if (status && (status.includes('Approved') || status === 'Consultant reviewing')) return;

        const dateT = dwg[columnsIndexArray[`${columnHeader} (T)`]].value;
        const dateA = dwg[columnsIndexArray[`${columnHeader} (A)`]].value;
        if (dateT === undefined || dateA !== undefined) return;

        const diff = moment(dateT).diff(moment(), 'days');
        if (diff < 0) dwgsLateNow.push([...dwg]);
    });
    return dwgsLateNow;
};



export const mergeUndefined = ({ drawingCount, drawingList }, mergeWith, columnsIndexArray, columnHeader) => {
    if (drawingCount['undefined'] === undefined) return;

    drawingCount[mergeWith] = (drawingCount[mergeWith] || 0) + drawingCount['undefined'];
    delete drawingCount['undefined'];

    drawingList[mergeWith] = [...drawingList[mergeWith] || [], ...drawingList['undefined']];
    delete drawingList['undefined'];

    return {
        drawingCount,
        drawingList
    };
};


export const formatString = (str) => {
    let mystring = str.replace(/ /g, '').replace(/\(|\)/g, '');
    return mystring.charAt(0).toLowerCase() + mystring.slice(1);
};


export const pickDataToTable = (drawings, columnsIndexArray) => {
    let arr = [];
    drawings.forEach(dwg => {
        let obj = {};
        Object.keys(columnsIndexArray).forEach(header => {
            obj[formatString(header)] = dwg[columnsIndexArray[header]].value || 'N/A';
        });
        arr.push(obj);
    });
    return arr;
};


export const convertDataToStackedChart = (data) => {
    let dataChart = [];
    let allKeys = [];
    data && Object.keys(data).forEach(project => {
        const { drawingCount } = mergeUndefined(getAllDrawingSameValueInOneColumn(data[project], 'Status'), 'Not Started');
        dataChart.push({ ...drawingCount, name: project });
        allKeys = [...allKeys, ...Object.keys(drawingCount)];
    });
    const itemArr = [...new Set(allKeys)];

    itemArr.forEach(key => {
        dataChart.forEach(projectData => {
            if (key in projectData) return;
            projectData[key] = 0;
        });
    });

    return {
        dataChart,
        itemArr
    };
};



export const sortStatusOrder = (data) => {
    const statusArr = [...data];
    const inputStackData = [
        'Not Started',
        '1st cut of model in-progress',
        '1st cut of drawing in-progress',
        'Pending design',
        'Consultant reviewing',
        'Reject and resubmit',
        'Approved with comments, to Resubmit',
        'Revise In-Progress',
        'Approved with Comment, no submission Required',
        'Approved for Construction',
    ];
    let arr = [];
    inputStackData.forEach(element => {
        statusArr.forEach(e => {
            if (element === e) arr.push(element);
        });
    });
    if (arr.length === 0) return statusArr;
    return arr;
};



export const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


export const createDummyRecords = () => {
    let dummyRecords = [];

    for (let i = 0; i < 100; i++) {

        dummyRecords.push({
            date: moment(new Date(2020, 6, 21)).add(i, 'day')._d,
            projects: [
                {
                    projectName: 'Handy',
                    drawingLateApproval: randomInteger(30, 60)
                },
                {
                    projectName: 'Sumang',
                    drawingLateApproval: randomInteger(30, 60)
                },
            ]
        });
    };
    return dummyRecords;
};


const getColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400;
    const magicSpacing = 10;
    const cellLength = Math.max(
        ...rows.map(row => (`${row[accessor]}` || '').length),
        headerText.length,
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
};



export const getColumnsHeader = (columnsIndexArray, data) => {
    let columnsName = [
        {
            Header: 'Index',
            accessor: (row, i) => i + 1
        },
    ];


    const filterSelect = (key) => {
        if (
            key === 'Status' ||
            key === 'Rev' ||
            key === 'Modeller' ||
            key === 'Remark' ||
            key === 'RFA Ref'
        ) {
            return true;
        };
    };
    
    for (const key in columnsIndexArray) {

        if (
            key !== 'Delta_Date' &&
            key !== 'Delta_IT_CT' &&
            key !== 'Delta_Issue' &&
            key !== 'Delta_KTP'
        ) {
            if (filterSelect(key)) {
                columnsName.push({
                    Header: key,
                    accessor: formatString(key),
                    Filter: SelectColumnFilter,
                    width: getColumnWidth(data, formatString(key), key),
                });
            } else {
                columnsName.push({
                    Header: key,
                    accessor: formatString(key),
                    width: getColumnWidth(data, formatString(key), key),
                });
            };
            
        };

    };
    return columnsName;
};



export const getHeaderSorted = (columnsData, columnsHeader) => {
    let arr = [];
    columnsHeader.forEach(header => {
        columnsData.forEach(headerData => {
            if (header === headerData.Header) arr.push(headerData);
        });
    });
    return arr;
};