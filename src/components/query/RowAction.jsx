import { MRT_ActionMenuItem } from "material-react-table";
import {VisibilityIcon, AddIcon, EditIcon, DeleteIcon, DownloadIcon} from "../Icons"

export default function RowAction({
  row,
  table,
  role,
  handleEdit,
  handleDelete,
  openModal,
  closeMenu
}) {
  const handleOpenModal = () => {
    openModal();
    closeMenu();
  };
  return (
    <>
      {role === "Admin" && (
        <>
          <MRT_ActionMenuItem
            icon={<VisibilityIcon />}
            key="chart"
            label="Gráfica"
            table={table}
            onClick={handleOpenModal}
          />
          <MRT_ActionMenuItem
            icon={<AddIcon />}
            key="add"
            label="Agregar"
            onClick={() => console.log("agregar hijo")}
            table={table}
          />
          <MRT_ActionMenuItem
            icon={<EditIcon />}
            key="edit"
            label="Editar"
            onClick={() => handleEdit(row.original)}
            table={table}
          />
          <MRT_ActionMenuItem
            icon={<DeleteIcon />}
            key="delete"
            label="Eliminar"
            onClick={() => {
              closeMenu(); 
              handleDelete(row.original); 
            }}
            table={table}
          />
          <MRT_ActionMenuItem
            icon={<DownloadIcon />}
            key="download"
            label=".csv"
            onClick={() => {
              console.log("descargar")
            }}
            table={table}
          />
        </>
      )}
    </>
  );
}
