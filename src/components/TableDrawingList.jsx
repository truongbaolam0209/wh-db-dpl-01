import { Icon } from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import {
    useBlockLayout,
    useExpanded,
    useFilters,
    useFlexLayout,
    useGlobalFilter,
    useGroupBy,
    useResizeColumns,
    useRowSelect,
    useSortBy,
    useTable
} from 'react-table';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components';
import { colorType } from '../assets/constant';
import { getColumnsHeader, getHeaderSorted, pickDataToTable } from '../utils/function';



const scrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.setAttribute(
        'style',
        'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
    );
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
};

const headerProps = (props, { column }) => {
    return getStyles(props, column.align);
};

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


export const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
}) => {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
};



export const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
}) => {

    const options = useMemo(() => {
        const options = new Set();
        
        preFilteredRows.forEach(row => {
            options.add(row.values[id]);
        });

        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <select
            value={filterValue}
            onChange={e => setFilter(e.target.value || undefined)}>

            <option value=''>All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};


export const GlobalFilter = ({ filter, setFilter }) => {

    const [value, setValue] = useState(filter);

    const onChange = value => {
        setTimeout(() => {
            setFilter(value || undefined);
        }, 1000);
    };

    return (
        <span>
            Search:{' '}
            <input
                value={value || ''}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
            />
        </span>
    );
};


const Table = ({ columns, data }) => {

    const listRef = React.useRef();

    const defaultColumn = useMemo(() => ({
        // minWidth: 30, // minWidth is only used as a limit for resizing
        // width: 150, // width is used for both the flex-basis and flex-grow
        // maxWidth: 200, // maxWidth is only used as a limit for resizing
        Filter: DefaultColumnFilter,
    }), []);

    const scrollBarSize = useMemo(() => scrollbarWidth(), []);

    const reactTable = useTable(
        {
            columns,
            data,
            defaultColumn,
        },
        useFilters,
        useGlobalFilter,
        useGroupBy,
        useExpanded,
        useSortBy,
        useResizeColumns,
        useFlexLayout,
        useRowSelect,
        useBlockLayout,
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
        getTableBodyProps,
        headerGroups,
        rows,
        totalColumnsWidth,
        prepareRow,
        disableMultiSort,
        isMultiSortEvent = (e) => e.shiftKey,
        state: { globalFilter },
        setGlobalFilter
    } = reactTable;


    const RenderRow = useCallback(args => {

        const { index, style } = args;
        const row = rows[index];
        prepareRow(row);
        return (
            <div {...row.getRowProps({ style })} className='tr'>
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
    }, [prepareRow, rows]);


    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            <Container>
                <div {...getTableProps()} className='table'>
                    <div className='thead'>
                        {headerGroups.map(headerGroup => (
                            <div className='tr' {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => {
                                    // console.log(column.Header, column);
                                    return (
                                        <div
                                            className='th'
                                            {...column.getHeaderProps(headerProps)}

                                        >

                                            {column.render('Header')}

                                            {column.canResize && (
                                                <div {...column.getResizerProps()}
                                                    className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                                />
                                            )}
                                            {column.canGroupBy && (
                                                <span {...column.getGroupByToggleProps()}>
                                                    {headerWithNoGroupFunction(column.Header) ? null
                                                        : column.isGrouped ? <IconTable type='stop' color='red' />
                                                            : <IconTable type='plus-circle' color='green' />
                                                    }
                                                </span>
                                            )}

                                            <span {...column.getSortByToggleProps()}
                                                onClick={
                                                    column.canSort ? (e) => {
                                                        console.log('CHECK ...', e);
                                                        e.persist();
                                                        column.toggleSortBy(undefined, !disableMultiSort && isMultiSortEvent(e));
                                                        listRef.current.scrollToItem(0);
                                                    } : undefined
                                                }
                                            >
                                                {column.isSorted
                                                    ? (column.isSortedDesc
                                                        ? <IconTable type='sort-ascending' />
                                                        : <IconTable type='sort-descending' />)
                                                    : <IconTable type='ordered-list' />}
                                            </span>

                                            <span>{column.canFilter ? column.render('Filter') : null}</span>



                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                    <div {...getTableBodyProps()} className='tbody'>
                        <FixedSizeList
                            ref={listRef}
                            height={400}
                            itemCount={rows.length}
                            itemSize={35}
                            width={totalColumnsWidth + scrollbarWidth()}
                        >
                            {RenderRow}
                        </FixedSizeList>
                    </div>

                </div>
            </Container>
        </>
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
            padding-top: 39px;
            overflow-y: auto;
            overflow-x: hidden;
            height: ${0.6 * window.innerHeight - scrollbarWidth() - 40}px;
            /* width: ${props => props.totalWidth}px; */
            /* .tr:first-child {
                padding-top: 100px; // shift down the first row of body
            } */
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
            padding-left: 0.3rem;
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

        .th {
            padding: 0.35rem;
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
        return columnsHeader ? getHeaderSorted(columnsName, columnsHeader) : columnsName;
    }, [columnsHeader, columnsName]);

    return (
        <Table columns={columns} data={tableDataInput} />
    );
};
export default TableDrawingList;



