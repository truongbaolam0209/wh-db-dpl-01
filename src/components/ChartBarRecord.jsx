import { Button, Divider, Icon } from 'antd';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import { colorType } from '../assets/constant';
import { recordDataToChartDaily, recordDataToChartMonthly, recordDataToChartWeekly, recordGetAllMonth } from '../utils/function';


const ChartBarRecord = ({ data, category, closeChart }) => {

    const reportTypeArr = ['Daily report', 'Weekly report', 'Monthly report'];
    const [month, setMonth] = useState('09/20');
    const [reportType, setReportType] = useState('Daily report');

    
    return (
        <div style={{ position: 'relative' }}>

            <Icon
                style={{ position: 'absolute', right: 20, top: 10, fontSize: 20, cursor: 'pointer', color: colorType.grey1 }}
                type='close-circle'
                onClick={() => closeChart(category)}
            />

            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{category}</div>

            <div style={{ paddingBottom: 10 }}>
                {reportTypeArr.map(item => (
                    <Button key={item} onClick={() => setReportType(item)} size='small' style={{ marginRight: 10 }}>{item}</Button>
                ))}
            </div>

            <div>
                {reportType === 'Daily report' && (
                    <>
                        {recordGetAllMonth(data, category).map(m => (
                            <Button
                                key={m}
                                size='small'
                                style={{ marginRight: 10 }}
                                onClick={() => setMonth(m)}
                            >{m}</Button>
                        ))}
                    </>
                )}
            </div>


            <BarChart
                width={0.8 * window.innerWidth}
                height={200}
                data={
                    reportType === 'Daily report' ? recordDataToChartDaily(data, category, month) :
                        reportType === 'Weekly report' ? recordDataToChartWeekly(data, category) :
                            recordDataToChartMonthly(data, category)
                }
                margin={{ top: 35, right: 30, left: 30, bottom: 50 }}
                padding={{ top: 15, right: 15, left: 15, bottom: 15 }}
                barSize={0.9 * window.innerWidth / 70}
            >
                <XAxis
                    textAnchor='end' angle={-45} interval={0} scale='point' padding={{ left: 30, right: 30 }}
                    dataKey={
                        reportType === 'Daily report' ? 'date' :
                            reportType === 'Weekly report' ? 'week' :
                                'month'
                    }
                />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar dataKey='value' fill={colorType.grey2} background={{ fill: '#eee' }} >
                    <LabelList dataKey='value' position='top' />
                </Bar>
            </BarChart>

            <Divider style={{ marginTop: 0 }} />
        </div>
    );
};

export default ChartBarRecord;
