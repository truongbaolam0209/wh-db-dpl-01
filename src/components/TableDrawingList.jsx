import { Icon } from 'antd';
import React, { useMemo } from 'react';
import { useExpanded, useGroupBy, useTable } from 'react-table';
import styled from 'styled-components';
import { pickDataToTable } from '../utils/function';



const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        // state: { groupBy, expanded }
    } = useTable(
        {
            columns,
            data
        },
        useGroupBy,
        useExpanded,
        // useBlockLayout
    );


    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column =>
                                <th {...column.getHeaderProps()} >
                                    {column.canGroupBy ? (
                                        <span {...column.getGroupByToggleProps()}>
                                            {column.isGrouped ? <IconTable type='stop' /> : <IconTable type='plus-circle' />}
                                        </span>
                                    ) : null}
                                    {column.render('Header')}
                                </th>
                            )}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()} style={{ height: 500, overflowY: 'scroll' }}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    console.log(row);
                                    return (
                                        <td {...cell.getCellProps()}
                                            style={{
                                                background: cell.isGrouped
                                                    ? '#0aff0082'
                                                    : cell.isAggregated
                                                        ? '#ffa50078'
                                                        : cell.isPlaceholder
                                                            ? '#ff000042'
                                                            : 'white',
                                            }}
                                        >
                                            {cell.isGrouped ? (
                                                <>
                                                    <span {...row.getExpandedToggleProps()}>
                                                        {row.isExpanded ? <IconTable type='up-circle' /> : <IconTable type='down-circle' />}
                                                    </span>{' '}
                                                    {cell.render('Cell')} ({row.subRows.length})
                                                </>
                                            )
                                                : cell.isAggregated ? cell.render('Aggregated')
                                                    : cell.isPlaceholder ? null
                                                        : (cell.render('Cell'))}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </>
    );
};

const IconTable = ({ type }) => {

    return (
        <Icon style={{ fontSize: 16, marginRight: 5, color: 'red' }} type={type} />
    );
};

const TableDrawingList = ({ data }) => {

    const columns = useMemo(() => [
        {
            Header: 'Name',
            columns: [
                {
                    Header: 'Drawing Number',
                    accessor: 'drawingNumber',
                },
                {
                    Header: 'Drawing Name',
                    accessor: 'drawingName',
                },
            ],
        },
        {
            Header: 'Info',
            columns: [
                {
                    Header: 'RFA Ref',
                    accessor: 'rfaRef',
                },
                {
                    Header: 'Drg Type',
                    accessor: 'drgType',
                },
                {
                    Header: 'Use For',
                    accessor: 'useFor',
                },
                {
                    Header: 'Coordinator In Charge',
                    accessor: 'coordinatorInCharge',
                },
                {
                    Header: 'Modeller',
                    accessor: 'modeller',
                },
                {
                    Header: 'Drg To Consultant (T)',
                    accessor: 'drgToConsultantT',
                },
                {
                    Header: 'Drg To Consultant (A)',
                    accessor: 'drgToConsultantA',
                },
                {
                    Header: 'get Approval (T)',
                    accessor: 'getApprovalT',
                },
                {
                    Header: 'get Approval (A)',
                    accessor: 'getApprovalA',
                },
                {
                    Header: 'Rev',
                    accessor: 'rev',
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                },
            ],
        },
    ], []);

    const { drawings, columnsIndexArray } = data;

    return (
        <Container>
            <Table columns={columns} data={pickDataToTable(drawings, columnsIndexArray)} />
        </Container>
    );
};



export default TableDrawingList;


const Container = styled.div`
    padding: 1rem;
    overflow: auto;
    white-space: nowrap;
    overflow-y: scroll;
    height: ${0.6 * window.innerHeight}px;
    vertical-align: middle;

    table {
        border-spacing: 0;
        border: 1px solid black;

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th, td {
            margin: 0;
            padding: 0.2rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            :last-child {
                border-right: 0;
            }
        }
    }
`;
