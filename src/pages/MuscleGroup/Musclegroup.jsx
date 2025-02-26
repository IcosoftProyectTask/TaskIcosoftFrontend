//Libraries
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsGroupMuscular } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

//API
import { getMusclegroup, DeleteMusclegroup, insertMusclegroup, UpdateMusclegroup } from "../../service/Musclegroup";

//alerta
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

//Validations
import { validateGroupMuscle } from "../../assets/js/Validations";


export default function getMuscleGroup() {
    const [validationErrors, setValidationErrors] = useState({});
    const queryClient = useQueryClient();

    const { mutate: insertMutate } = useMutation({
        mutationFn: insertMusclegroup,
        onError: () => {
            ToastError("Ocurrió un error al insertar");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getMusclegroup"])
        },
    });

    const { mutate: updateMutate } = useMutation({
        mutationFn: UpdateMusclegroup,
        onError: () => {
            ToastError("Ocurrió un error al actualizar");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getMusclegroup"])
        },
    });


    const { data, isLoading } = useQuery({
        queryKey: ["getMusclegroup"],
        queryFn: getMusclegroup,
    });

    const { mutate } = useMutation({
        mutationFn: DeleteMusclegroup,
        onError: () => {
            ToastError("Ocurrió un error al eliminar el grupo muscular")
        },
        onSuccess: () => {
            ToastSuccess("Se ha eliminado el grupo muscular exitosamente");
            queryClient.invalidateQueries(["getMusclegroup"])

        }
    })

    const handleDelete = (row) => {
        SweetAlertEliminar(
            `Estas seguro que desea eliminar este grupo muscular ${row.nameMuscleGroup}`,
            () => {
                mutate(row.idMuscleGroup)
            }
        )
    }

    const handleSave = async ({ values, table }) => {
        const newValidationErrors = validateGroupMuscle(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        insertMutate(values);
        table.setCreatingRow(null);
    };

    const handleUpdate = async ({ values, table, row }) => {
        const id = row.original.idMuscleGroup;  
        const newValidationErrors = validateGroupMuscle(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        updateMutate({ id, values });  
        table.setEditingRow(null);  
    };
    
    
      

    const columns = columnsGroupMuscular(validationErrors, setValidationErrors);


    return (
        <>
            {isLoading && <Spinner open={true} />}
            <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400  font-bold">
                Grupo Muscular
            </h1>
            <div className="mt-5">
                <CustomTable setValidationErrors={setValidationErrors} columns={columns} data={data || []} titleCreate={"Nuevo Grupo Muscular"} titleEdit={"Editar Grupo Muscular"} handleDelete={handleDelete} handleSave={handleSave} handleEdit={handleUpdate}/>
            </div>
        </>
    );
}