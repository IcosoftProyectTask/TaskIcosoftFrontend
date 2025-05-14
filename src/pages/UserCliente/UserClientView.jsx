import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { 
  getUserClient, 
  DeleteUserClient, 
  registerUserClient, 
  UpdateUserClient 
} from "../../service/UserClient";
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import { validateUser } from "../../assets/js/Validations";
import UserClientTable from "./UserClientTable";
import UserClientModal from "./UserClientModal";
import LoadingSpinner from "../../components/Spinner";

export default function UserClientView() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();

  const { data: apiData, isLoading, isError, error } = useQuery({
    queryKey: ["getUserClient"],
    queryFn: getUserClient,
    onError: (error) => ToastError(error.message || "Error al obtener usuarios"),
  });

  useEffect(() => {
    // Verifica si la respuesta es un array directamente o si está en una propiedad data
    const responseData = Array.isArray(apiData) ? apiData : apiData?.data || apiData;
    
    if (responseData) {
      setUsers(responseData.map(user => ({
        id: user.idUser || user.id,
        name: user.name,
        firstSurname: user.firstSurname,
        secondSurname: user.secondSurname,
        phoneNumber: user.phoneNumber,
        email: user.email
      })));
    } else {
      setUsers([]);
    }
  }, [apiData]);

  // En UserClientView
const { mutate: registerMutate, isLoading: isCreating } = useMutation({
  mutationFn: registerUserClient,
  onError: (error) => {
    ToastError(error.message);
    return { success: false, message: error.message };
  },
  onSuccess: (data) => {
    ToastSuccess(data.message);
    refreshData();
    handleCloseModal();
    return { success: true, message: data.message };
  },
});

const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
  mutationFn: UpdateUserClient,
  onError: (error) => {
    ToastError(error.message);
    return { success: false, message: error.message };
  },
  onSuccess: (data) => {
    ToastSuccess(data.message);
    refreshData();
    handleCloseModal();
    return { success: true, message: data.message };
  },
});

  const { mutate: deleteMutate, isLoading: isDeleting } = useMutation({
    mutationFn: DeleteUserClient,
    onError: () => {
      ToastError("Ocurrió un error al eliminar el usuario");
    },
    onSuccess: () => {
      ToastSuccess("Se ha eliminado el usuario exitosamente");
      refreshData();
    },
  });

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
    queryClient.invalidateQueries(["getUserClient"]);
  };

  const handleDelete = (id, name) => {
    SweetAlertEliminar(
      `¿Estás seguro de que deseas eliminar al usuario ${name}?`,
      () => deleteMutate(id)
    );
  };

  const handleSubmit = (formData) => {
    const validationErrors = validateUser(formData);
    if (Object.values(validationErrors).some(error => error)) {
      setValidationErrors(validationErrors);
      return false;
    }

    setValidationErrors({});
    
    if (editData?.id) {
      updateMutate({ id: editData.id, values: formData });
    } else {
      registerMutate(formData);
    }
    
    return true;
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
            Gestión de Usuarios
          </h1>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo Usuario
        </button>
      </header>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || "Ha ocurrido un error al cargar los usuarios"}</p>
        </div>
      )}

      {(isLoading || isDeleting) && <LoadingSpinner />}

      <UserClientTable 
  data={users} 
  onEdit={handleOpenModal} 
  onDelete={handleDelete}  // Pasamos handleDelete como prop
  refreshData={refreshData} 


    />

      {modalOpen && (
        <UserClientModal
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