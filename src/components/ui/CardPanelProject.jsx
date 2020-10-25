import { Card, Row } from 'antd';
import React from 'react';
import { colorType } from '../../assets/constant';



const CardPanelProject = ({ children, title }) => {


    return (
        <Card
            title={title}
            style={{
                margin: 0, boxShadow: '5px 15px 24px 5px #d2dae2',
                border: 'none',
                paddingBottom: 20,
                marginBottom: 20,
                borderRadius: 20, overflow: 'hidden',
            }}
            bodyStyle={{
                margin: 'auto',
                padding: 0,
            }}
            headStyle={{
                backgroundColor: colorType.grey2,
                color: 'white',
                lineHeight: '15px'
            }}
        >
            <div style={{ margin: '20px' }}>
                <Row justify='space-around'>
                    {children}
                </Row>
            </div>
        </Card>
    );
};

export default CardPanelProject;
