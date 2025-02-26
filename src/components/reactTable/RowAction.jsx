import { MRT_ActionMenuItem } from "material-react-table";
import { Edit, Delete } from "@mui/icons-material";

export default function RowAction({
  row,
  table,
  handleDelete,
  closeMenu, 
}) {
  return (
    <>
      <MRT_ActionMenuItem
        icon={<Edit />}
        key="edit"
        label="Editar"
        onClick={() => {
          table.setEditingRow(row);
          closeMenu(); 
        }}
        table={table}
      />
      <MRT_ActionMenuItem
        icon={<Delete />}
        key="delete"
        label="Eliminar"
        onClick={() => {
          handleDelete(row.original); 
          closeMenu(); 
        }}
        table={table}
      />
    </>
  );
}
