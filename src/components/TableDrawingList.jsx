import { Icon } from 'antd';
import React, { useMemo } from 'react';
import { useFlexLayout, useResizeColumns, useRowSelect, useTable } from "react-table";
import styled from 'styled-components';
import { getColumnsHeader, getHeaderSorted, pickDataToTable } from '../utils/function';
import scrollbarWidth from './tableDrawingList/scrollbarWidth';




const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = 'left') => [props,
    {
        style: {
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
        },
    },
];


const Table = ({ columns, data }) => {

    const defaultColumn = useMemo(() => ({
        // minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        // maxWidth: 200, // maxWidth is only used as a limit for resizing
    }), []);

    const { 
        getTableProps, 
        headerGroups, 
        rows, 
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useResizeColumns,
        useFlexLayout,
        useRowSelect,
        hooks => {
            hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
                // fix the parent group of the selection button to not be resizable
                const selectionGroupHeader = headerGroups[0].headers[0];
                selectionGroupHeader.canResize = true;
            })
        }
    );



    return (
        <div {...getTableProps()} className='table'>

            <div className='thead'>
                {headerGroups.map(headerGroup => (
                    <div className='tr'
                        {...headerGroup.getHeaderGroupProps({
                            style: { paddingRight: '15px' }
                        })}
                    >
                        {headerGroup.headers.map(column => (
                            <div {...column.getHeaderProps(headerProps)} className='th'>
                                {column.render('Header')}
                                {/* Use column.getResizerProps to hook up the events correctly */}
                                {column.canResize && (
                                    <div
                                        {...column.getResizerProps()}
                                        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className='tbody'>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <div {...row.getRowProps()} className='tr'>
                            {row.cells.map(cell => {
                                return (
                                    <div {...cell.getCellProps(cellProps)} className='td'>
                                        {cell.render('Cell')}
                                    </div>
                                )
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const TableComp = styled.table``;


const IconTable = ({ type, color }) => {
    return (
        <Icon style={{ fontSize: 16, marginRight: 5, color: color }} type={type} />
    );
};



const TableDrawingList = ({ data }) => {

    const { drawings, columnsIndexArray, columnsHeader } = data;

    const columnsName = getColumnsHeader(columnsIndexArray);

    const columns = useMemo(() => {
        return columnsHeader ? getHeaderSorted(columnsName, columnsHeader) : columnsName
    }, [columnsHeader, columnsName]);

    console.log(columns);

    return (
        <Container>
            <Table columns={columns} data={pickDataToTable(drawings, columnsIndexArray)} />
        </Container>
    );
};
export default TableDrawingList;



const Container = styled.div`

    /* white-space: nowrap; */
    height: ${0.6 * window.innerHeight}px;

    display: block;
    overflow: scroll;

    border: 1px solid black;

    .table {
        border-spacing: 0;
        position: relative;

        .thead {
            /* background-color: red; */
        }

        .thead .tr {
            background-color: red;
        }

        .tbody {
            /* overflow: overlay; */
            height: ${0.6 * window.innerHeight - scrollbarWidth() - 40}px;
        }

        .tr {
            :last-child {
                .td {
                    border-bottom: 0;
                }
            }
        }

        .th, .td {
            margin: 0;
            padding: 0.5rem;
            border-right: 1px solid black;
            border-bottom: 1px solid black;

            
            position: relative;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            :last-child {
                border-right: 0;
            }

            .resizer {
                right: 0;
                background: blue;
                width: 2px;
                height: 100%;
                position: absolute;
                top: 0;
                z-index: 1;
                /* prevents from scrolling while dragging on touch devices */
                touch-action :none;

                &.isResizing {
                    background: red;
                }
            }
        }
    }
`;
