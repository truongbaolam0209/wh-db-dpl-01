import { Col, Divider, Modal, Row, Skeleton } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChartBarDrawing from '../components/ChartBarDrawing';
import ChartBarDrawingLate from '../components/ChartBarDrawingLate';
import ChartBarStack from '../components/ChartBarStack';
import ChartPieDrawing from '../components/ChartPieDrawing';
import ChartProgress from '../components/ChartProgress';
import FormPivot from '../components/FormPivot';
import NavBar from '../components/NavBar';
import TableDrawingList from '../components/TableDrawingList';
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
    const [dummy, setDummy] = useState({});


    useEffect(() => {

        const loadData = async () => {
            setLoading(true);
            try {
                const result = await Axios.post(
                    'https://bim.wohhup.com/api/smartsheet/get-sheets-dashboard',
                    {
                        listSheetId: [
                            4758181617395588,
                            8919906142971780,
                        ]
                    }
                );
                setData(getDataConverted(result.data));
                setDummy(dummyData);
                setLoading(false);

                // setTimeout(() => {
                //     const result = JSON.parse(localStorage.getItem('wh'));
                //     console.log('-----------------------------------------', 'DATA FETCHED');
                //     setData(getDataConverted(result));
                //     setDummy(dummyData);
                //     setLoading(false);
                // }, 1000);
                localStorage.setItem('wh', JSON.stringify(result.data));
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
    const openDrawingTable = (projectName, title, drawings, columnsIndexArray, columnsHeaderSorted, isSelectedShownOnly) => {
        setDrawingTableData({ projectName, title, drawings, columnsIndexArray, columnsHeaderSorted, isSelectedShownOnly });
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
                    <ChartBarDrawingLate data={dummy.dummyLateConstruction} title='No Of Drawing Late Construction' />
                    <ChartBarDrawingLate data={data} title='No Of Drawing Late Approval' />
                    <ChartBarStack data={data} title='Drawing Status' />
                    <ChartBarStack data={dummy.productivityDummy} title='Productivity - (days per drawing)' />
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
                            <h3 style={{ padding: '0 0 10px 0' }}>{drawingTableData.title.type}</h3>
                            <Divider type='vertical' style={{ height: 25 }} />
                            <h3 style={{ padding: '0 10px' }}>{drawingTableData.title.category}</h3>
                            <Divider type='vertical' style={{ height: 25 }} />
                            <h3 style={{ padding: '0 10px' }}>{drawingTableData.drawings.length + ' drawings'}</h3>
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
            <CardPanelProject title='Project loading ...'>
                <div style={{ padding: '0 3px' }}>
                    <Skeleton paragraph={{ rows: 14 }} active />
                </div>
            </CardPanelProject>
        </div>
    );
};



const dummyData = {
    productivityDummy: {
        inputData: [
            {
                'Consultant review and reply': 4,
                'Create update drawing': 3,
                'Create update model': 7,
                'name': 'Sumang'
            },
            {
                'Consultant review and reply': 5,
                'Create update drawing': 4,
                'Create update model': 6,
                'name': 'Handy'
            }
        ],
        inputStack: ['Consultant review and reply', 'Create update drawing', 'Create update model']
    },
    dummyLateConstruction: [
        { name: 'Handy', value: 6 },
        { name: 'Sumang', value: 15 },
    ]
};
