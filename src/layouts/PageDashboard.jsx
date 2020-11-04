import { Col, Divider, Modal, Row, Skeleton } from 'antd';
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

    useEffect(() => {
        // document.addEventListener('contextmenu', event => event.preventDefault());
        // return () => document.addEventListener('contextmenu', event => event.preventDefault());
    }, []);


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [dataRecord, setDataRecord] = useState(null);


    useEffect(() => {

        const loadData = async () => {
            setLoading(true);
            try {
                // const result = await Axios.post(
                //     'https://bim.wohhup.com/api/smartsheet/get-sheets-dashboard',
                //     {
                //         listSheetId: [
                //             8919906142971780,
                //             4758181617395588
                //         ]
                //     }
                // );
                // setData(getDataConverted(result.data));
                // setLoading(false);

                setTimeout(() => {
                    const result = JSON.parse(localStorage.getItem('wh'));
                    console.log('-----------------------------------------', 'DATA FETCHED');
                    setData(getDataConverted(result));
                    setLoading(false);
                }, 100);
                // localStorage.setItem('wh', JSON.stringify(result.data));
            } catch (err) {
                console.log(err);
                setLoading(false);
            };
        };
        loadData();
        // loadRecords();

    }, []);


    const [drawingTableVisible, setDrawingTableVisible] = useState(false);
    const [drawingTableData, setDrawingTableData] = useState(null);
    const openDrawingTable = (projectName, title, drawings, columnsIndexArray, columnsHeader) => {
        setDrawingTableData({ projectName, title, drawings, columnsIndexArray, columnsHeader });
        setDrawingTableVisible(true);
    };


    const closeTableAndReset = () => {
        setDrawingTableVisible(false);
        setDrawingTableData(null);
    };



    return (
        <NavBar>

            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <Row justify='space-around' style={{ margin: '25px 0 5px 0' }}>
                    <ChartBarDrawingLate title='No Of Drawing Late Construction' />
                    <ChartBarDrawingLate data={data} title='No Of Drawing Late Approval' />
                    <ChartBarStack data={data} title='Drawing Status' />
                    <ChartBarStack data={productivityData} title='Productivity - (days per drawing)' />
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

                                    <ChartPanel title='Nos of drawing per revision'>
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
                                        // dataRecord={dataRecord}
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
                        footer={false}
                        onCancel={closeTableAndReset}
                        width={0.9 * window.innerWidth}
                        height={0.7 * window.innerHeight}
                        // centered={true}
                        style={{
                            // justifyContent: 'center',
                            // alignItems: 'center'
                        }}
                        bodyStyle={{
                            paddingTop: 10
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <h3 style={{ background: colorType.green, padding: '0 10px' }}>{drawingTableData.title.type}</h3>
                            <Divider type='vertical' style={{ height: 25 }} />
                            <h3 style={{ background: colorType.yellow, padding: '0 10px' }}>{drawingTableData.title.category}</h3>
                            <Divider type='vertical' style={{ height: 25 }} />
                            <h3 style={{ background: colorType.grey1, padding: '0 10px' }}>{drawingTableData.drawings.length + ' drawings'}</h3>
                        </div>

                        <TableDrawingList
                            data={drawingTableData}
                            title={drawingTableData.title}
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



const productivityData = {
    inputData: [
        {
            'Modelling': 3,
            'Shopdrawing': 5,
            'Submit To Consultant': 2,
            'Consultant Reply': 5,
            'Get Approval': 4,
            'name': 'Sumang'
        },
        {
            'Modelling': 4,
            'Shopdrawing': 6,
            'Submit To Consultant': 3,
            'Consultant Reply': 4,
            'Get Approval': 2,
            'name': 'Handy'
        }
    ],
    inputStack: ['Modelling', 'Shopdrawing', 'Submit To Consultant', 'Consultant Reply', 'Get Approval']
};


