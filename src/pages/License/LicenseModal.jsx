import { useState, useEffect, useRef } from "react";
import { createLicense, updateLicense } from "../../service/licenseApi";
import { getCompanies } from "../../service/Companys";
import { getActiveTypes } from "../../service/TypesLicense";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function LicenseModal({
  isOpen,
  onClose,
  refreshData,
  initialData = {},
  selectedCompanyId
}) {
  const [formData, setFormData] = useState({
    idCustomer: "",
    deviceName: "",
    licenseNumber: "",
    idTypeLicense: "",
    installationDate: new Date().toISOString(),
    status: true, // Initialize as true (active) for new licenses
    companyName: ""
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Consulta para obtener compañías (solo si no hay selectedCompanyId)
  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    enabled: !selectedCompanyId,
  });

  // Consulta para tipos de licencia con transformación de datos
  const { data: tiposLicencia, isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ["licenseTypes"],
    queryFn: async () => {
      try {
        const response = await getActiveTypes();
        return response.data.map((t) => ({
        value: t.idType,
        label: t.typeName,
        typeLicenseName: t.typeName,
        idTypeLicense: t.idType
        }));

      } catch (error) {
        console.error("Error fetching license types:", error);
        return [];
      }
    },
  });

  const filteredCompanies = Array.isArray(companiesData?.data)
    ? companiesData.data.filter(company =>
        company.companyComercialName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (initialData.id) {
      const company = companiesData?.data?.find(c => c.idCompany === initialData.idCustomer);
      
      // Encontrar el tipo de licencia que coincide
      const matchedLicenseType = tiposLicencia?.find(
        tipo => tipo.label === initialData.typeLicenseName || 
               tipo.typeLicenseName === initialData.typeLicenseName
      );
      
      setFormData({
        idCustomer: initialData.idCustomer || "",
        deviceName: initialData.deviceName || "",
        licenseNumber: initialData.licenseNumber || "",
        idTypeLicense: matchedLicenseType?.value || matchedLicenseType?.idTypeLicense || "",
        installationDate: initialData.installationDate || new Date().toISOString(),
        status: initialData.status !== undefined ? Boolean(initialData.status) : true,
        companyName: company?.companyComercialName || ""
      });
      
      setSearchTerm(company?.companyComercialName || "");
    }
  }, [initialData, companiesData, tiposLicencia]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "¡Éxito!",
      text: message,
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    }).then(() => {
      refreshData();
      onClose();
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    });
  };

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: (data) => createLicense(data),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Licencia creada con éxito");
      } else {
        showErrorAlert(response.message || "Error al crear la licencia");
      }
    },
    onError: (err) => {
      showErrorAlert(err.response?.data?.message || err.message || "Error al crear la licencia");
    },
  });

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateLicense(id, data),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Licencia actualizada con éxito");
      } else {
        showErrorAlert(response.message || "Error al actualizar la licencia");
      }
    },
    onError: (err) => {
      showErrorAlert(err.response?.data?.message || err.message || "Error al actualizar la licencia");
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.deviceName.trim()) newErrors.deviceName = "Nombre del dispositivo es obligatorio";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Número de licencia es obligatorio";
    if (!formData.idTypeLicense) newErrors.idTypeLicense = "Debe seleccionar un tipo de licencia";
    if (!formData.installationDate) newErrors.installationDate = "Fecha de instalación es obligatoria";
    if (!selectedCompanyId && !formData.idCustomer) newErrors.idCustomer = "Debe seleccionar un cliente";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const data = {
      ...formData,
      idCustomer: selectedCompanyId || formData.idCustomer,
      // Siempre usar el valor booleano actual del status, tanto para crear como para actualizar
      status: Boolean(formData.status),
      companyName: undefined // No enviar este campo al backend
    };

    if (initialData.id) {
      updateMutate({ id: initialData.id, data });
    } else {
      createMutate(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedValue = name === "installationDate" 
      ? new Date(value).toISOString() 
      : value;

    setFormData(prev => ({ ...prev, [name]: updatedValue }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({ ...prev, status: e.target.checked }));
  };

  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      idCustomer: company.idCompany,
      companyName: company.companyComercialName,
    }));
    setSearchTerm(company.companyComercialName);
    setShowDropdown(false);
  };

  const handleCompanySearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      idCustomer: "",
      companyName: value,
    }));
    setShowDropdown(true);
  };

  if (!isOpen) return null;
  if (typesLoading || companiesLoading) return <LoadingSpinner />;
  if (typesError || companiesError) return <p>Error cargando datos.</p>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          {(isCreating || isUpdating) && <LoadingSpinner />}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {initialData.id ? "Editar Licencia" : "Nueva Licencia"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedCompanyId && (
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compañía</label>
                  <input
                    type="text"
                    placeholder="Buscar compañía..."
                    value={searchTerm}
                    onChange={handleCompanySearchChange}
                    onFocus={() => setShowDropdown(true)}
                    className={`w-full px-3 py-2 border ${errors.idCustomer ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                  />
                  {showDropdown && filteredCompanies.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                      {filteredCompanies.map((company) => (
                        <li
                          key={company.idCompany}
                          className="cursor-pointer py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleCompanySelect(company)}
                        >
                          {company.companyComercialName}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.idCustomer && <p className="text-sm text-red-600 mt-1">{errors.idCustomer}</p>}
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Dispositivo</label>
                <input
                  type="text"
                  name="deviceName"
                  value={formData.deviceName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.deviceName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.deviceName && <p className="text-sm text-red-600 mt-1">{errors.deviceName}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Licencia</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.licenseNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.licenseNumber && <p className="text-sm text-red-600 mt-1">{errors.licenseNumber}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Licencia</label>
                <select
                  name="idTypeLicense"
                  value={formData.idTypeLicense}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.idTypeLicense ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposLicencia?.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.idTypeLicense && <p className="text-sm text-red-600 mt-1">{errors.idTypeLicense}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha de Instalación
                </label>
                <input
                  type="datetime-local"
                  name="installationDate"
                  value={formData.installationDate ? formData.installationDate.substring(0, 16) : ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.installationDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.installationDate && <p className="text-sm text-red-600 mt-1">{errors.installationDate}</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleStatusChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="status" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Licencia activa
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-600 dark:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {initialData.id ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}