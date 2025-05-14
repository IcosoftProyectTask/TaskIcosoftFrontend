// Libraries
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// Components
import CustomTable from "../../components/reactTable/CustomTable";
import { columnsLicense } from "../../components/reactTable/Colums";
import Spinner from "../../components/Spinner";

// API
import {
  getLicenses,
  createLicense,
  updateLicense,
  deleteLicense,
  getLicenseByCustomerId
} from "../../service/licenseApi";
import { getActiveTypes } from "../../service/TypesLicense";

// Alerts
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

// Component
export default function LicenseView() {
  const [validationErrors, setValidationErrors] = useState({});
  const [licenses, setLicenses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  const { data: tiposCreados, isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos-activos"],
    queryFn: async () => {
      try {
        const response = await getActiveTypes();
        return response.data.map((t) => ({
          value: t.idType,         // <-- importante: 'value' y 'label' son claves esperadas por el select
          label: t.typeName,
          description: t.description || "",
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          status: t.status,
        }));
      } catch (error) {
        console.error("Error fetching types:", error);
        toast.error("Error al cargar los tipos");
        return [];
      }
    },
  });


  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ["getLicenses"],
    queryFn: getLicenses,
    onError: (error) => {
      console.error("Error en la consulta de licencias:", error);
      ToastError(error.message || "Error al obtener las licencias");
    },
  });

  useEffect(() => {
    if (apiResponse?.data) {
      const mapped = apiResponse.data.map((license) => ({
        id: license.idLicense,
        client: license.client,
        deviceName: license.deviceName,
        licenseNumber: license.licenseNumber,
        typeLicenseName: license.typeLicenseName,
        installationDate: license.installationDate,
        status: license.status || "Activo",
      }));
      setLicenses(mapped);
    }
  }, [apiResponse]);

  const validateLicenseData = (values) => {
    const errors = {};
    if (values.client?.trim() && values.client.length < 3)
      errors.client = "Debe tener al menos 3 caracteres";
    if (values.deviceName?.trim() && values.deviceName.length < 3)
      errors.deviceName = "Debe tener al menos 3 caracteres";
    if (values.licenseNumber?.trim() && values.licenseNumber.length < 5)
      errors.licenseNumber = "Debe tener al menos 5 caracteres";
    return errors;
  };

  const { mutate: createMutate } = useMutation({
    mutationFn: createLicense,
    onSuccess: () => {
      ToastSuccess("Licencia creada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      console.error("Error al crear:", error);
      ToastError(error.message || "Error al crear la licencia");
    },
    onMutate: () => setIsCreating(true),
    onSettled: () => setIsCreating(false),
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: ({ id, licenseData }) => updateLicense(id, licenseData),
    onSuccess: () => {
      ToastSuccess("Licencia actualizada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      ToastError(error.message || "Error al actualizar la licencia");
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteLicense,
    onSuccess: () => {
      ToastSuccess("Licencia eliminada exitosamente");
      queryClient.invalidateQueries(["getLicenses"]);
    },
    onError: (error) => {
      ToastError(error.message || "Error al eliminar la licencia");
    },
    onMutate: () => setIsDeleting(true),
    onSettled: () => setIsDeleting(false),
  });

  const handleDelete = (row) => {
    if (!row?.id) {
      ToastError("ID inválido para eliminación");
      return;
    }

    SweetAlertEliminar(
      `¿Desea eliminar la licencia de ${row.client}?`,
      () => deleteMutate(row.id)
    );
  };


  const handleSave = ({ values, table }) => {
    if (window._selectedDate && !values.installationDate) {
      values.installationDate = window._selectedDate;
      delete window._selectedDate;
    }

    const errors = validateLicenseData(values);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    const licenseData = {
      client: values.client,
      deviceName: values.deviceName,
      licenseNumber: values.licenseNumber,
      idTypeLicense: values.typeLicenseName,
      installationDate: values.installationDate,
      status: values.status || "Activo",
    };

    createMutate(licenseData);
    table?.setCreatingRow(null);
  };

  const handleUpdate = ({ values, table, row }) => {
    const id = row?.original?.id;
    if (!id) return ToastError("ID inválido para actualización");

    let installationDate = values.installationDate || row.original.installationDate;
    if (window._selectedDate) {
      installationDate = window._selectedDate;
      delete window._selectedDate;
    }

    const errors = validateLicenseData(values);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    const licenseData = {
      client: values.client,
      deviceName: values.deviceName,
      licenseNumber: values.licenseNumber,
      idTypeLicense: values.typeLicenseName,
      installationDate,
      status: values.status ?? row.original.status,
    };

    updateMutate({ id, licenseData });
    table?.setEditingRow(null);
  };

  const columns = columnsLicense(validationErrors, setValidationErrors, tiposCreados || []);

  const isLoadingData = isLoading || isLoadingTipos || isCreating || isDeleting;

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
