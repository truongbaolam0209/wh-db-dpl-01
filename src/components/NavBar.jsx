import { Avatar, BackTop, Divider, Icon, Layout, Row } from 'antd';
import React from 'react';
import { colorType, sizeType } from '../assets/constant';


const NavBar = props => {

    const { children } = props;


    return (
        <Layout >
            <Layout.Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 10px', height: 55, background: '#576574' }}>
                <div style={{ paddingTop: 5 }}>
   

                    <Row style={{ float: 'left' }}>
                        {/* <img alt='logo' style={{ transform: 'translateY(-10px) translateX(-5px)' }} width={150} src='./img/logo3.png' /> */}
                    </Row>


                    <Row style={{ float: 'right' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ color: 'white', paddingRight: 15 }}>
                                <div style={{ lineHeight: '22px', fontSize: 17, textAlign: 'right' }}>Jonas Shelomoh</div>
                                <div style={{ lineHeight: '20px', fontSize: 13, textAlign: 'right' }}>Project Director</div>
                            </div>
                            <Avatar size={40} icon='user' />
                            {window.innerWidth <= sizeType.xs ? '' : (
                                <>
                                    <Divider type='vertical' style={{ backgroundColor: '#f9ca24', height: 40, width: 1, margin: '0 15px' }} />
                                    <Icon type='message' style={{ color: '#f9ca24', fontSize: 40, marginRight: 10 }}/>
                                    <Icon type='down-circle' style={{ color: '#f9ca24', fontSize: 40, marginRight: 10 }}/>
                                </>
                            )}

                        </div>
                    </Row>

                </div>



            </Layout.Header>


            <BackTop>
                <div style={{
                    zIndex: 1000,
                    height: 40,
                    width: 40,
                    lineHeight: '40px',
                    borderRadius: 4,
                    backgroundColor: colorType.yellow,
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 20,
                }}><Icon style={{ fontSize: '30px' }} type='arrow-up' /></div>
            </BackTop>

            {children}

        </Layout>
    );
};

export default NavBar;
