import { Icon } from 'antd';
import React, { useMemo } from 'react';
import { useExpanded, useFlexLayout, useGroupBy, useResizeColumns, useRowSelect, useTable } from 'react-table';
import styled from 'styled-components';
import { colorType } from '../assets/constant';
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


const headerWithNoGroupFunction = (column) => {
    const arr = [
        'Drawing Number', 'Drawing Name'
    ];
    return arr.indexOf(column) !== -1;
};


const Table = ({ columns, data }) => {

    const defaultColumn = useMemo(() => ({
        // minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        // maxWidth: 200, // maxWidth is only used as a limit for resizing
    }), []);

    const reactTable = useTable(
        {
            columns,
            data,
            // defaultColumn,
        },
        useGroupBy,
        useExpanded,
        useResizeColumns,
        useFlexLayout,
        useRowSelect,
        hooks => {
            hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
                // fix the parent group of the selection button to not be resizable
                const selectionGroupHeader = headerGroups[0].headers[0];
                selectionGroupHeader.canResize = true;
            })
        },
    );

    const {
        getTableProps,
        headerGroups,
        rows,
        prepareRow,
        totalColumnsWidth
    } = reactTable;


    return (
        <Container totalWidth={totalColumnsWidth}>
            <div {...getTableProps()} className='table'>
                <div className='thead'>
                    {headerGroups.map(headerGroup => (
                        <div className='tr' {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => {
                                console.log(headerWithNoGroupFunction(column.Header));
                                return (
                                    <div {...column.getHeaderProps(headerProps)} className='th'>

                                        {column.render('Header')}
                                        {column.canResize && (
                                            <div
                                                {...column.getResizerProps()}
                                                className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                            />
                                        )}
                                        {column.canGroupBy ? (
                                            <span {...column.getGroupByToggleProps()}>
                                                {headerWithNoGroupFunction(column.Header) ? null
                                                    : column.isGrouped ? <IconTable type='stop' color='red' />
                                                        : <IconTable type='plus-circle' color='green' />
                                                }
                                            </span>
                                        ) : null}

                                    </div>
                                )
                            })}
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
                                            {cell.isGrouped ? (
                                                <>
                                                    <span {...row.getExpandedToggleProps()}>
                                                        {row.isExpanded ? <IconTable type='up-circle' color='grey' /> : <IconTable type='down-circle' color='grey' />}
                                                    </span>{' '}
                                                    {cell.render('Cell')} ({row.subRows.length})
                                                </>
                                            ) : cell.isAggregated ? cell.render('Aggregated')
                                                    : cell.isPlaceholder ? null
                                                        : (cell.render('Cell'))}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Container>
    );
};

const Container = styled.div`

    white-space: nowrap;
    height: ${0.6 * window.innerHeight}px;
    display: block;
    overflow: scroll;
    overflow-y: hidden;
    border: 1px solid black;


    .table {

        border-spacing: 0;
        position: relative;

        .thead {
            position: absolute;
            z-index: 1000;
            background-color: ${colorType.grey3};
            top: 0;
        }

        .tbody {
            overflow-y: auto;
            overflow-x: hidden;
            height: ${0.6 * window.innerHeight - scrollbarWidth() - 40}px;
            width: ${props => props.totalWidth}px;
        }

        .tr {
            :last-child {
                .td {
                    border-bottom: 0;
                }
            }
        }
        
        .th, .td {
            color: black;
            margin: 0;
            padding: 0.15rem;
            padding-left: 0.25rem;
            border-right: 1px solid ${colorType.grey2};
            border-bottom: 1px solid ${colorType.grey2};
            /* In this example we use an absolutely position resizer, so this is required. */
            position: relative;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            
            :last-child {
                border-right: 0;
            }
            .resizer {
                right: 0;
                background: ${colorType.grey2};
                width: 0.5px;
                height: 100%;
                position: absolute;
                top: 0;
                z-index: 1;
                /* prevents from scrolling while dragging on touch devices */
                touch-action :none;
                &.isResizing {
                    background: black;
                }
            }
        }
    }
`;



const IconTable = ({ type, color }) => {
    return (
        <Icon style={{ fontSize: 16, marginRight: 5, color: color }} type={type} />
    );
};



const TableDrawingList = ({ data }) => {

    const { drawings, columnsIndexArray, columnsHeader } = data;

    const tableDataInput = pickDataToTable(drawings, columnsIndexArray);

    const columnsName = getColumnsHeader(columnsIndexArray, tableDataInput);

    const columns = useMemo(() => {
        return columnsHeader ? getHeaderSorted(columnsName, columnsHeader) : columnsName
    }, [columnsHeader, columnsName]);

    return (
        <Table columns={columns} data={tableDataInput} />
    );
};
export default TableDrawingList;



