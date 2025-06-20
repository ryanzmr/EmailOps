import React, { useMemo } from "react"; // Removed useEffect, useState
import { useTable, useRowSelect } from "react-table";

// Indeterminate checkbox component for header row selection (assuming it's still needed and styled)
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="form-checkbox h-5 w-5 text-sky-600 bg-slate-700 border-slate-500 rounded focus:ring-sky-500 cursor-pointer"
      />
    );
  },
);

// EmailDataTable now accepts data, isLoading, and error as props
const EmailDataTable = ({ data, isLoading, error, onSelectedRowsChange }) => {
  const columns = useMemo(
    () => [
      { Header: "Company Name", accessor: "companyName" },
      { Header: "Email ID", accessor: "companyEmail" },
      {
        Header: "Subject",
        accessor: "subjectLine",
        Cell: ({ value }) => (
          <div className="truncate w-40" title={value}>
            {value}
          </div>
        ),
      },
      {
        Header: "Body",
        accessor: "bodyContent",
        Cell: ({ value }) => (
          <div className="truncate w-60" title={value}>
            {value}
          </div>
        ),
      },
      {
        Header: "Attachment Path",
        accessor: "filePath",
        Cell: ({ value }) =>
          value ? (
            <div className="truncate w-32" title={value}>
              {value}
            </div>
          ) : (
            <span className="text-slate-500">None</span>
          ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          let colorClass = "text-slate-300";
          if (value === "Pending") colorClass = "text-yellow-400";
          else if (value === "Completed" || value === "Sent")
            colorClass = "text-green-400";
          else if (value === "Failed") colorClass = "text-red-400";
          return <span className={`font-semibold ${colorClass}`}>{value}</span>;
        },
      },
    ],
    [],
  );

  const tableInstance = useTable(
    // Renamed for clarity, as 'data' is now a prop
    { columns, data: data || [] }, // Use data prop, default to empty array if null/undefined
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = tableInstance;

  // Callback to parent component with selected rows original data
  // This useEffect was fine as it reacts to selectedFlatRows which is internal to useTable
  React.useEffect(() => {
    if (onSelectedRowsChange) {
      onSelectedRowsChange(selectedFlatRows.map((d) => d.original));
    }
  }, [selectedFlatRows, onSelectedRowsChange]);

  if (isLoading)
    return (
      <p className="text-center text-sky-300 py-10">Loading email data...</p>
    );
  if (error) return <p className="text-center text-red-400 py-10">{error}</p>;
  if (!data || !data.length)
    return (
      <p className="text-center text-slate-400 py-10">No email data found.</p>
    );

  return (
    <div className="overflow-x-auto bg-slate-800/50 shadow-md rounded-lg border border-slate-700">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-slate-700"
      >
        <thead className="bg-slate-700/50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-slate-800 divide-y divide-slate-700"
        >
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`hover:bg-slate-700/70 ${row.isSelected ? "bg-sky-900/50" : ""}`}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-300"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmailDataTable;
