import { Button, Divider, Modal, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { colorType } from '../assets/constant';
import ButtonCapsule from './ui/ButtonCapsule';



const FormPivot = ({ projectName, data, openDrawingTable }) => {

    const { columnsIndexArray } = data;


    const [pivotArray, setPivotArray] = useState([]);
    const [titleLeft, setTitleLeft] = useState(Object.keys(columnsIndexArray));
    const [value, setValue] = useState('Select an option...');
    const [selected, setSelected] = useState(null);
    const [modalFormatVisible, setModalFormatVisible] = useState(false);


    const onChange = value => {
        setValue('Select an option...');
        setSelected(value);
        if (columnsInDateFormat.includes(value)) {
            setModalFormatVisible(true);
        } else {
            setTitleLeft(titleLeft.filter(title => title !== value));
            setPivotArray([...pivotArray, value]);
        };
    };

    const selectFormat = (e) => {
        const formatType = e.target.textContent;
        setTitleLeft(titleLeft.filter(title => title !== selected));
        setPivotArray([...pivotArray, selected + ' - ' + formatType]);
        setModalFormatVisible(false);
    };

    const onCloseModalType = () => {
        setModalFormatVisible(false);
    };

    const onResetHandle = () => {
        setPivotArray([]);
        setTitleLeft(Object.keys(columnsIndexArray));
    };


    const sortedTableOpen = () => {
        // openDrawingTable(projectName, 'Sorted Table', pivotArray);
    };




    const onRemoveCategory = (e) => {
        const btnName = e.target.previousSibling.previousSibling.innerText;
        setPivotArray(pivotArray.filter(x => x !== btnName));
    };

    console.log(pivotArray);

    return (
        <div style={{ marginTop: '10px', padding: '20px' }}>
            {pivotArray.map(cl => (
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
            </div>


            <Modal
                title='Select the format'
                visible={modalFormatVisible}
                onCancel={onCloseModalType}
                footer={null}
            >
                <ButtonCapsule btnname='Week' onClick={selectFormat} />
                <ButtonCapsule btnname='Month' onClick={selectFormat} />
                <ButtonCapsule btnname='Year' onClick={selectFormat} />
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

const columnsInDateFormat = [
    'Model Start(T)',
    'Model Start(A)',
    'Model Finish (T)',
    'Model Finish (A)',
    'Drawing Start (T)',
    'Drawing Finish (T)',
    'Drawing Start (A)',
    'Drawing Finish (A)',
    'Drg to Consultant (T)',
    'Drg to Consultant (A)',
    'get Approval (T)',
    'get Approval (A)'
];
