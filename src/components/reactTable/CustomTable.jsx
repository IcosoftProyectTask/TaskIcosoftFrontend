import React from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import useTableTheme from "../../utils/TableTheme";
import { ThemeProvider } from "@mui/material";
import RowAction from "./RowAction";
import TopToolAction from "./TopToolAction";
import DialogBase from "../dialog/DialogBase";

// IMPORTANTE: Eliminar la doble memorización
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
  
  // Eliminar esta memorización ya que columns ya viene memorizado
  // const memoizedColumns = useMemo(() => columns, [columns]);
  
  // Definir las funciones renderizadoras fuera del JSX para mejor claridad
  const renderCreateRowDialogContent = ({ table, row, internalEditComponents }) => (
    <DialogBase 
      table={table} 
      row={row} 
      internalEditComponents={internalEditComponents} 
      title={titleCreate} 
    />
  );

  const renderEditRowDialogContent = ({ table, row, internalEditComponents }) => (
    <DialogBase 
      table={table} 
      row={row} 
      internalEditComponents={internalEditComponents} 
      title={titleEdit} 
    />
  );

  const renderRowActionMenuItems = ({ row, table, closeMenu }) => [
    <RowAction
      key={`row-action-${row.id || Math.random()}`}
      row={row}
      table={table}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      closeMenu={closeMenu}
    />
  ];

  const renderTopToolbarCustomActions = ({ table }) => (
    <TopToolAction table={table} titleCreate={titleCreate} />
  );

  const handleCreatingRowCancel = () => setValidationErrors({});
  const handleEditingRowCancel = () => setValidationErrors({});

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={columns} // Usar columns directamente
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
        onCreatingRowCancel={handleCreatingRowCancel}
        onEditingRowCancel={handleEditingRowCancel}
        renderCreateRowDialogContent={renderCreateRowDialogContent}
        renderEditRowDialogContent={renderEditRowDialogContent}
        renderRowActionMenuItems={renderRowActionMenuItems}
        renderTopToolbarCustomActions={renderTopToolbarCustomActions}
      />
    </ThemeProvider>
  );
}