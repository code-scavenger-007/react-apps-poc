import * as React from 'react';

import { useTable, useFilters, useGlobalFilter } from 'react-table';
import makeData from '../Filtering/makeData';

export default function TableData() {
  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option: any, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  function Table({ columns, data }) {
    const filterTypes = React.useMemo(
      () => ({
        text: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
              : true;
          });
        },
      }),
      []
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      visibleColumns,
    } = useTable(
      {
        columns,
        data,
        filterTypes,
      },
      useFilters,
      useGlobalFilter
    );

    const firstPageRows = rows.slice(0, 10);

    return (
      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {/* Render the columns filter UI */}
                    <div>
                      {column.canFilter ? column.render('Filter') : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: 'left',
                }}
              ></th>
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {firstPageRows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
      </div>
    );
  }

  // const data = React.useMemo(
  //   () => [
  //     {
  //       col1: 'Hello',
  //       col2: 'World',
  //     },
  //     {
  //       col1: 'react-table',
  //       col2: 'rocks',
  //     },
  //     {
  //       col1: 'whatever',
  //       col2: 'you want',
  //     },
  //   ],
  //   []
  // );

  const data = React.useMemo(() => makeData(100000), []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Status',
            accessor: 'status',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
        ],
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <Table columns={columns} data={data} />
    // <table {...getTableProps()}>
    //   <thead>
    //     {
    //       // Loop over the header rows
    //       headerGroups.map((headerGroup) => (
    //         // Apply the header row props
    //         <tr {...headerGroup.getHeaderGroupProps()}>
    //           {
    //             // Loop over the headers in each row
    //             headerGroup.headers.map((column) => (
    //               // Apply the header cell props
    //               <th {...column.getHeaderProps()}>
    //                 {
    //                   // Render the header
    //                   column.render('Header')
    //                 }
    //               </th>
    //             ))
    //           }
    //         </tr>
    //       ))
    //     }
    //   </thead>
    //   {/* Apply the table body props */}
    //   <tbody {...getTableBodyProps()}>
    //     {
    //       // Loop over the table rows
    //       rows.map((row) => {
    //         // Prepare the row for display
    //         prepareRow(row);
    //         return (
    //           // Apply the row props
    //           <tr {...row.getRowProps()}>
    //             {
    //               // Loop over the rows cells
    //               row.cells.map((cell) => {
    //                 // Apply the cell props
    //                 return (
    //                   <td {...cell.getCellProps()}>
    //                     {
    //                       // Render the cell contents
    //                       cell.render('Cell')
    //                     }
    //                   </td>
    //                 );
    //               })
    //             }
    //           </tr>
    //         );
    //       })
    //     }
    //   </tbody>
    // </table>
  );
}
