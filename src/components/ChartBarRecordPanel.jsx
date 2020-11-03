import { Divider, Select } from 'antd';
import React, { useState } from 'react';
import ChartBarRecord from './ChartBarRecord';



const ChartBarRecordPanel = ({ data }) => {

    const [categoryArrayLeft, setCategoryArrayLeft] = useState(Object.keys(data));
    const [categoryArrayShown, setCategoryArrayShown] = useState([]);

    const addMoreCategory = (value) => {
        setCategoryArrayShown([...categoryArrayShown, value]);
        setCategoryArrayLeft(categoryArrayLeft.filter(ca => ca !== value));
    };


    const closeChart = (value) => {
        setCategoryArrayShown(categoryArrayShown.filter(ca => ca !== value));
        setCategoryArrayLeft([...categoryArrayLeft, value]);
    };


    return (
        <div style={{ margin: '0 auto' }}>

            <Select
                defaultValue='Select ...'
                style={{ width: '50%', paddingBottom: 10 }}
                onChange={(value) => addMoreCategory(value)}
            >
                {categoryArrayLeft.map(cate => (
                    <Select.Option key={cate} value={cate}>{cate}</Select.Option>
                ))}
            </Select>

            <Divider style={{ margin: '5px 0 5px 0' }} />

            <div style={{ height: 0.7 * window.innerHeight, overflowY: 'scroll' }}>
                {categoryArrayShown.map(category => (
                    <ChartBarRecord
                        key={category}
                        data={data}
                        category={category}
                        closeChart={closeChart}
                    />
                ))}
            </div>

        </div>

    );
};

export default ChartBarRecordPanel;


