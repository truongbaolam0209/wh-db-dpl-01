import React from 'react';
import styled from 'styled-components';

const ButtonCapsule = props => {
    const { btnname, color } = props;

    return (
        <Container {...props} color={color} >
            {btnname}
        </Container >
    );
};

export default ButtonCapsule;

// const Container = styled(Button)`
const Container = styled.div`
    &:hover {
        cursor: pointer;
        background: #bdc3c7;
    }
    transition: 0.3s;
    line-height: 13px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3px;
    padding: 5px;
    border: 1px solid;
    border-radius: 500px;
    border-color: ${props => props.color};
    background: ${props => props.color};
    
`;
