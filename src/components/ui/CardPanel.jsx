import { Card, Col } from 'antd';
import React from 'react';



const CardPanel = ({ children, title, headColor }) => {


    return (
        <Col style={{ padding: '0 15px' }} xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 6 }}>
            <Card
                title={title}
                style={{
                    margin: 0, boxShadow: '5px 15px 24px 5px #d2dae2',
                    border: 'none',
                    paddingBottom: 20,
                    marginBottom: 20,
                    borderRadius: 20, overflow: 'hidden'
                }}
                bodyStyle={{
                    margin: 'auto',
                    padding: 0
                }}
                headStyle={{
                    backgroundColor: headColor,
                    color: 'white',
                    lineHeight: '15px'
                }}
            >
                {children}
            </Card>
        </Col>
    );
};


export default CardPanel;
