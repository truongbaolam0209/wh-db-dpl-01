import { Button } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import { colorType } from '../assets/constant';



const countAverage = (nums) => nums.reduce((a, b) => (a + b)) / nums.length;



const ChartBarRecord = ({ data, projectName }) => {

    const reportTypeArr = ['Daily report', 'Weekly report', 'Monthly report'];

    const [month, setMonth] = useState('09/20');
    const [reportType, setReportType] = useState('Daily report');


    const getAllMonth = (data) => {
        let arr = [];
        data.forEach(item => {
            arr.push(moment(item.date).add(-1, 'day').format('MM/YY'));
        });
        return [...new Set(arr)];
    };
    const dataToChartDaily = (data) => {
        let arr = [];
        data.forEach(item => {
            const date = moment(item.date).add(-1, 'day');
            if (date.format('MM/YY') === month) {
                arr.push({
                    date: date.format('DD'),
                    value: item.projects.find(x => x.projectName === projectName)['drawingLateApproval']
                });
            };
        });
        return arr;
    };


    const dataToChartWeekly = (data) => {
        let arr = [];
        data.forEach(item => {
            const date = moment(item.date).add(-1, 'day');
            arr.push({
                week: date.format('W'),
                month: date.format('MM'),
                year: date.format('YY'),
                value: item.projects.find(x => x.projectName === projectName)['drawingLateApproval']
            });
        });
        let groups = {};
        for (let i = 0; i < arr.length; i++) {
            let weekName = `W${arr[i].week} ${arr[i].month}/${arr[i].year}`;
            if (!groups[weekName]) {
                groups[weekName] = [];
            };
            groups[weekName].push(arr[i].value);
        };
        let arrOutput = [];
        for (let week in groups) {
            arrOutput.push({ week, value: Math.round(countAverage(groups[week])) });
        };
        return arrOutput;
    };


    const dataToChartMonthly = (data) => {
        let arr = [];
        data.forEach(item => {
            const date = moment(item.date).add(-1, 'day');
            arr.push({
                week: date.format('W'),
                month: date.format('MM'),
                year: date.format('YY'),
                value: item.projects.find(x => x.projectName === projectName)['drawingLateApproval']
            });
        });
        let groups = {};
        for (let i = 0; i < arr.length; i++) {
            let monthName = `${arr[i].month}/${arr[i].year}`;
            if (!groups[monthName]) {
                groups[monthName] = [];
            };
            groups[monthName].push(arr[i].value);
        };
        let arrOutput = [];
        for (let month in groups) {
            arrOutput.push({ month, value: Math.round(countAverage(groups[month])) });
        };
        return arrOutput;
    };





    return (
        <div style={{ margin: '0 auto', display: 'table' }}>

            {reportTypeArr.map(item => (
                <Button key={item} onClick={() => setReportType(item)}>{item}</Button>
            ))}

            <BarChart
                width={0.9 * window.innerWidth}
                height={450}
                data={
                    reportType === 'Daily report' ? dataToChartDaily(data) :
                        reportType === 'Weekly report' ? dataToChartWeekly(data) :
                            dataToChartMonthly(data)
                }
                margin={{ top: 35, right: 30, left: 30, bottom: 50 }}
                padding={{ top: 15, right: 15, left: 15, bottom: 15 }}
                barSize={0.9 * window.innerWidth / 60}
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


            {reportType === 'Daily report' && (
                <div style={{ display: 'flex', float: 'left' }}>
                    {getAllMonth(data).map(m => (
                        <Button
                            key={m}
                            style={{ background: colorType.grey0, margin: '10px auto' }}
                            onClick={() => setMonth(m)}
                        >{m}</Button>
                    ))}
                </div>
            )}

        </div>

    );
};

export default ChartBarRecord;


