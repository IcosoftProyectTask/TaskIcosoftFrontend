// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsLicense } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";
// UI Components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// API
import { getLicenses, createLicense, updateLicense, deleteLicense, bulkCreateLicenses } from "../../service/licenseApi";
// Alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

import { validateRemoteData } from '../../../src/assets/js/Validations'; // Asegúrate de que la ruta sea correcta

export default function LicenseView() {
  const [validationErrors, setValidationErrors] = useState({});
  const [licenses, setLicenses] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);




  const queryClient = useQueryClient();

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteLicense,
    onSuccess: () => {
      ToastSuccess("Licencia eliminada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      console.error("Error al eliminar la licencia:", error);
      ToastError(error.message || "Error al eliminar la licencia");
    },
    onMutate: () => {
      setIsDeleting(true);
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });


  // Consulta para obtener las licencias
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["getLicenses"],
    queryFn: getLicenses,
    onError: (error) => {
      console.error('Error en la consulta de licencias:', error);
      ToastError(error.message || "Error al obtener las licencias");
    }
  });

  // Extraemos y mapeamos los datos cuando cambia la respuesta de la API
  useEffect(() => {
    if (apiResponse?.data) {
      console.log('Datos recibidos de la API:', apiResponse.data);
      const mappedData = mapLicenseData(apiResponse.data);
      console.log('Datos mapeados para la tabla:', mappedData);
      setLicenses(mappedData);
    }
  }, [apiResponse]);


  // Función para mapear los datos de la API a la estructura esperada por la tabla
  const mapLicenseData = (licensesData) => {
    if (!Array.isArray(licensesData)) {
      console.error('Los datos recibidos no son un array:', licensesData);
      return [];
    }

    return licensesData.map(license => ({
      id: license.idLicense,
      client: license.client,
      deviceName: license.deviceName,
      licenseNumber: license.licenseNumber,
      type: license.type,
      installationDate: license.installationDate,
    //  vendorAccount: license.vendorAccount,
      status: license.status || 'Activo'
    }));
  };



  // Mutaciones (create, update, delete, bulkCreate) permanecen igual...

  // Validación de datos de licencia (simplificada y más similar a RemoteView)
  const validateLicenseData = (values) => {
    if (!values) {
      return { _error: "No se proporcionaron datos para validar" };
    }

    const errors = {};

    // Validar cliente solo si existe y no está vacío
    if (values.client && values.client.trim() !== "" && values.client.length < 3) {
      errors.client = "El nombre del cliente debe tener al menos 3 caracteres";
    }

    // Validar nombre del dispositivo solo si existe y no está vacío
    if (values.deviceName && values.deviceName.trim() !== "" && values.deviceName.length < 3) {
      errors.deviceName = "El nombre del dispositivo debe tener al menos 3 caracteres";
    }

    // Validar número de licencia solo si existe y no está vacío
    if (values.licenseNumber && values.licenseNumber.trim() !== "" && values.licenseNumber.length < 5) {
      errors.licenseNumber = "El número de licencia debe tener al menos 5 caracteres";
    }

    // Validar tipo de licencia solo si existe y no está vacío
    if (values.type && values.type.trim() !== "" && values.type.length < 2) {
      errors.type = "El tipo de licencia debe tener al menos 2 caracteres";
    }
/*
    // Validar cuenta del proveedor solo si existe y no está vacío
    if (values.vendorAccount && values.vendorAccount.trim() !== "" && values.vendorAccount.length < 3) {
      errors.vendorAccount = "La cuenta del proveedor debe tener al menos 3 caracteres";
    }
*/
    return errors;
  };
  
  // Agrega estas mutaciones junto con las otras que ya tienes
  const { mutate: createMutate } = useMutation({
    mutationFn: createLicense,
    onSuccess: () => {
      ToastSuccess("Licencia creada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      console.error("Error al crear la licencia:", error);
      ToastError(error.message || "Error al crear la licencia");
    },
    onMutate: () => {
      setIsCreating(true);
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });
  const { mutate: updateMutate } = useMutation({
    mutationFn: ({ id, licenseData }) => updateLicense(id, licenseData), // Ajuste clave aquí
    onSuccess: () => {
      ToastSuccess("Licencia actualizada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      ToastError(error.message || "Error al actualizar la licencia");
    }
  });

  
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

  const handleSave = (tableData) => {
    console.log('handleSave llamado con:', tableData);
    
    // 1. Extracción de valores
    const values = { ...tableData.values };
    const table = tableData.table;
    
    // 2. Manejo especial de fechas
    if (window._selectedDate && !values.installationDate) {
      values.installationDate = window._selectedDate;
      console.log('Asignando fecha global:', values.installationDate);
      delete window._selectedDate;
    }
    
    // 3. Validación de datos
    const newValidationErrors = validateLicenseData(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log('Errores de validación:', newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }
    
    // 4. Preparación de datos para la API
    console.log('Datos validados correctamente, procediendo a crear');
    console.log('Datos enviados al crear licencia:', values);
    
    // 5. Llamada a la mutación
    setValidationErrors({});
    createMutate(values);
    
    // 6. Cierre del formulario
    if (table) {
      table.setCreatingRow(null);
    }
  };


  const handleUpdate = (tableData) => {
    console.log('handleUpdate llamado con:', tableData);
    
    const values = { ...tableData.values };
    const table = tableData.table;
    const row = tableData.row;
    
    if (!values || !row?.original) {
      ToastError("Error: Datos incompletos para actualizar");
      return;
    }
  
    const id = row.original.id;
    if (!id) {
      ToastError("Error: ID de licencia no válido");
      return;
    }
    
    // Procesamiento mejorado de fecha
    let installationDate = values.installationDate;
    if (window._selectedDate) {
      installationDate = window._selectedDate;
      delete window._selectedDate;
    } else if (!installationDate && row.original.installationDate) {
      installationDate = row.original.installationDate;
    }
  
    // Validación
    const newValidationErrors = validateLicenseData(values);
    if (Object.values(newValidationErrors).some(error => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    
    // Preparar los datos para la API
    const licenseData = {
      client: values.client || row.original.client,
      deviceName: values.deviceName || row.original.deviceName,
      licenseNumber: values.licenseNumber || row.original.licenseNumber,
      type: values.type || row.original.type,
      installationDate: installationDate,
    //  vendorAccount: values.vendorAccount || row.original.vendorAccount,
      status: values.status !== undefined ? values.status : row.original.status
    };
  
    console.log('Enviando a updateLicense:', { id, licenseData });
  
    // Llamada correcta a la mutación
    updateMutate({ id, licenseData }); // <-- Estructura que coincide con tu servicio
    
    if (table) {
      table.setEditingRow(null);
    }
  };
  
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
  const columns = columnsLicense(validationErrors, setValidationErrors);

  // Estado de carga general
  const isLoadingData = isLoading || isCreating || isUpdating || isDeleting || isImporting;


  return (
    <>
      {isLoadingData && <Spinner open={true} />}
      <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
        Gestión de Licencias
      </h1>

      {isError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error?.message || "No se pudieron cargar las licencias"}
        </div>
      )}


      <div className="mt-5">
        <CustomTable
          setValidationErrors={setValidationErrors}
          columns={columns}
          data={licenses}
          titleCreate="Crear Licencia"
          titleEdit="Editar Licencia"
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleEdit={handleUpdate}
        />
      </div>
    </>
  );
}