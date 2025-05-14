// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CompaniesTable from "./CompaniesTable";
import CompaniesModal from "./CompaniesModal";
import LoadingSpinner from "../../components/Spinner";
// API
import { getCompanies, createCompany, updateCompany, deleteCompany } from "../../service/Companys";
// Alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
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
      const mappedData = apiResponse.data.map(company => ({
        id: company.idCompany,
        companyFiscalName: company.companyFiscalName,
        companyComercialName: company.companyComercialName,
        email: company.email,
        companyAddress: company.companyAddress,
        idCart: company.idCart,
        companyPhone: company.companyPhone,
        status: company.status
      }));
      setCompanies(mappedData);
    }
  }, [apiResponse]);

  // Mutación para crear una compañía
  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: createCompany,
    onError: (error) => {
      console.error('Error al crear la compañía:', error);
      ToastError(error.message || "Error al crear la compañía");
    },
    onSuccess: (data) => {
      // Asegurarse de que se muestra el toast
      try {
        ToastSuccess(data.message || "Compañía creada con éxito");
      } catch (error) {
        console.error("Error al mostrar notificación:", error);
        // Alternativa en caso de fallo
        alert("Compañía creada con éxito");
      }
      refreshData();
      handleCloseModal();
    },
  });

  // Mutación para actualizar una compañía
  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, values }) => updateCompany(id, values),
    onError: (error) => {
      console.error('Error al actualizar la compañía:', error);
      ToastError(error.message || "Ocurrió un error al actualizar la compañía");
    },
    onSuccess: (data) => {
      // Asegurarse de que se muestra el toast
      try {
        ToastSuccess(data.message || "Compañía actualizada con éxito");
      } catch (error) {
        console.error("Error al mostrar notificación:", error);
        // Alternativa en caso de fallo
        alert("Compañía actualizada con éxito");
      }
      refreshData();
      handleCloseModal();
    },
  });

  // Mutación para eliminar una compañía
  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCompany,
    onError: (error) => {
      console.error('Error al eliminar la compañía:', error);
      ToastError(error.message || "Ocurrió un error al eliminar la compañía");
    },
    onSuccess: (data) => {
      // Asegurarse de que se muestra el toast
      try {
        ToastSuccess(data?.message || "Se ha eliminado la compañía exitosamente");
      } catch (error) {
        console.error("Error al mostrar notificación:", error);
        // Alternativa en caso de fallo
        alert("Compañía eliminada con éxito");
      }
      // Asegurarse de que la tabla se actualiza
      setTimeout(() => {
        refreshData();
      }, 300);
    },
  });

  // Validación de datos de compañía
  const validateCompanyData = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8,}$/;

    if (!values.companyFiscalName?.trim()) {
      errors.companyFiscalName = "El nombre fiscal es requerido";
    }

    if (!values.companyComercialName?.trim()) {
      errors.companyComercialName = "El nombre comercial es requerido";
    }

    if (!values.email?.trim()) {
      errors.email = "El email es requerido";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Email inválido";
    }

    if (!values.companyAddress?.trim()) {
      errors.companyAddress = "La dirección es requerida";
    }

    if (!values.idCart?.trim()) {
      errors.idCart = "El ID fiscal es requerido";
    }

    if (!values.companyPhone?.trim()) {
      errors.companyPhone = "El teléfono es requerido";
    } else if (!phoneRegex.test(values.companyPhone)) {
      errors.companyPhone = "Teléfono inválido (mínimo 8 dígitos)";
    }

    return errors;
  };

  // Función para eliminar una compañía con validación adicional
  const handleDelete = (id, name) => {
    if (!id) {
      console.error("ID de compañía no proporcionado para eliminar");
      ToastError("Error: No se puede eliminar la compañía, ID no proporcionado");
      return;
    }
    
    SweetAlertEliminar(
      `¿Está seguro de que desea eliminar la compañía ${name}?`,
      () => {
        deleteMutate(id);
      }
    );
  };

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setValidationErrors({});
  };

  const refreshData = () => {
    // Invalidar la consulta y forzar recarga
    queryClient.invalidateQueries(["getCompanies"]);
  };

  const handleSubmit = (formData) => {
    const validationErrors = validateCompanyData(formData);
    if (Object.values(validationErrors).some(error => error)) {
      setValidationErrors(validationErrors);
      return false;
    }

    setValidationErrors({});
    
    if (editData?.id) {
      updateMutate({ id: editData.id, values: formData });
    } else {
      createMutate(formData);
    }
    
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
            Gestión de Compañías
          </h1>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva Compañía
        </button>
      </header>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || "Ha ocurrido un error al cargar las compañías"}</p>
        </div>
      )}

      {(isLoading || isDeleting) && <LoadingSpinner />}

      <CompaniesTable 
        data={companies} 
        onEdit={handleOpenModal} 
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {modalOpen && (
        <CompaniesModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editData || {}}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          isLoading={isCreating || isUpdating}
        />
      )}
    </div>
  );
}