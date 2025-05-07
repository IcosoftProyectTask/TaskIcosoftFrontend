// Libraries
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsUserClient } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";
// API
import { getUserClient, DeleteUserClient, registerUserClient, UpdateUserClient } from "../../service/UserClient";
// alert
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
// Validations
import { validateUser } from "../../assets/js/Validations";

export default function getUser() {
    const [validationErrors, setValidationErrors] = useState({});
    const queryClient = useQueryClient();
    
    const { mutate: registerMutate } = useMutation({
        mutationFn: registerUserClient,
        onError: (error) => {
            ToastError(error.message);
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getUserClient"]);
        },
    });
    
    const { mutate: updateMutate } = useMutation({
        mutationFn: UpdateUserClient,
        onError: () => {
            ToastError("Ocurrió un error al actualizar el usuario");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getUserClient"]);
        },
    });
    
    const { data, isLoading } = useQuery({
        queryKey: ["getUserClient"],
        queryFn: getUserClient,
    });
    
    const { mutate } = useMutation({
        mutationFn: DeleteUserClient,
        onError: () => {
            ToastError("Ocurrió un error al eliminar el usuario");
        },
        onSuccess: () => {
            ToastSuccess("Se ha eliminado el usuario exitosamente");
            queryClient.invalidateQueries(["getUserClient"]);
        },
    });
    
    const handleDelete = (row) => {
        console.log("Datos de la fila a eliminar:", row);
        
        // Asegurarse de que estamos accediendo al ID correcto
        const userId = row.original?.idUser || row.idUser || row.id;
        
        if (!userId) {
            ToastError("Error: No se pudo obtener el ID del usuario");
            console.error("ID del usuario no encontrado en:", row);
            return;
        }
        
        SweetAlertEliminar(
            `¿Estás seguro de que deseas eliminar este usuario ${row.original?.name || row.name}?`,
            () => {
                console.log("Eliminando usuario con ID:", userId);
                mutate(userId);
            }
        );
    };
    
    const handleSave = async ({ values, table }) => {
        console.log("handleSave - valores recibidos:", values);
        
        // Verificar que values esté definido
        if (!values) {
            ToastError("Error: No se recibieron datos del formulario");
            return;
        }
        
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        
        setValidationErrors({});
        registerMutate(values);
        table.setCreatingRow(null);
    };
    
    const handleUpdate = async ({ values, table, row }) => {
        console.log("handleUpdate - valores recibidos:", values);
        
        // Verificar que values esté definido
        if (!values) {
            ToastError("Error: No se recibieron datos del formulario");
            return;
        }
        
        const id = row.original.idUser;  
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        
        setValidationErrors({});
        updateMutate({ id, values });  
        table.setEditingRow(null);  
    };
    
    const columns = columnsUserClient(validationErrors, setValidationErrors);
    
    return (
        <>
            {isLoading && <Spinner open={true} />}
            <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
                Usuarios
            </h1>
            <div className="mt-5">
                <CustomTable
                    setValidationErrors={setValidationErrors}
                    columns={columns}
                    data={data || []}
                    titleCreate={"Nuevo Usuario"}
                    titleEdit={"Editar Usuario"}
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    handleEdit={handleUpdate}
                />
            </div>
        </>
    );
}