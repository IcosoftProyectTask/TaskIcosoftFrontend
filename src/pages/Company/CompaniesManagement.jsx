// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsCompany } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";
// API
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../../service/Companys";
// Alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

export default function CompaniesManagement() {
  const [validationErrors, setValidationErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const queryClient = useQueryClient();

  // Consulta para obtener las compañías
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["getCompanies"],
    queryFn: getCompanies,
    onError: (error) => {
      console.error('Error en la consulta de compañías:', error);
      ToastError(error.message || "Error al obtener las compañías");
    }
  });

  // Extraemos y mapeamos los datos cuando cambia la respuesta de la API
  useEffect(() => {
    if (apiResponse?.data) {
      console.log('Datos recibidos de la API:', apiResponse.data);
      const mappedData = mapCompanyData(apiResponse.data);
      console.log('Datos mapeados para la tabla:', mappedData);
      setCompanies(mappedData);
    }
  }, [apiResponse]);

  // Función para mapear los datos de la API a la estructura esperada por la tabla
  const mapCompanyData = (companiesData) => {
    if (!Array.isArray(companiesData)) {
      console.error('Los datos recibidos no son un array:', companiesData);
      return [];
    }
    
    return companiesData.map(company => ({
      id: company.idCompany, // Mapeamos idCompany a id para la tabla
      companyFiscalName: company.companyFiscalName,
      companyComercialName: company.companyComercialName,
      email: company.email,
      companyAddress: company.companyAddress,
      idCart: company.idCart,
      companyPhone: company.companyPhone,
      status: company.status
    }));
  };

  // Mutación para crear una compañía
  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: createCompany,
    onError: (error) => {
      console.error('Error al crear la compañía:', error);
      ToastError(error.message || "Error al crear la compañía");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al crear:', data);
      ToastSuccess(data.message || "Compañía creada con éxito");
      queryClient.invalidateQueries(["getCompanies"]);
    },
  });

  // Mutación para actualizar una compañía
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: (params) => {
      console.log('Parámetros para actualizar:', params);
      return updateCompany(params.id, params.values);
    },
    onError: (error) => {
      console.error('Error al actualizar la compañía:', error);
      ToastError(error.message || "Ocurrió un error al actualizar la compañía");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al actualizar:', data);
      ToastSuccess(data.message || "Compañía actualizada con éxito");
      queryClient.invalidateQueries(["getCompanies"]);
    },
  });

  // Mutación para eliminar una compañía
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: (id) => {
      console.log('ID para eliminar:', id);
      return deleteCompany(id);
    },
    onError: (error) => {
      console.error('Error al eliminar la compañía:', error);
      ToastError(error.message || "Ocurrió un error al eliminar la compañía");
    },
    onSuccess: (data) => {
      console.log('Respuesta exitosa al eliminar:', data);
      ToastSuccess(data?.message || "Se ha eliminado la compañía exitosamente");
      queryClient.invalidateQueries(["getCompanies"]);
    },
  });

  // Validación de datos de compañía
  const validateCompanyData = (values) => {
    // Verificamos que values no sea undefined o null
    if (!values) {
      return { _error: "No se proporcionaron datos para validar" };
    }

    const errors = {};

    if (!values.companyFiscalName || values.companyFiscalName === "") {
      errors.companyFiscalName = "El nombre fiscal es requerido";
    }

    if (!values.companyComercialName || values.companyComercialName === "") {
      errors.companyComercialName = "El nombre comercial es requerido";
    }

    if (!values.email || values.email === "") {
      errors.email = "El email es requerido";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Email inválido";
    }

    if (!values.companyAddress || values.companyAddress === "") {
      errors.companyAddress = "La dirección es requerida";
    }

    if (!values.idCart || values.idCart === "") {
      errors.idCart = "El ID fiscal es requerido";
    }

    if (!values.companyPhone || values.companyPhone === "") {
      errors.companyPhone = "El teléfono es requerido";
    } else if (!/^\d{8,}$/.test(values.companyPhone)) {
      errors.companyPhone = "Teléfono inválido (mínimo 9 dígitos)";
    }

    return errors;
  };

  // Función para eliminar una compañía
  const handleDelete = (row) => {
    if (!row || !row.id) {
      console.error('Fila inválida para eliminar:', row);
      ToastError("Error: No se puede eliminar la compañía (ID no válido)");
      return;
    }

    console.log('Iniciando proceso de eliminación para:', row);
    SweetAlertEliminar(
      `¿Está seguro de que desea eliminar esta compañía ${row.companyFiscalName || row.companyComercialName}?`,
      () => {
        console.log(`Confirmada eliminación de compañía con ID: ${row.id}`);
        deleteMutate(row.id);
      }
    );
  };

  // Función para crear una nueva compañía - CORREGIDA según documentación Material-React-Table
  const handleSave = (tableData) => {
    console.log('handleSave llamado con:', tableData);
    
    // En Material-React-Table, los valores están directamente en la propiedad values
    const values = tableData.values;
    const table = tableData.table;
    
    // Verificar si tenemos valores
    if (!values) {
      console.error('No se recibieron valores para crear la compañía');
      setValidationErrors({ _error: "No se proporcionaron datos para validar" });
      return;
    }
    
    // Validamos los datos
    const newValidationErrors = validateCompanyData(values);
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

  // Función para actualizar una compañía existente - CORREGIDA según documentación
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
      ToastError("Error: ID de compañía no válido");
      return;
    }
    
    // Validamos los datos
    const newValidationErrors = validateCompanyData(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log('Errores de validación:', newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }
    
    console.log(`Datos validados correctamente, procediendo a actualizar compañía ${id}`);
    setValidationErrors({});
    updateMutate({ id, values });
    
    // Cerramos el formulario
    if (table) {
      table.setEditingRow(null);
    }
  };

  // Obtener las columnas con validaciones
  const columns = columnsCompany(validationErrors, setValidationErrors);

  // Estado de carga general
  const isLoadingData = isLoading || isCreating || isUpdating || isDeleting;

  return (
    <>
      {isLoadingData && <Spinner open={true} />}
      <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
        Gestión de Compañías
      </h1>
      
      {isError && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Error: {error?.message || "No se pudieron cargar las compañías"}
        </div>
      )}
      
      <div className="mt-5">
        <CustomTable
          setValidationErrors={setValidationErrors}
          columns={columns}
          data={companies}
          titleCreate="Crear Compañía"
          titleEdit="Editar Compañía"
          handleDelete={handleDelete}
          handleSave={handleSave}
          handleEdit={handleUpdate}
        />
      </div>
    </>
  );
}