
import { Badge } from 'antd';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { chartWidth, colorType, inputStackData, pieChartColors2 } from '../assets/constant';
import { convertDataToStackedChart, sortStatusOrder } from '../utils/function';
import CardPanel from './ui/CardPanel';




const ChartBarStack = ({ data, title }) => {


    const inputData = title === 'Drawing Status' ? convertDataToStackedChart(data).dataChart
        : title === 'Productivity - (days per drawing)' ? data.inputData : null;

    const inputStack = title === 'Drawing Status' ? convertDataToStackedChart(data).itemArr
        : title === 'Productivity - (days per drawing)' ? data.inputStack : null;


    // console.log(inputData, inputStack);

    const LabelCustomStacked = (props) => {
        const { x, y, value, height } = props;
        return (
            <>
                <div className='line'></div>
                <text
                    style={{ fontSize: 13 }}
                    x={x + 32}
                    y={y + height / 2}
                    fill='#2c3e50'
                    dominantBaseline='central'

                >
                    {value === 0 ? null : value}
                </text>
            </>
        );
    };

    const LabelCustomStackedTotal = (props) => {
        const { x, y, value, topBar } = props;
        return (
            <>
                <text
                    style={{ fontSize: 17, fontWeight: 'bold' }}
                    x={x}
                    y={y - 10}
                    fill='black'
                    dominantBaseline='central'

                >
                    {topBar ? value : null}
                </text>
            </>
        );
    };


    const [tooltip, setTooltip] = useState(false);

    const TooltipCustom = (props) => {
        const { active, payload } = props;

        if (!active || !tooltip) return null;
        for (const bar of payload)
            if (bar.dataKey === tooltip) {
                return (
                    <div style={{
                        background: 'white',
                        border: '1px solid grey',
                        padding: '10px',
                        maxWidth: '180px'
                    }}>
                        {bar.name}<br />({bar.value})
                    </div>
                );
            };
        return null;
    };




    return (
        <CardPanel
            title={title}
            headColor={colorType.orange}
        >
            {data && (
                <>
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
                        <Tooltip content={<TooltipCustom />} />
                        {sortStatusOrder(inputStack).map((item, i) => (
                            <Bar
                                key={item}
                                dataKey={item}
                                stackId='a'
                                fill={pieChartColors2[item]}
                                isAnimationActive={false}
                                onMouseOver={() => setTooltip(item)}
                                label={<LabelCustomStackedTotal topBar={i === inputStack.length - 1} />}
                            >
                                <LabelList dataKey={item} position='left' content={<LabelCustomStacked item={item} />} />
                            </Bar>
                        ))}
                    </BarChart>

                    <div style={{ paddingLeft: 50, height: 180 }}>
                        {sortStatusOrder(inputStack).reverse().map((key, i) => (
                            <div key={key} style={{ display: 'flex' }}>
                                <div style={{ paddingRight: 5 }}>{'(' + (inputStackData.indexOf(key) + 1) + ')'}</div>
                                <StyledBadge
                                    size='small'
                                    color={pieChartColors2[key]}
                                    text={key}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

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








