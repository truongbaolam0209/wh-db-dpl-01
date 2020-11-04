import { Menu } from 'antd';
import React from 'react';
import styled from 'styled-components';


const PanelRightClick = (props) => {

    const { top, left, buttonPanelFunction } = props;

    const listButton = [
        'Hide this column', 
        'Unhide all',
        'Move to left',
        'Move to right',
        'Move to ...'
    ];

    return (
        <>
            <Menu style={{
                position: 'fixed',
                border: '1px solid grey',
                boxShadow: '2px 2px 30px 2px #d2dae2',
                zIndex: 1000,
                width: 179, height: 379,
                top, left
            }}>
                {listButton.map(btn => (
                    <Menu.Item key={btn}>
                        <Container 
                        onMouseDown={() => buttonPanelFunction(btn)}
                        >{btn}</Container>
                    </Menu.Item>
                ))}
   
            </Menu>
        </>
    );
};

export default PanelRightClick;

const Container = styled.div`
    &:hover {
        background: 'grey'
    }
`;



