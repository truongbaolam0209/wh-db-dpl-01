import { Button, Icon, Input } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
   useBlockLayout,
   useColumnOrder,
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
import { changeColumnOrder, formatStringNameToId, getColumnsHeader, getHeaderSorted, pickDataToTable } from '../utils/function';
import PanelRightClick from './ui/PanelRightClick';



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

const checkCellFix = (cell) => (
   !cell.isAggregated &&
   !cell.isGrouped &&
   cell.isRepeatedValue &&
   cell.row.subRows.length !== 0 &&
   // cell.row.depth === 0
   cell.row.groupByID !== cell.column.id
);

const cellProps = (props, { cell }) => {

   const colorFix = checkCellFix(cell) && '#f6e58d';

   props.style.background = colorFix || (cell.isGrouped ? '#7ed6df' :
      cell.isAggregated ? '#f6e58d' :
         cell.isPlaceholder ? '#ff000042' :
            'white');
   return getStyles(props, cell.column.align);
};

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

   const [btnActive, setBtnActive] = useState(false);
   const toggleBtn = () => {
      setBtnActive(!btnActive);
      setFilter(undefined);
   };

   return (
      <div style={{ display: 'flex' }}>
         <div onClick={toggleBtn} style={{ cursor: 'pointer' }}>
            {btnActive ? <IconTable type='search' color='green' /> : <IconTable type='search' />}
         </div>
         {btnActive && (
            <input
               value={filterValue || ''}
               onChange={e => {
                  setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
               }}
               placeholder={`Search ${count} records...`}
               style={{ height: 21, margin: 0 }}
            />
         )}
      </div>
   );
};

export const SelectColumnFilter = ({
   column: { filterValue, setFilter, preFilteredRows, id }
}) => {

   const options = useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach(row => {
         options.add(row.values[id]);
      });

      return [...options.values()];
   }, [id, preFilteredRows]);

   const [btnActive, setBtnActive] = useState(false);

   const toggleBtn = () => {
      setBtnActive(!btnActive);
      setFilter(undefined);
   };

   return (
      <div style={{ display: 'flex' }}>
         <div onClick={toggleBtn} style={{ cursor: 'pointer' }}>
            {btnActive
               ? <IconTable type='search' color='green' />
               : <IconTable type='search' />
            }
         </div>

         {btnActive && (
            <select
               value={filterValue}
               onChange={e => setFilter(e.target.value || undefined)}
               style={{ height: 21, width: 40, margin: 0 }}
            >
               <option value=''>All</option>
               {options.map((option, i) => (
                  <option key={i} value={option}>
                     {option}
                  </option>
               ))}
            </select>
         )}
      </div>
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
      <Input.Search
         placeholder='Search ...'
         value={value || ''}
         onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
         }}
         style={{ width: 200 }}
      />
   );
};



const TableDrawingList = ({ data, title }) => {

   const [openAllColumn, setOpenAllColumn] = useState(false);

   const { drawings, columnsIndexArray, columnsHeaderSorted, isSelectedShownOnly } = data;

   const tableDataInput = pickDataToTable(drawings, columnsIndexArray);

   const columnsName = getColumnsHeader(columnsIndexArray, tableDataInput);



   const columns = useMemo(() => {
      return columnsHeaderSorted && !openAllColumn && isSelectedShownOnly ? getHeaderSorted(columnsName, columnsHeaderSorted) : columnsName;
   }, [columnsHeaderSorted, columnsName, openAllColumn, isSelectedShownOnly]);


   const [reorderColumns, setReorderColumns] = useState(false);
   const columnsInput = reorderColumns ? reorderColumns : columns;


   const openAllColumnTable = () => {
      setOpenAllColumn(true);
   };

   const moveColumnLocation = (value, columnActive) => {
      if (value === 1 || value === -1) {
         setReorderColumns(changeColumnOrder(columnsInput, columnActive.id, value));
      };
   };


   return (
      <Table
         title={title}
         columns={columnsInput}
         data={tableDataInput}
         openAllColumnTable={openAllColumnTable}
         moveColumnLocation={moveColumnLocation}
         columnsHeaderSorted={columnsHeaderSorted}
         hiddenColumnsArray={columns.filter(
            cl => cl.Header.includes('(A)') ||
               cl.Header.includes('(T)') ||
               cl.Header === 'Model Progress' ||
               cl.Header === 'Drawing Progress'
         ).map(x => x.accessor)}

      />
   );
};
export default TableDrawingList;



const Table = ({
   columns,
   data,
   hiddenColumnsArray,
   openAllColumnTable,
   title,
   moveColumnLocation,
   columnsHeaderSorted
}) => {

   const listRef = useRef();
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
         initialState: {
            hiddenColumns: hiddenColumnsArray
         },
         autoResetExpanded: false,
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
      useColumnOrder,
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
      state,
      setGlobalFilter,
      toggleHideAllColumns,
      toggleGroupBy,
      toggleExpanded,
      expandedRows

   } = reactTable;

   const { globalFilter, expanded } = state;
   const [panelFunctionVisible, setPanelFunctionVisible] = useState(false);
   const [topPanelFunction, setTopPanelFunction] = useState(0);
   const [leftPanelFunction, setLeftPanelFunction] = useState(0);




   useEffect(() => {
      columnsHeaderSorted && columnsHeaderSorted.forEach(name => {
         if (name !== 'Drawing Name' && name !== 'Drawing Number') {
            toggleGroupBy(formatStringNameToId(name), true);
         };
      });
   }, []);

   const [maxRowExpand, setMaxRowExpand] = useState(0);
   useEffect(() => {
      setMaxRowExpand(Object.values(expanded).length);

      if (Object.values(expanded).length >= maxRowExpand) {
         expandedRows.forEach(row => {
            toggleExpanded(row.id, true);
         });
      };
   }, [expandedRows]);


   const handleMouseDown = (e) => {
      if (e.button === 0) setPanelFunctionVisible(false);
   };
   useEffect(() => {
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
   }, []);

   const panelFunction = (e, column) => {
      setColumnActive(column);
      setPanelFunctionVisible(true);
      const clickX = e.clientX;
      const clickY = e.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const right = (screenW - clickX) > 179;
      const left = !right;
      const top = (screenH - clickY) > 379;
      const bottom = !top;

      if (right) {
         setLeftPanelFunction(`${clickX + 5}px`);
      };
      if (left) {
         setLeftPanelFunction(`${clickX - 179 - 5}px`);
      };
      if (top) {
         setTopPanelFunction(`${clickY + 5}px`);
      };
      if (bottom) {
         setTopPanelFunction(`${clickY - 379 - 5}px`);
      };
   };

   const [columnActive, setColumnActive] = useState(false);
   const buttonPanelFunction = (btn) => {
      // console.log(columnActive);
      if (btn === 'Hide this column') {
         columnActive.toggleHidden(true);
      } else if (btn === 'Unhide all') {
         toggleHideAllColumns(false);
      } else if (btn === 'Move to left') {
         moveColumnLocation(-1, columnActive);
      } else if (btn === 'Move to right') {
         moveColumnLocation(1, columnActive);
      } else if (btn === 'Move to ...') {
         return;
      };
   };



   const RenderRow = useCallback(args => {
      const { index, style } = args;
      const row = rows[index];
      prepareRow(row);

      return (
         <div {...row.getRowProps({ style })} className='tr'>
            {row.cells.map(cell => {
               // console.log(cell);
               return (
                  <div {...cell.getCellProps(cellProps)} className='td'>
                     {cell.isGrouped ? (
                        <>
                           <span {...row.getExpandedToggleProps()}>
                              {row.isExpanded ? <IconTable type='up-circle' color='grey' /> : <IconTable type='down-circle' color='grey' />}
                           </span>{' '}
                           {cell.render('Cell')} ({row.subRows.length + ' nos'})
                        </>
                     ) : cell.isAggregated ? cell.render('Aggregated')
                           : cell.isPlaceholder ? null
                              : checkCellFix(cell) ? null
                                 : cell.render('Cell')}
                  </div>
               );
            })}
         </div>
      );
   }, [prepareRow, rows]);




   return (
      <>
         <div style={{ display: 'flex', marginBottom: 15 }}>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            {title.type === 'Sorted table' && (
               <Button onClick={openAllColumnTable} style={{ marginLeft: 15, background: colorType.grey4 }}>View all drawings</Button>
            )}

         </div>


         <Container>
            <div {...getTableProps()} className='table'>
               <div className='thead'>
                  {headerGroups.map(headerGroup => (
                     <div className='tr' {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                           // console.log(column);
                           return (
                              <div
                                 className='th'
                                 {...column.getHeaderProps(headerProps)}
                              >
                                 {column.canResize && (
                                    <div {...column.getResizerProps()}
                                       className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                                    />
                                 )}

                                 <div style={{ fontWeight: 'bold', marginRight: 10 }}>
                                    {column.render('Header')}
                                 </div>

                                 {column.canGroupBy && column.Header !== '' && (
                                    <span {...column.getGroupByToggleProps()}>
                                       {headerWithNoGroupFunction(column.Header) ? null
                                          : column.isGrouped ? <IconTable type='stop' color='red' />
                                             : <IconTable type='plus-circle' />
                                       }
                                    </span>
                                 )}

                                 <span {...column.getSortByToggleProps()}
                                    onClick={
                                       column.canSort ? (e) => {
                                          e.persist();
                                          column.toggleSortBy(undefined, !disableMultiSort && isMultiSortEvent(e));
                                          listRef.current.scrollToItem(0);
                                       } : undefined
                                    }
                                 >
                                    {column.isSorted
                                       ? (column.isSortedDesc
                                          ? <IconTable type='sort-ascending' color='green' />
                                          : <IconTable type='sort-descending' color='green' />)
                                       : <IconTable type='ordered-list' />}
                                 </span>

                                 <span>
                                    {column.Header !== '' && (
                                       <div
                                          style={{ cursor: 'pointer' }}
                                          onClick={(e) => panelFunction(e, column)}
                                       ><IconTable type='down-circle' /></div>
                                    )}
                                 </span>

                                 <span>
                                    {column.canFilter && column.Header !== ''
                                       ? column.render('Filter') : null
                                    }
                                 </span>


                              </div>
                           )
                        })}
                     </div>
                  ))}
               </div>

               <div {...getTableBodyProps()} className='tbody'>
                  <FixedSizeList
                     ref={listRef}
                     height={500}
                     itemCount={rows.length}
                     itemSize={25}
                     width={totalColumnsWidth}
                     // width={3500}
                     style={{ overflowX: 'hidden' }}
                  >
                     {RenderRow}
                  </FixedSizeList>
               </div>

            </div>
         </Container>

         {panelFunctionVisible && (
            <PanelRightClick
               left={leftPanelFunction} top={topPanelFunction}
               buttonPanelFunction={buttonPanelFunction}
            />
         )}

      </>
   );
};

const borderLine = `1px solid ${colorType.grey2}`

const Container = styled.div`

    white-space: nowrap;
    height: ${0.6 * window.innerHeight}px;
    display: block;
    overflow: scroll;
    overflow-y: hidden;
    border: ${borderLine};


    .table {

        border-spacing: 0;
        position: relative;

        .thead {
            position: absolute;
            z-index: 1000;
            background-color: ${colorType.grey1};
            top: 0;
        }

        .tbody {
            padding-top: 36px;
            overflow-y: auto;
            overflow-x: hidden;
            height: ${0.7 * window.innerHeight}px;
            /* width: ${props => props.totalWidth}px; */
            /* .tr:first-child {
                padding-top: 100px; // shift down the first row of body
            } */
        }

        .tr {
            :last-child {
                .td {
                    /* border-bottom: 0; */
                }
            }
        }

    
        /* .tr:nth-child(even) {
            background-color: ${colorType.grey4};
        } */
        
        .th, .td {
            color: black;
            margin: 0;
            padding: 0.1rem;
            padding-left: 0.3rem;
            border-right: ${borderLine};
            border-bottom: ${borderLine};
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
                background: ${colorType.grey1};
                width: 5px;
                height: 100%;
                position: absolute;
                top: 0;
                z-index: 1;
                /* prevents from scrolling while dragging on touch devices */
                touch-action :none;
                &.isResizing {
                    background: ${colorType.grey2};
                }
            }
        }

        .th {
            padding: 0.4rem;
        }

        
    }
`;



const IconTable = ({ type, color }) => {
   return (
      <IconStyle color={color || colorType.black} type={type} />
   );
};

const IconStyle = styled(Icon)`
   font-size: 16px;
   margin-right: 5px;
   color: ${props => props.color};
   padding: 2px;
   border-radius: 3px;
   border: 0.5px solid ${colorType.grey4};
   :hover {
      background: ${colorType.grey4}
   }
`;





