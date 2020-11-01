import { Col, Divider, Modal, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { colorType } from '../assets/constant';
import ChartBarDrawing from '../components/ChartBarDrawing';
import ChartBarDrawingLate from '../components/ChartBarDrawingLate';
import ChartBarStack from '../components/ChartBarStack';
import ChartPieDrawing from '../components/ChartPieDrawing';
import ChartProgress from '../components/ChartProgress';
import FormPivot from '../components/FormPivot';
import NavBar from '../components/NavBar';
import TableDrawingList from '../components/TableDrawingList';
import CardPanel from '../components/ui/CardPanel';
import CardPanelProject from '../components/ui/CardPanelProject';
import { getDataConverted } from '../utils/function';







const PageDashboard = () => {


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [dataRecord, setDataRecord] = useState(null);


    useEffect(() => {

        const loadData = async () => {
            setLoading(true);
            try {
                // const result = await Axios.post(
                //     'https://bim.wohhup.com/api/smartsheet/get-sheets-dashboard',
                //     { listSheetId: [8919906142971780, 4758181617395588] }
                // );
                // setData(getDataConverted(result.data));
                // setLoading(false);

                setTimeout(() => {
                    const result = JSON.parse(localStorage.getItem('wh'));
                    console.log('-----------------------------------------', 'DATA FETCHED');
                    setData(getDataConverted(result));
                    setLoading(false);
                }, 100);
                // localStorage.setItem('wh', JSON.stringify(result.data));
            } catch (err) {
                console.log(err);
                setLoading(false);
            };
        };
        loadData();
        // loadRecords();

    }, []);


    const [drawingTableVisible, setDrawingTableVisible] = useState(false);
    const [drawingTableData, setDrawingTableData] = useState(null);
    const openDrawingTable = (projectName, title, drawings, columnsIndexArray, columnsHeader) => {
        setDrawingTableData({ projectName, title, drawings, columnsIndexArray, columnsHeader });
        setDrawingTableVisible(true);
    };



    // const convertDataToSaveRecord = (data) => {
    //     const allProjectsDwgStatus = convertDataToStackedChart(data).dataChart;

    //     const filterDwgStatus = (projectName, data) => {
    //         const dwgStatus = data.filter(project => project.name === projectName)[0];
    //         delete dwgStatus.name;
    //         let dwgStatusConverted = [];
    //         for (const key in dwgStatus) {
    //             dwgStatusConverted.push({
    //                 status: key,
    //                 count: dwgStatus[key]
    //             });
    //         };
    //         return dwgStatusConverted;
    //     };


    //     const filterDwgRevision = (data) => {
    //         const { drawingCount } = mergeUndefined(getAllDrawingSameValueInOneColumn(data, 'Rev'), '0');
    //         let dwgRevisionConverted = [];
    //         for (const key in drawingCount) {
    //             dwgRevisionConverted.push({
    //                 revision: key,
    //                 count: drawingCount[key]
    //             });
    //         };
    //         return dwgRevisionConverted;
    //     };


    //     let arr = [];
    //     for (const projectName in data) {
    //         arr = [...arr, {
    //             projectName,
    //             drawingLateConstruction: randomInteger(9, 30),
    //             drawingLateApproval: randomInteger(15, 30),
    //             drawingLateSubmission: randomInteger(9, 25),
    //             drawingStatus: [
    //                 {
    //                     status: 'Approved with comments, to Resubmit',
    //                     count: randomInteger(35, 60)
    //                 },
    //                 {
    //                     status: 'Approved with Comment, no submission Required',
    //                     count: randomInteger(35, 60)
    //                 },
    //                 {
    //                     status: 'Approved for Construction',
    //                     count: randomInteger(35, 60)
    //                 },
    //                 {
    //                     status: 'Consultant reviewing',
    //                     count: randomInteger(35, 60)
    //                 },
    //                 {
    //                     status: 'Not Started',
    //                     count: randomInteger(55, 90)
    //                 },
    //                 {
    //                     status: 'Revise In-Progress',
    //                     count: randomInteger(35, 60)
    //                 },
    //                 {
    //                     status: '1st cut of drawing in-progress',
    //                     count: randomInteger(35, 60)
    //                 },
    //             ],
    //             drawingByRevision: [
    //                 {
    //                     revision: '0',
    //                     count: randomInteger(65, 100)
    //                 },
    //                 {
    //                     revision: 'A',
    //                     count: randomInteger(55, 75)
    //                 },
    //                 {
    //                     revision: 'B',
    //                     count: randomInteger(30, 45)
    //                 },
    //                 {
    //                     revision: 'C',
    //                     count: randomInteger(20, 40)
    //                 },
    //                 {
    //                     revision: 'D',
    //                     count: randomInteger(10, 30)
    //                 },
    //             ],
    //             // drawingLateApproval: getDrawingLateNow(data[projectName], 'getApproval').length,
    //             // drawingLateSubmission: getDrawingLateNow(data[projectName], 'drgToConsultant').length,
    //             // drawingStatus: filterDwgStatus(projectName, allProjectsDwgStatus),
    //             // drawingByRevision: filterDwgRevision(data[projectName])
    //         }];
    //     };
    //     console.log(arr);
    //     return arr;
    // };

    // const saveRecords = async () => {
    //     try {
    //         const res = await api.post('/records', {
    //             date: new Date(),
    //             projects: convertDataToSaveRecord(data)
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     };
    // };

    // const createDummyRecord = async () => {
    //     try {
    //         for (let i = 0; i < 100; i++) {
    //             const res = await api.post('/records', {
    //                 date: moment(new Date(2020, 6, 21)).add(i, 'day')._d,
    //                 projects: convertDataToSaveRecord(data)
    //             });
    //         };
    //     } catch (err) {
    //         console.log(err);
    //     };
    // };

    // const loadRecords = async () => {
    //     try {
    //         const res = await api.get('/records');
    //         setDataRecord(res.data);
    //         localStorage.setItem('wh-r', JSON.stringify(res.data));
            
    //         setDataRecord(JSON.parse(localStorage.getItem('wh-r')));
    //     } catch (err) {
    //         console.log(err);
    //     };
    // };



    return (
        <NavBar>

            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Row justify='space-around' style={{ margin: '25px 0 5px 0' }}>
                    <ChartBarDrawingLate title='No Of Drawing Late Construction' />
                    <ChartBarDrawingLate data={data} title='No Of Drawing Late Approval' />
                    <ChartBarStack data={data} title='Drawing Status' />
                    <ChartBarStack data={productivityData} title='Productivity - (days per drawing)' />
                </Row>

                {!loading && data ? (
                    <div style={{ padding: '0 12px' }}>
                        {Object.keys(data).map(projectName => {
                            return (
                                <CardPanelProject
                                    title={projectName.toUpperCase()}
                                    key={projectName}
                                >
                                    <ChartPanel title='Overdue submissions'>
                                        <ChartProgress
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.md && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Drawing Status'>
                                        <ChartPieDrawing
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.xl && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Nos of drawing per revision'>
                                        <ChartBarDrawing
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.md && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Sorted table by category'>
                                        <FormPivot
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                            // dataRecord={dataRecord}
                                        />
                                    </ChartPanel>

                                </CardPanelProject>
                            )
                        })}
                    </div>
                ) : <SkeletonCard />}


                {drawingTableData && (
                    <Modal
                        title={drawingTableData.projectName}
                        visible={drawingTableVisible}
                        onOk={() => setDrawingTableVisible(false)}
                        onCancel={() => setDrawingTableVisible(false)}
                        width={0.9 * window.innerWidth}
                        height={0.7 * window.innerHeight}
                        // centered={true}
                        style={{
                            // justifyContent: 'center',
                            // alignItems: 'center'
                        }}
                    >
                        <h2>{drawingTableData.title.type}</h2>
                        <div style={{ display: 'flex' }}>
                            <h3>{drawingTableData.title.category}</h3>
                            <Divider type='vertical' />
                            <h3>{drawingTableData.drawings.length + ' drawings'}</h3>
                        </div>

                        <TableDrawingList
                            data={drawingTableData}
                        />
                    </Modal>
                )}


                {/* <ChartBarRecord data={JSON.parse(localStorage.getItem('wh-r'))} /> */}




            </div>
        </NavBar>
    );
};

export default PageDashboard;





const ChartPanel = ({ title, children }) => {
    return (
        <Col style={{ marginBottom: 10 }} xs={24} md={12} xl={6}>
            <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>{title}</div>
            {children}
        </Col>
    );
};


const SkeletonCard = () => {
    return (
        <div style={{ padding: '0 12px' }}>
            <CardPanel
                title='Project loading ...'
                headColor={colorType.grey2}
                headTitleColor={'white'}
            >
                <div style={{ padding: '20px', marginBottom: '95px' }}><Skeleton /><Skeleton /></div>
            </CardPanel>
            <CardPanel
                title='Project loading ...'
                headColor={colorType.grey2}
                headTitleColor={'white'}
            >
                <div style={{ padding: '20px', marginBottom: '95px' }}><Skeleton /><Skeleton /></div>
            </CardPanel>
        </div>
    );
};



const productivityData = {
    inputData: [
        {
            'Modelling': 3,
            'Shopdrawing': 5,
            'Submit To Consultant': 2,
            'Consultant Reply': 5,
            'Get Approval': 4,
            'name': 'Sumang'
        },
        {
            'Modelling': 4,
            'Shopdrawing': 6,
            'Submit To Consultant': 3,
            'Consultant Reply': 4,
            'Get Approval': 2,
            'name': 'Handy'
        }
    ],
    inputStack: ['Modelling', 'Shopdrawing', 'Submit To Consultant', 'Consultant Reply', 'Get Approval']
};


