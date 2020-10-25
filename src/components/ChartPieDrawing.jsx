import { Badge } from 'antd';
import _ from 'lodash';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import styled from 'styled-components';
import { pieChartColors2 } from '../assets/constant';
import { getAllDrawingSameValueInOneColumn, mergeUndefined } from '../utils/function';




const ChartPieDrawing = ({ data, openDrawingTable, projectName }) => {

    const { drawingCount, drawingList } = mergeUndefined(getAllDrawingSameValueInOneColumn(data, 'Status'), 'Not Started');
    const dataChart = _.map(drawingCount, (value, name) => ({ name, value }));
    console.log(dataChart);
    const onClick = (portion) => {
        openDrawingTable(
            projectName,
            { type: 'Drawing Status', category: portion.name },
            drawingList[portion.name],
            data.columnsIndexArray
        );
    };

    // const [activeIndex, setActiveIndex] = useState(null);
    // const onMouseEnter = (data, index) => {
    //     setActiveIndex(index);
    // };
    // const onMouseLeave = (data, index) => {
    //     setActiveIndex(null);
    // };


    return (
        <>
            <PieChart width={300} height={300} style={{ margin: '0 auto' }}>
                <Pie
                    data={dataChart}
                    cx={150}
                    cy={150}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    dataKey='value'
                    outerRadius={100}
                    onClick={onClick}
                // onMouseEnter={onMouseEnter}
                // onMouseLeave={onMouseLeave}
                >
                    {Object.keys(drawingCount).map(item => (
                        <Cell
                            cursor='pointer'
                            key={`cell-${item}`}
                            fill={pieChartColors2[item]}
                        />
                    ))}
                </Pie>
            </PieChart>

            <div style={{ margin: '0 auto', display: 'table' }}>
                {Object.keys(drawingCount).map(item => (
                    <div key={item}>
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


const renderCustomizedLabel = (args) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, value } = args
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
            {/* {`${(percent * 100).toFixed(0)}%`} */}
            {value}
        </text>
    );
};




