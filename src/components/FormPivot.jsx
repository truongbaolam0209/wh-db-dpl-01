import { Button, Divider, Modal, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { colorType } from '../assets/constant';
import { createDummyRecords } from '../utils/function';
import ChartBarRecord from './ChartBarRecord';



const FormPivot = ({ projectName, data, dataRecord, openDrawingTable }) => {

    const { columnsIndexArray, allDrawingsLatestRevision } = data;


    const [columnsHeader, setColumnsHeader] = useState(null);
    const [titleLeft, setTitleLeft] = useState(Object.keys(columnsIndexArray));
    const [value, setValue] = useState('Select an option...');
    const [chartRecord, setChartRecord] = useState(false);


    const onChange = value => {
        setValue('Select an option...');
        setTitleLeft(titleLeft.filter(title => title !== value));
        setColumnsHeader([...columnsHeader || [], value]);
    };


    const onResetHandle = () => {
        setColumnsHeader(null);
        setTitleLeft(Object.keys(columnsIndexArray));
    };


    const onRemoveCategory = (e) => {
        const btnName = e.target.previousSibling.previousSibling.innerText;
        setColumnsHeader(columnsHeader.filter(x => x !== btnName));
    };


    const sortedTableOpen = () => {
        openDrawingTable(
            projectName,
            { type: 'Sorted table', category: 'category test XXX' },
            allDrawingsLatestRevision,
            columnsIndexArray,
            columnsHeader ? columnsHeader : null
        );
    };


    return (
        <div style={{ marginTop: '10px', padding: '20px' }}>
            {columnsHeader && columnsHeader.map(cl => (
                <div key={cl} style={{ width: '100%', margin: '10px auto', padding: 5, border: `1px solid ${colorType.grey1}`, borderRadius: 3 }}>
                    <span style={{ marginRight: 15 }}>{cl}</span>
                    <Divider type='vertical' />
                    <SpanOmit style={{ marginRight: 15 }} onClick={onRemoveCategory}>X</SpanOmit>
                </div>
            ))}

            <Select
                value={value}
                showSearch
                style={{ width: '100%', margin: '0 auto', display: 'table' }}
                placeholder='Select a title'
                optionFilterProp='children'
                onChange={onChange}
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {titleLeft.map(cl => (
                    <Select.Option value={cl} key={cl}>{cl}</Select.Option>
                ))}
            </Select>
            
            <div style={{ display: 'flex' }}>
                <Button
                    style={{ background: colorType.grey0, width: '90%', margin: '10px auto' }}
                    onClick={sortedTableOpen}
                >Go to sorted table</Button>
                <Button
                    style={{ background: colorType.grey2, width: '90%', margin: '10px auto' }}
                    onClick={onResetHandle}
                >Reset</Button>
                <Button
                    style={{ background: colorType.grey0, margin: '10px' }}
                    onClick={() => setChartRecord(true)}
                >Chart Report</Button>
            </div>


            <Modal
                title={`Record ${projectName}`}
                visible={chartRecord}
                onCancel={() => setChartRecord(false)}
                width={0.9 * window.innerWidth}
                height={600}
                footer={null}
            >
                <ChartBarRecord
                    // data={JSON.parse(localStorage.getItem('wh-r'))}
                    data={createDummyRecords()}
                    projectName={projectName}
                />
            </Modal>

        </div>
    );
};

export default FormPivot;




const SpanOmit = styled.span`
    :hover {
        color: red;
        cursor: pointer
    }

`;

