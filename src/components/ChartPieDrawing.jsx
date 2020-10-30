import { Badge } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import styled from 'styled-components';
import { inputStackData, pieChartColors2 } from '../assets/constant';
import { getAllDrawingSameValueInOneColumn, mergeUndefined, sortStatusOrder } from '../utils/function';




const ChartPieDrawing = ({ data, openDrawingTable, projectName }) => {

    const { columnsIndexArray } = data;

    const { drawingCount, drawingList } = mergeUndefined(getAllDrawingSameValueInOneColumn(data, 'Status'), 'Not Started');

    const dataChart = _.map(drawingCount, (value, name) => ({ name, value }));

    const onClick = (portion) => {
        openDrawingTable(
            projectName,
            { type: 'Drawing Status', category: portion.name },
            drawingList[portion.name],
            columnsIndexArray
        );
    };


    const LabelCustom = (props) => {

        const { cx, cy, midAngle, innerRadius, outerRadius, value } = props;
        const RADIAN = Math.PI / 180;
        const radius = 28 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text
                x={x}
                y={y}
                fill='black'
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline='central'
            >
                {value}
            </text>
        );
    };


    return (
        <>
            <PieChart width={300} height={300} style={{ margin: '0 auto' }}>
                <Pie
                    data={dataChart}
                    cx={150}
                    cy={150}
                    dataKey='value'
                    outerRadius={100}
                    onClick={onClick}
                    labelLine
                    label={<LabelCustom />}
                >
                    {Object.keys(drawingCount).map(item => (
                        <Cell
                            key={`cell-${item}`}
                            cursor='pointer'
                            fill={pieChartColors2[item]}
                        />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>

            <div style={{ margin: '0 auto', display: 'table' }}>
                {sortStatusOrder(Object.keys(drawingCount)).reverse().map(item => (
                    <div key={item} style={{ display: 'flex' }}>
                        <div style={{ paddingRight: 5 }}>{'(' + (inputStackData.indexOf(item) + 1) + ')'}</div>
                        <StyledBadge
                            size='small'
                            color={pieChartColors2[item]}
                            text={item}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default ChartPieDrawing;



const StyledBadge = styled(Badge)`
    .ant-badge-status-dot {
        width: 15px;
        height: 15px;
        border-radius: 0;
    }
`;


// const renderCustomizedLabel = (args) => {
//     const { cx, cy, midAngle, innerRadius, outerRadius, value } = args
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
//     const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

//     return (
//         <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
//             {`${(percent * 100).toFixed(0)}%`}
//             {value}
//         </text>
//     );
// };




