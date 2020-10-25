
import { Badge, Tooltip } from 'antd';
import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { chartWidth, colorType, pieChartColors2 } from '../assets/constant';
import { getAllDrawingSameValueInOneColumn, mergeUndefined } from '../utils/function';
import CardPanel from './ui/CardPanel';


const ChartBarStack = ({ data, title }) => {



    const inputData = title === 'Drawing Status' ? convertDataToStackedChart(data).dataChart
        : title === 'Productivity - (days per drawing)' ? productivity.inputData : null;

    const inputStack = title === 'Drawing Status' ? convertDataToStackedChart(data).itemArr
        : title === 'Productivity - (days per drawing)' ? productivity.inputStack : null;


    return (

        <CardPanel
            title={title}
            headColor={colorType.orange}
        >
            <BarChart
                data={inputData}
                width={chartWidth}
                height={320}
                margin={{ top: 35, right: 20, left: 15, bottom: 30 }}
                padding={{ top: 10 }}
                barSize={30}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis tickSize={3} dataKey='name' textAnchor='end' angle={-20} interval={0} scale='point' padding={{ left: 50, right: 50 }} />
                <YAxis />
                <Tooltip />
                {inputStack.map((item, i) => (
                    <Bar
                        key={item}
                        dataKey={item}
                        stackId='a'
                        fill={pieChartColors2[item]}
                    >
                        <LabelList dataKey='item' position='top' />
                    </Bar>
                ))}
            </BarChart>

            <div style={{ paddingLeft: 50, height: 180 }}>
                {inputStack.map((key, i) => (
                    <div key={key} style={{ display: 'flex' }}>
                        <StyledBadge
                            size='small'
                            color={pieChartColors2[key]}
                            text={key}
                        />
                    </div>
                ))}
            </div>

        </CardPanel>
    );
};

export default ChartBarStack;


const StyledBadge = styled(Badge)`
    .ant-badge-status-dot {
        width: 15px;
        height: 15px;
        border-radius: 0;
    }
`;

const productivity = {
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



const convertDataToStackedChart = (data) => {
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





