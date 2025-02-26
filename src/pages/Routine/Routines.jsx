// Libraries
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsRoutine } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

// API
import { getRoutines, DeleteRoutine, insertRoutines, UpdateRoutine } from "../../service/Routines";

// Alerts
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

// Validations
import { validateRoutine } from "../../assets/js/Validations";

export default function Routines() {
    const [validationErrors, setValidationErrors] = useState({});
    const queryClient = useQueryClient();

    const { mutate: insertMutate } = useMutation({
        mutationFn: insertRoutines,
        onError: () => {
            ToastError("Ocurrió un error al insertar la rutina");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getRoutines"]);
        },
    });

    const { mutate: updateMutate } = useMutation({
        mutationFn: UpdateRoutine,
        onError: (error) => {
            console.log(error)
            ToastError("Ocurrió un error al actualizar la rutina");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getRoutines"]);
        },
    });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getRoutines"],
        queryFn: getRoutines,
        onError: (err) => {
            console.log("Error en la consulta:", err); // Mostrar error
        }
    });
    

    const { mutate } = useMutation({
        mutationFn: DeleteRoutine,
        onError: () => {
            ToastError("Ocurrió un error al eliminar la rutina");
        },
        onSuccess: () => {
            ToastSuccess("Se ha eliminado la rutina exitosamente");
            queryClient.invalidateQueries(["getRoutines"]);
        },
    });

    const handleDelete = (row) => {
        SweetAlertEliminar(
            `¿Estás seguro que deseas eliminar esta rutina: ${row.nameRoutine}?`,
            () => {
                mutate(row.idRoutine);
            }
        );
    };

    const handleSave = async ({ values, table }) => {
        const newValidationErrors = validateRoutine(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        insertMutate(values);
        table.setCreatingRow(null);
    };

    const handleUpdate = async ({ values, table, row }) => {
        const id = row.original.idRoutine;
        const newValidationErrors = validateRoutine(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        updateMutate({ id, values });
        table.setEditingRow(null);
    };

    const columns = columnsRoutine(validationErrors, setValidationErrors);

    return (
        <>
            {isLoading && <Spinner open={true} />}
            <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
                Rutinas
            </h1>
            <div className="mt-5">
                <CustomTable
                    setValidationErrors={setValidationErrors}
                    columns={columns}
                    data={data || []}
                    titleCreate={"Nueva Rutina"}
                    titleEdit={"Editar Rutina"}
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    handleEdit={handleUpdate}
                />
            </div>
        </>
    );
}
