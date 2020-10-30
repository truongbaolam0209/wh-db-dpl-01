import { Icon } from 'antd';
import React, { useMemo } from 'react';
import { useExpanded, useGroupBy, useTable } from 'react-table';
import styled from 'styled-components';
import { formatString, pickDataToTable } from '../utils/function';


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

    // console.log(groupBy, expanded);

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => {
                                // console.log('COLUMN .....', column);
                                return (
                                    <th {...column.getHeaderProps()} >
                                        {column.canGroupBy ? (
                                            <span {...column.getGroupByToggleProps()}>
                                                {column.isGrouped ? <IconTable type='stop' color='red' /> : <IconTable type='plus-circle' color='green' />}
                                            </span>
                                        ) : null}
                                        {column.render('Header')}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()} style={{ height: 500, overflowY: 'scroll' }}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // console.log('ROW .....', row);
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
                                                        {row.isExpanded ? <IconTable type='up-circle' color='grey' /> : <IconTable type='down-circle' color='grey' />}
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


const IconTable = ({ type, color }) => {
    return (
        <Icon style={{ fontSize: 16, marginRight: 5, color: color }} type={type} />
    );
};


const getHeaderSorted = (columnsData, columnsHeader) => {
    let arr = [];
    columnsHeader.forEach(header => {
        columnsData.forEach(headerData => {
            if (header === headerData.Header) arr.push(headerData);
        });
    });
    return arr;
};

const getColumnsHeader = (columnsIndexArray) => {
    let columnsName = [];
    for (const key in columnsIndexArray) {
        columnsName.push({
            Header: key,
            accessor: formatString(key),
        });
    };
    return columnsName;
};

const TableDrawingList = ({ data }) => {

    const { drawings, columnsIndexArray, columnsHeader } = data;

    const columnsName = getColumnsHeader(columnsIndexArray);

    const columns = useMemo(() => [
        {
            Header: 'Column Data',
            columns: columnsHeader ? getHeaderSorted(columnsName, columnsHeader) : columnsName,
        },
    ], [columnsHeader, columnsName]);


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
