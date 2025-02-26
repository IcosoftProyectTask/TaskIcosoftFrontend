import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import useTableTheme from "../../utils/TableTheme";
import { ThemeProvider } from "@mui/material";
import RowAction from "./RowAction";
import TopToolAction from "./TopToolAction";
import DialogBase from "../dialog/DialogBase";

export default function CustomTable({
  columns,
  data,
  titleCreate,
  titleEdit,
  handleDelete,
  handleEdit,
  handleSave,
  setValidationErrors
}) {
  const tableTheme = useTableTheme();
  const memoizedColumns = useMemo(() => columns, [columns]);

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={memoizedColumns}
        data={data}
        enableFullScreenToggle={true}
        createDisplayMode={'modal'}
        editDisplayMode={'modal'}
        enableDensityToggle={true}
        localization={MRT_Localization_ES}
        enableRowActions
        positionActionsColumn="last"
        enableColumnFilterModes={true}
        columnFilterDisplayMode={"popover"}
        muiSkeletonProps={{ animation: "pulse", height: 28 }}
        onCreatingRowSave={handleSave}
        onEditingRowSave={handleEdit}
        onCreatingRowCancel={() => setValidationErrors({})}
        onEditingRowCancel={() => setValidationErrors({})}
        renderCreateRowDialogContent={({ table, row, internalEditComponents }) => (
          <DialogBase table={table} row={row} internalEditComponents={internalEditComponents} title={titleCreate} />
        )}
        renderEditRowDialogContent={({ table, row, internalEditComponents }) => (
          <DialogBase table={table} row={row} internalEditComponents={internalEditComponents} title={titleEdit} />
        )}
        renderRowActionMenuItems={({ row, table, closeMenu }) => [
          <RowAction
            key={`row-action-${row.id}`}
            row={row}
            table={table}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            closeMenu={closeMenu}
          />
        ]}
        renderTopToolbarCustomActions={({ table }) => <TopToolAction table={table} titleCreate = {titleCreate} />}
      />
    </ThemeProvider>
  );
}
