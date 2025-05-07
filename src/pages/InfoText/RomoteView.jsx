// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsRemote } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

// UI Components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// API
import { getRemotes, createRemote, updateRemote, deleteRemote, bulkCreateRemotes } from "../../service/RemoteApi";
// Alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
// Excel
import * as XLSX from 'xlsx';

export default function RemoteView() {
  const [validationErrors, setValidationErrors] = useState({});
  const [remotes, setRemotes] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const queryClient = useQueryClient();

  // Consulta para obtener los registros remotos
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["getRemotes"],
    queryFn: getRemotes,
    onError: (error) => {
      console.error('Error en la consulta de registros remotos:', error);
      ToastError(error.message || "Error al obtenerdd los registros remotos");
    }
  });

  // Extraemos y mapeamos los datos cuando cambia la respuesta de la API
  useEffect(() => {
    if (apiResponse?.data) {
      console.log('Datos recibidos de la API:', apiResponse.data);
      const mappedData = mapRemoteData(apiResponse.data);
      console.log('Datos mapeados para la tabla:', mappedData);
      setRemotes(mappedData);
    }
  }, [apiResponse]);

  // Función para mapear los datos de la API a la estructura esperada por la tabla
  const mapRemoteData = (remotesData) => {
    if (!Array.isArray(remotesData)) {
      console.error('Los datos recibidos no son un array:', remotesData);
      return [];
    }

    return remotesData.map(remote => ({
      id: remote.idRemote, // Mapeamos idRemote a id para la tabla
      customer: remote.customer,
      terminal: remote.terminal,
      software: remote.software,
      ipAddress: remote.ipAddress,
      user: remote.user,
      password: remote.password, // Se ocultará en la tabla
      status: remote.status
    }));
  };

  // Mutación para crear un registro remoto
  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: createRemote,
    onError: (error) => {
      console.error('Error al crear el registro remoto:', error);
      ToastError(error.message || "Error al crear el registro remoto");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al crear:', data);
      ToastSuccess(data.message || "Registro remoto creado con éxito");
      queryClient.invalidateQueries(["getRemotes"]);
    },
  });

  // Mutación para actualizar un registro remoto
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: (params) => {
      console.log('Parámetros para actualizar:', params);
      return updateRemote(params.id, params.values);
    },
    onError: (error) => {
      console.error('Error al actualizar el registro remoto:', error);
      ToastError(error.message || "Ocurrió un error al actualizar el registro remoto");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al actualizar:', data);
      ToastSuccess(data.message || "Registro remoto actualizado con éxito");
      queryClient.invalidateQueries(["getRemotes"]);
    },
  });

  // Mutación para eliminar un registro remoto
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => {
      console.log('ID para eliminar:', id);
      return deleteRemote(id);
    },
    onError: (error) => {
      console.error('Error al eliminar el registro remoto:', error);
      ToastError(error.message || "Ocurrió un error al eliminar el registro remoto");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al eliminar:', data);
      ToastSuccess(data?.message || "Se ha eliminado el registro remoto exitosamente");
      queryClient.invalidateQueries(["getRemotes"]);
    },
  });


  const validateRemoteData = (values) => {
    if (!values) {
      return { _error: "No se proporcionaron datos para validar" };
    }

    const errors = {};

    // Validar cliente solo si existe y no está vacío
    if (values.customer && values.customer.trim() !== "" && values.customer.length < 3) {
      errors.customer = "El nombre del cliente debe tener al menos 3 caracteres";
    }

    // Validar terminal solo si existe y no está vacío
    if (values.terminal && values.terminal.trim() !== "" && values.terminal.length < 3) {
      errors.terminal = "El terminal debe tener al menos 3 caracteres";
    }

    // Validar software solo si existe y no está vacío
    if (values.software && values.software.trim() !== "" && values.software.length < 2) {
      errors.software = "El software debe tener al menos 2 caracteres";
    }

    // Validar dirección IP solo si existe y no está vacía
    if (values.ipAddress && values.ipAddress.trim() !== "") {
      if (!/^[0-9.\s]+$/.test(values.ipAddress)) {
        errors.ipAddress = "Solo se permiten números, espacios y puntos";
      }
    }


    // Validar usuario solo si existe y no está vacío
    if (values.user && values.user.trim() !== "" && values.user.length < 3) {
      errors.user = "El usuario debe tener al menos 3 caracteres";
    }

    // Validar contraseña solo si existe y no está vacía
    if (values.password && values.password.trim() !== "" && values.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    return errors;
  };

  // Función para eliminar un registro remoto
  const handleDelete = (row) => {
    if (!row || !row.id) {
      console.error('Fila inválida para eliminar:', row);
      ToastError("Error: No se puede eliminar el registro remoto (ID no válido)");
      return;
    }

    console.log('Iniciando proceso de eliminación para:', row);
    SweetAlertEliminar(
      `¿Está seguro de que desea eliminar este registro remoto de ${row.customer}?`,
      () => {
        console.log(`Confirmada eliminación de registro remoto con ID: ${row.id}`);
        deleteMutate(row.id);
      }
    );
  };

  // Función para crear un nuevo registro remoto
  const handleSave = (tableData) => {
    console.log('handleSave llamado con:', tableData);

    // En Material-React-Table, los valores están directamente en la propiedad values
    const values = tableData.values;
    const table = tableData.table;

    // Verificar si tenemos valores
    if (!values) {
      console.error('No se recibieron valores para crear el registro remoto');
      setValidationErrors({ _error: "No se proporcionaron datos para validar" });
      return;
    }

    // Validamos los datos
    const newValidationErrors = validateRemoteData(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log('Errores de validación:', newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }

    console.log('Datos validados correctamente, procediendo a crear');
    setValidationErrors({});
    createMutate(values);

    // Cerramos el formulario
    if (table) {
      table.setCreatingRow(null);
    }
  };

  // Función para actualizar un registro remoto existente
  const handleUpdate = (tableData) => {
    console.log('handleUpdate llamado con:', tableData);

    // En Material-React-Table, los valores están en props específicas
    const values = tableData.values;
    const table = tableData.table;
    const row = tableData.row;

    // Verificamos si tenemos valores y fila original
    if (!values || !row?.original) {
      console.error('Datos incompletos para actualizar:', { values, row });
      ToastError("Error: Datos incompletos para actualizar");
      return;
    }

    const id = row.original.id;
    if (!id) {
      console.error('ID no válido para actualizar:', id);
      ToastError("Error: ID de registro remoto no válido");
      return;
    }

    // Validamos los datos
    const newValidationErrors = validateRemoteData(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log('Errores de validación:', newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }

    console.log(`Datos validados correctamente, procediendo a actualizar registro remoto ${id}`);
    setValidationErrors({});
    updateMutate({ id, values });

    // Cerramos el formulario
    if (table) {
      table.setEditingRow(null);
    }
  };

  // Función para abrir el diálogo de carga
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  // Función para cerrar el diálogo de carga
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setExcelFile(null);
    setFileName("");
    setPreviewData([]);
  };



  // Obtener las columnas con validaciones
  const columns = columnsRemote(validationErrors, setValidationErrors);

  // Estado de carga general
  const isLoadingData = isLoading || isCreating || isUpdating || isDeleting;

  return (
    <>
      {isLoadingData && <Spinner open={true} />}
      <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
        Gestión de Registros Remotos
      </h1>

      {isError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error?.message || "No se pudieron cargar los registros remotos"}
        </div>
      )}

      <div className="mt-5">
        <CustomTable
          setValidationErrors={setValidationErrors}
          columns={columns}
          data={remotes}
          titleCreate="Crear Registro Remoto"
          titleEdit="Editar Registro Remoto"
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleEdit={handleUpdate}
        />
      </div>
    </>
  );
}