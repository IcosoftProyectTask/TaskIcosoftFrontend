//Libraries
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsTagImc } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

//API
import { getTagImc, insertTagImc, DeleteTagImc, UpdateTagImc } from "../../service/TagImc";

//Alerts
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

//Validations
import { validateTagImc } from "../../assets/js/Validations";

export default function TagImcPage() {
    const [validationErrors, setValidationErrors] = useState({});
    const queryClient = useQueryClient();

    const { mutate: insertMutate } = useMutation({
        mutationFn: insertTagImc,
        onError: () => {
            ToastError("Ocurrió un error al insertar");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getTagImc"]);
        },
    });

    const { mutate: updateMutate } = useMutation({
        mutationFn: UpdateTagImc,
        onError: () => {
            ToastError("Ocurrió un error al actualizar");
        },
        onSuccess: (data) => {
            ToastSuccess(data.message);
            queryClient.invalidateQueries(["getTagImc"]);
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["getTagImc"],
        queryFn: getTagImc,
    });

    const { mutate } = useMutation({
        mutationFn: DeleteTagImc,
        onError: () => {
            ToastError("Ocurrió un error al eliminar el Tag IMC");
        },
        onSuccess: () => {
            ToastSuccess("Se ha eliminado el Tag IMC exitosamente");
            queryClient.invalidateQueries(["getTagImc"]);
        },
    });

    const handleDelete = (row) => {
        SweetAlertEliminar(
            `Estas seguro que desea eliminar este Tag IMC ${row.nameTagImc}`,
            () => {
                mutate(row.idTagImc);
            }
        );
    };

    const handleSave = async ({ values, table }) => {
        const newValidationErrors = validateTagImc(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        insertMutate(values);
        table.setCreatingRow(null);
    };

    const handleUpdate = async ({ values, table, row }) => {
        const id = row.original.idTagImc;
        const newValidationErrors = validateTagImc(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            console.warn("Errores de validación:", newValidationErrors);
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        updateMutate({ id, values });
        table.setEditingRow(null);
    };

    const columns = columnsTagImc(validationErrors, setValidationErrors);

    return (
        <>
            {isLoading && <Spinner open={true} />}
            <h1 className="text-xl md:text-2xl text-gray-500 dark:text-blue-400 font-bold">
                Tag IMC
            </h1>
            <div className="mt-5">
                <CustomTable
                    setValidationErrors={setValidationErrors}
                    columns={columns}
                    data={data || []}
                    titleCreate={"Nuevo Tag IMC"}
                    titleEdit={"Editar Tag IMC"}
                    handleDelete={handleDelete}
                    handleSave={handleSave}
                    handleEdit={handleUpdate}
                />
            </div>
        </>
    );
}

