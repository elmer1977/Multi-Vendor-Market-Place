import React, { useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";

const FilterableDataGrid = ({ rows = [], columns = [], ...gridProps }) => {
  const [search, setSearch] = useState("");

  const searchableRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) => {
        if (
          value === null ||
          value === undefined ||
          (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean")
        ) {
          return false;
        }

        return String(value).toLowerCase().includes(query);
      })
    );
  }, [rows, search]);

  const sortableFilterableColumns = useMemo(
    () =>
      columns.map((column) => {
        const hasRowValue = rows.some((row) =>
          Object.prototype.hasOwnProperty.call(row, column.field)
        );
        const isActionColumn = Boolean(column.renderCell) && !hasRowValue;

        return {
          ...column,
          sortable: column.sortable !== false && !isActionColumn,
          filterable: column.filterable !== false && !isActionColumn,
        };
      }),
    [columns, rows]
  );

  return (
    <div className="w-full">
      <div className="flex justify-end pb-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search this table..."
          aria-label="Search this table"
          className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <DataGrid
        {...gridProps}
        rows={searchableRows}
        columns={sortableFilterableColumns}
        components={{ ...gridProps.components, Toolbar: GridToolbar }}
      />
    </div>
  );
};

export default FilterableDataGrid;
