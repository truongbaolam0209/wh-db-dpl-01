import _ from 'lodash';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { colorType } from '../assets/constant';
import { getAllDrawingSameValueInOneColumn, mergeUndefined } from '../utils/function';



const ChartBarDrawing = ({ data, openDrawingTable, projectName }) => {


    const { drawingCount, drawingList } = mergeUndefined(getAllDrawingSameValueInOneColumn(data, 'Rev'), '0');
    const dataChart = _.map(drawingCount, (value, name) => ({ name, value }));


    const onClick = (e) => {
        openDrawingTable(
            projectName,
            { type: 'Drawings by revision', category: `Revision ${e.name}` },
            drawingList[e.name],
            data.columnsIndexArray
        );
    };

    const [activeIndex, setActiveIndex] = useState(null);

    const onMouseEnter = (data, index) => {
        setActiveIndex(index);
    };
    const onMouseLeave = (data, index) => {
        setActiveIndex(null);
    };


    return (
        <div style={{ margin: '0 auto', display: 'table' }}>
            <BarChart
                width={320}
                height={350}
                data={dataChart}
                margin={{ top: 35, right: 30, left: 0, bottom: 20 }}
                padding={{ top: 10 }}
                barSize={20}
            >
                <XAxis dataKey='name' textAnchor='end' angle={-45} interval={0} scale='point' padding={{ left: 30, right: 30 }} />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar
                    dataKey='value'
                    background={{ fill: colorType.grey0 }}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    barSize={25}
                >
                    {dataChart.map((entry, index) => (
                        <Cell
                            cursor='pointer'
                            fill={index === activeIndex ? colorType.grey1 : colorType.grey2}
                            key={`cell-${index}`}
                        />
                    ))}
                </Bar>

            </BarChart>
        </div>

    );
};

export default ChartBarDrawing;


