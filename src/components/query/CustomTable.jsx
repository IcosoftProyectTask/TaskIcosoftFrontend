import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import useTableTheme from "../../utils/TableTheme";
import { ThemeProvider } from "@mui/material";
import RowAction from "./RowAction";
import TopToolAction from "./TopToolAction";

export default function CustomTable({
  columns,
  data,
  role,
  handleDelete,
  handleEdit,
  openModal
}) {
  const tableTheme = useTableTheme();
  const memoizedColumns = useMemo(() => columns, [columns]);

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={memoizedColumns}
        data={data}
        enableFullScreenToggle={true}
        enableDensityToggle={true}
        localization={MRT_Localization_ES}
        enableRowActions
        enableExpandAll={true}
        enableExpanding={true}
        initialState={{columnVisibility: { id: false }}}
        positionActionsColumn="last"
        enableColumnFilterModes={true}
        columnFilterDisplayMode={"popover"}
        getSubRows={(row) => row.subRows}
        renderRowActionMenuItems={({ row, table, closeMenu }) => [
          <RowAction
            key={`row-action-${row.id}`}
            row={row}
            table={table}
            role={role}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            openModal={openModal}
            closeMenu={closeMenu}
          />
        ]}
        renderTopToolbarCustomActions={() => <TopToolAction role={role} />}
      />
    </ThemeProvider>
  );
}
