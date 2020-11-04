import { Button, Divider, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { colorType } from '../assets/constant';
import { createDummyRecords } from '../utils/function';
import ChartBarRecordPanel from './ChartBarRecordPanel';



const FormPivot = ({ projectName, data, dataRecord, openDrawingTable }) => {

    const { columnsIndexArray, allDrawingsLatestRevision } = data;


    const [columnsHeaderSorted, setColumnsHeaderSorted] = useState(null);
    const [titleLeft, setTitleLeft] = useState(Object.keys(columnsIndexArray));
    const [value, setValue] = useState('Select an option...');
    const [chartRecord, setChartRecord] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);


    const onChange = value => {
        setValue('Select an option...');
        setTitleLeft(titleLeft.filter(title => title !== value));
        setColumnsHeaderSorted([...columnsHeaderSorted || [], value]);
    };

    
    const onResetHandle = () => {
        setColumnsHeaderSorted(null);
        setTitleLeft(Object.keys(columnsIndexArray));
    };


    const onRemoveCategory = (e) => {
        const btnName = e.target.previousSibling.previousSibling.innerText;
        setColumnsHeaderSorted(columnsHeaderSorted.filter(x => x !== btnName));
    };


    const sortedTableOpen = () => {
        if (!columnsHeaderSorted) {
            openDrawingTable(
                projectName,
                { type: 'Sorted table', category: 'category test' },
                allDrawingsLatestRevision,
                columnsIndexArray,
                null
            );
        } else {
            setModalConfirm(true);
        }
    };


    const confirmShowSelected = (bln) => {
        openDrawingTable(
            projectName,
            { type: 'Sorted table', category: 'category test' },
            allDrawingsLatestRevision,
            columnsIndexArray,
            columnsHeaderSorted,
            bln
        );
    };


    return (
        <div style={{ marginTop: '10px', padding: '20px' }}>
            {columnsHeaderSorted && columnsHeaderSorted.map(cl => (
                <div key={cl} style={{ display: 'flex', width: '100%', margin: '10px auto', padding: 5, border: `1px solid ${colorType.grey1}`, borderRadius: 3 }}>
                    <span style={{ marginRight: 5 }}>{cl}</span>
                    <Divider type='vertical' style={{ height: 21 }} />
                    <span
                        style={{
                            marginRight: 15,
                            color: colorType.red,
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                        onClick={onRemoveCategory}
                    >X</span>
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
                // height={0.9 * window.innerHeight}
                footer={null}
                bodyStyle={{ padding: 15 }}
            >
                <ChartBarRecordPanel
                    data={createDummyRecords()[projectName]}
                />
            </Modal>

            <Modal
                title='All columns or not ?????'
                visible={modalConfirm}
                onCancel={() => setModalConfirm(false)}
                footer={null}
            >
                <Button onClick={() => {
                    confirmShowSelected(true);
                    setModalConfirm(false);
                }}>Selected only</Button>

                <Button onClick={() => {
                    confirmShowSelected(false);
                    setModalConfirm(false);
                }}>Show all</Button>

            </Modal>



        </div>
    );
};

export default FormPivot;



