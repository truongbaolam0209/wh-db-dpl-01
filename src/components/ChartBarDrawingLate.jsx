import { Badge, Skeleton } from 'antd';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { chartWidth, colorType, sizeType } from '../assets/constant';
import { getDrawingLateNow } from '../utils/function';
import CardPanel from './ui/CardPanel';


const drawingLateInputChart = (data) => {
    let dataChart = [];
    data && Object.keys(data).forEach(project => {
        const drawingsLateApproval = getDrawingLateNow(data[project], 'getApproval');
        dataChart.push({
            name: project,
            value: drawingsLateApproval.length
        });
    });
    return dataChart;
};


const ChartBarDrawingLate = ({ data, title }) => {


    const inputData = title === 'No Of Drawing Late Construction' ? data 
        : title === 'No Of Drawing Late Approval' ? drawingLateInputChart(data) : null;

    const LabelCustomStackedTotal = (props) => {
        const { x, y, value } = props;
        return (
            <>
                <text
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                    x={x + 10}
                    y={y - 10}
                    fill='black'
                    dominantBaseline='central'
                >
                    {value}
                </text>
            </>
        );
    };

    const totalHeight = 502;
    const chartHeight = 320;


    return (

        <CardPanel
            title={title}
            headColor={colorType.red}
        >
            {data ? (
                <>
                    <BarChart
                        data={inputData}
                        width={chartWidth}
                        height={chartHeight}
                        margin={{ top: 35, right: 20, left: 15, bottom: 30 }}
                        padding={{ top: 10 }}
                        barSize={30}
                    >
                        <XAxis dataKey='name' textAnchor='end' angle={-20} interval={0} scale='point' padding={{ left: 50, right: 50 }} />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray='3 3' />
                        <Bar
                            dataKey='value'
                            fill={colorType.red}
                            background={{ fill: '#eee', padding: '0 25px' }}
                            isAnimationActive={false}
                            label={<LabelCustomStackedTotal />}
                        />
                    </BarChart>

                    <div style={{ paddingLeft: 20, height: window.innerWidth >= sizeType.xl && (totalHeight - chartHeight) }}>
                        {inputData.map(item => (
                            <div key={item.name} style={{ display: 'flex' }}>
                                <StyledBadge
                                    size='small'
                                    color={colorType.red}
                                    text={item.name}
                                />
                                <span style={{ paddingLeft: 5 }}>{`- (${item.value})`}</span>
                            </div>
                        ))}
                    </div>
                    
                </>
            ) : (
                    <div style={{ padding: '0 20px' }}>
                        <Skeleton paragraph={{ rows: 14 }} active />
                    </div>
                )
            }

        </CardPanel>
    );
};

export default ChartBarDrawingLate;


const StyledBadge = styled(Badge)`
    .ant-badge-status-dot {
        width: 15px;
        height: 15px;
        border-radius: 0;
    }
`;


