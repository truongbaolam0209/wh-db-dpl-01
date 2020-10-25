import { Col, Divider, Modal, Row, Skeleton } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { colorType } from '../assets/constant';
import ChartBarDrawing from '../components/ChartBarDrawing';
import ChartBarDrawingLate from '../components/ChartBarDrawingLate';
import ChartBarStack from '../components/ChartBarStack';
import ChartPieDrawing from '../components/ChartPieDrawing';
import ChartProgress from '../components/ChartProgress';
import FormPivot from '../components/FormPivot';
import NavBar from '../components/NavBar';
import TableDrawingList from '../components/TableDrawingList';
import CardPanel from '../components/ui/CardPanel';
import CardPanelProject from '../components/ui/CardPanelProject';
import { getDataConverted } from '../utils/function';



const PageDashboard = () => {


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const loadData = async () => {
            setLoading(true);
            try {
                const result = await Axios.post(
                    'https://bim.wohhup.com/api/smartsheet/get-sheets-dashboard',
                    { listSheetId: [8919906142971780, 4758181617395588] }
                );
                setData(getDataConverted(result.data));
                setLoading(false);

                // setTimeout(() => {
                //     const result = JSON.parse(localStorage.getItem('wh'));
                //     console.log('-----------------------------------------', 'DATA FETCHED');
                //     setData(getDataConverted(result));
                //     setLoading(false);
                // }, 100);
                // localStorage.setItem('wh', JSON.stringify(result.data));
            } catch (err) {
                console.log(err);
                setLoading(false);
            };
        };
        loadData();
    }, []);


    const [drawingTableVisible, setDrawingTableVisible] = useState(false);
    const [drawingTableData, setDrawingTableData] = useState(null);
    const openDrawingTable = (projectName, title, drawings, columnsIndexArray) => {
        setDrawingTableData({ projectName, title, drawings, columnsIndexArray });
        setDrawingTableVisible(true);
    };


    return (
        <NavBar>
            <div style={{ marginTop: '60px' }}>
                <Row justify='space-around' style={{ margin: '25px 0 5px 0' }}>
                    <ChartBarDrawingLate title='No Of Drawing Late Construction' />
                    <ChartBarDrawingLate data={data} title='No Of Drawing Late Approval' />
                    <ChartBarStack data={data} title='Drawing Status' />
                    <ChartBarStack title='Productivity - (days per drawing)' />
                </Row>

                {!loading && data ? (
                    <div style={{ padding: '0 12px' }}>
                        {Object.keys(data).map(projectName => {
                            return (
                                <CardPanelProject
                                    title={projectName.toUpperCase()}
                                    key={projectName}
                                >
                                    <ChartPanel title='Overdue submissions'>
                                        <ChartProgress
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.md && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Drawing Status'>
                                        <ChartPieDrawing
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.xl && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Drawing counts by revision'>
                                        <ChartBarDrawing
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                    {/* {deviceWidth && deviceWidth >= sizeType.md && <Divider type='horizontal' style={{ padding: '3px 0' }} />} */}

                                    <ChartPanel title='Sorted table by category'>
                                        <FormPivot
                                            data={data[projectName]}
                                            openDrawingTable={openDrawingTable}
                                            projectName={projectName}
                                        />
                                    </ChartPanel>

                                </CardPanelProject>
                            )
                        })}
                    </div>
                ) : <SkeletonCard />}


                {drawingTableData && (
                    <Modal
                        title={drawingTableData.projectName}
                        visible={drawingTableVisible}
                        onOk={() => setDrawingTableVisible(false)}
                        onCancel={() => setDrawingTableVisible(false)}
                        width={0.9 * window.innerWidth}
                        height={0.7 * window.innerHeight}
                        // centered={true}
                        style={{
                            // justifyContent: 'center',
                            // alignItems: 'center'
                        }}
                    >
                        <h2>{drawingTableData.title.type}</h2>
                        <div style={{ display: 'flex' }}>
                            <h3>{drawingTableData.title.category}</h3>
                            <Divider type='vertical' />
                            <h3>{drawingTableData.drawings.length + ' drawings'}</h3>
                        </div>

                        <TableDrawingList
                            data={drawingTableData}
                        />
                    </Modal>
                )}




            </div>
        </NavBar>
    );
};

export default PageDashboard;





const ChartPanel = ({ title, children }) => {
    return (
        <Col style={{ marginBottom: 10 }} xs={24} md={12} xl={6}>
            <div style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold' }}>{title}</div>
            {children}
        </Col>
    );
};


const SkeletonCard = () => {
    return (
        <div style={{ padding: '0 12px' }}>
            <CardPanel
                title='Project loading ...'
                headColor={colorType.grey2}
                headTitleColor={'white'}
            >
                <div style={{ padding: '20px', marginBottom: '95px' }}><Skeleton /><Skeleton /></div>
            </CardPanel>
            <CardPanel
                title='Project loading ...'
                headColor={colorType.grey2}
                headTitleColor={'white'}
            >
                <div style={{ padding: '20px', marginBottom: '95px' }}><Skeleton /><Skeleton /></div>
            </CardPanel>
        </div>
    );
};


