// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsClienteAccountInfo } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";
// API
import { getClienteAccountInfos, createClienteAccountInfo, updateClienteAccountInfo, deleteClienteAccountInfo } from "../../service/clienteAccountInfoApi";
// Alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

export default function ClienteAccountInfoView() {
  const [validationErrors, setValidationErrors] = useState({});
  const [clienteAccounts, setClienteAccounts] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const queryClient = useQueryClient();

  // Consulta para obtener las cuentas de clientes
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["getClienteAccountInfos"],
    queryFn: getClienteAccountInfos,
    onError: (error) => {
      console.error('Error en la consulta de cuentas de clientes:', error);
      ToastError(error.message || "Error al obtener las cuentas de clientes");
    }
  });

  // Extraemos y mapeamos los datos cuando cambia la respuesta de la API
  useEffect(() => {
    if (apiResponse?.data) {
      console.log('Datos recibidos de la API:', apiResponse.data);
      const mappedData = mapClienteAccountData(apiResponse.data);
      console.log('Datos mapeados para la tabla:', mappedData);
      setClienteAccounts(mappedData);
    }
  }, [apiResponse]);

  // Función para mapear los datos de la API a la estructura esperada por la tabla
  const mapClienteAccountData = (accountsData) => {
    if (!Array.isArray(accountsData)) {
      console.error('Los datos recibidos no son un array:', accountsData);
      return [];
    }

    return accountsData.map(account => ({
      id: account.idClienteAccountInfo,
      client: account.client,
      email: account.email,
      password: account.password,
      appPassword: account.appPassword,
      vin: account.vin,
      date1: account.date1,
      status: account.status || 'Activo' // Valor por defecto
    }));
  };

  // Mutación para crear una cuenta de cliente
  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: createClienteAccountInfo,
    onSuccess: () => {
      ToastSuccess("Cuenta de cliente creada exitosamente");
      queryClient.invalidateQueries(["getClienteAccountInfos"]);
    },
    onError: (error) => {
      console.error('Error al crear la cuenta de cliente:', error);
      ToastError(error.message || "Error al crear la cuenta de cliente");
    }
  });

  // Mutación para actualizar una cuenta de cliente
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, accountData }) => updateClienteAccountInfo(id, accountData),
    onSuccess: () => {
      ToastSuccess("Cuenta de cliente actualizada exitosamente");
      queryClient.invalidateQueries(["getClienteAccountInfos"]);
    },
    onError: (error) => {
      console.error('Error al actualizar la cuenta de cliente:', error);
      ToastError(error.message || "Error al actualizar la cuenta de cliente");
    }
  });

  // Mutación para eliminar una cuenta de cliente
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteClienteAccountInfo,
    onSuccess: () => {
      ToastSuccess("Cuenta de cliente eliminada exitosamente");
      queryClient.invalidateQueries(["getClienteAccountInfos"]);
    },
    onError: (error) => {
      console.error('Error al eliminar la cuenta de cliente:', error);
      ToastError(error.message || "Error al eliminar la cuenta de cliente");
    }
  });

  // Mutación para importar múltiples cuentas desde Excel
  const { mutate: bulkCreateMutate } = useMutation({
    mutationFn: bulkCreateClienteAccountInfos,
    onSuccess: () => {
      ToastSuccess("Cuentas de clientes importadas exitosamente");
      queryClient.invalidateQueries(["getClienteAccountInfos"]);
      setIsImporting(false);
      handleCloseUploadDialog();
    },
    onError: (error) => {
      console.error('Error al importar cuentas de clientes:', error);
      ToastError(error.message || "Error al importar cuentas de clientes");
      setIsImporting(false);
    }
  });

  // Validación de datos de la cuenta de cliente
  const validateClienteAccountData = (values) => {
    if (!values) {
      return { _error: "No se proporcionaron datos para validar" };
    }

    const errors = {};

    if (!values.client || values.client.trim() === "") {
      errors.client = "El nombre del cliente es requerido";
    } else if (values.client.length < 3) {
      errors.client = "El nombre del cliente debe tener al menos 3 caracteres";
    }

    if (values.email && values.email.trim() !== "" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Formato de correo electrónico inválido";
    }

    if (values.password && values.password.trim() !== "" && values.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (values.appPassword && values.appPassword.trim() !== "" && values.appPassword.length < 6) {
      errors.appPassword = "La contraseña de aplicación debe tener al menos 6 caracteres";
    }

    if (values.vin && values.vin.trim() !== "" && values.vin.length < 6) {
      errors.vin = "El VIN debe tener al menos 6 caracteres";
    }

    return errors;
  };
  // Función para eliminar una cuenta de cliente
  const handleDelete = (row) => {
    if (!row || !row.id) {
      ToastError("Error: No se puede eliminar la cuenta de cliente (ID no válido)");
      return;
    }

    SweetAlertEliminar(
      `¿Está seguro de que desea eliminar la cuenta de ${row.client}?`,
      () => deleteMutate(row.id)
    );
  };

  // Función para crear una nueva cuenta de cliente
  const handleSave = (tableData) => {
    const values = { ...tableData.values };
    const table = tableData.table;

    if (window._selectedDate && !values.date1) {
      values.date1 = window._selectedDate;
      delete window._selectedDate;
    }

    const newValidationErrors = validateClienteAccountData(values);
    if (Object.values(newValidationErrors).some(error => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setValidationErrors({});
    createMutate(values);

    if (table) {
      table.setCreatingRow(null);
    }
  };

  const handleUpdate = (tableData) => {
    const values = { ...tableData.values };
    const table = tableData.table;
    const row = tableData.row;
  
    if (!values || !row?.original) {
      ToastError("Error: Datos incompletos para actualizar");
      return;
    }
  
    const id = row.original.id;
    if (!id) {
      ToastError("Error: ID de cuenta de cliente no válido");
      return;
    }
  
    // Conservar la fecha original si no se ha modificado
    if (!values.date1 && row.original.date1) {
      values.date1 = row.original.date1;
    }
  
    // Eliminar el uso de window._selectedDate (no recomendado)
    if (window._selectedDate) {
      delete window._selectedDate;
    }
  
    const newValidationErrors = validateClienteAccountData(values);
    if (Object.values(newValidationErrors).some(error => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
  
    // Asegurarse de enviar todos los campos, incluyendo la fecha
    const accountData = {
      client: values.client,
      email: values.email,
      password: values.password,
      appPassword: values.appPassword,
      vin: values.vin,
      date1: values.date1, // Asegurar que la fecha se incluya
      status: values.status || 'Activo'
    };
  
    console.log('Datos completos a actualizar:', accountData);
    
    setValidationErrors({});
    updateMutate({ id, accountData });
  
    if (table) {
      table.setEditingRow(null);
    }
  };


  // Obtener las columnas con validaciones
  const columns = columnsClienteAccountInfo(validationErrors, setValidationErrors);

  // Estado de carga general
  const isLoadingData = isLoading || isCreating || isUpdating || isDeleting || isImporting;

  return (
    <>
      {isLoadingData && <Spinner open={true} />}
      <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
        Gestión de Cuentas de Clientes
      </h1>

      {isError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error?.message || "No se pudieron cargar las cuentas de clientes"}
        </div>
      )}        

      <div className="mt-5">
        <CustomTable
          setValidationErrors={setValidationErrors}
          columns={columns}
          data={clienteAccounts}
          titleCreate="Crear Cuenta de Cliente"
          titleEdit="Editar Cuenta de Cliente"
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleEdit={handleUpdate}
        />
      </div>
    </>
  );
}