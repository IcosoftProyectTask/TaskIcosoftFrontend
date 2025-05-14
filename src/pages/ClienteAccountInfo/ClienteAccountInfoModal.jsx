import { useState, useEffect, useRef } from "react";
import { createClienteAccountInfo, updateClienteAccountInfo } from "../../service/clienteAccountInfoApi";
import { getCompanies } from "../../service/Companys";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function ClienteAccountInfoModal({
  isOpen,
  onClose,
  refreshData,
  initialData = {},
  selectedCompanyId
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    appPassword: "",
    vin: "",
    companyId: "",
    companyName: "",
    date1: new Date().toISOString() // Fecha actual por defecto
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showAppPassword, setShowAppPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    enabled: !selectedCompanyId,
  });

  const filteredCompanies = Array.isArray(companiesData?.data)
    ? companiesData.data.filter(company =>
        company.companyComercialName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (initialData.id) {
      const company = companiesData?.data?.find(c => c.idCompany === initialData.idCustomer);
      setFormData({
        email: initialData.email || "",
        password: initialData.password || "",
        appPassword: initialData.appPassword || "",
        vin: initialData.vin || "",
        companyId: initialData.idCustomer || "",
        companyName: company?.companyComercialName || "",
        date1: initialData.date1 || new Date().toISOString()
      });
      setSearchTerm(company?.companyComercialName || "");
    }
  }, [initialData, companiesData]);

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
    mutationFn: (data) => createClienteAccountInfo(data),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Registro creado con éxito");
      } else {
        showErrorAlert(response.message || "Error al crear el registro");
      }
    },
    onError: (err) => {
      console.error("Error detallado:", err);
      showErrorAlert(err.response?.data?.message || err.message || "Error al crear el registro");
    },
  });

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateClienteAccountInfo(id, data),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Registro actualizado con éxito");
      } else {
        showErrorAlert(response.message || "Error al actualizar el registro");
      }
    },
    onError: (err) => {
      console.error("Error detallado:", err);
      showErrorAlert(err.response?.data?.message || err.message || "Error al actualizar el registro");
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email es obligatorio";
    if (!formData.password.trim()) newErrors.password = "Contraseña es obligatoria";
    if (!formData.appPassword.trim()) newErrors.appPassword = "App Password es obligatoria";
    if (!formData.vin.trim()) newErrors.vin = "VIN es obligatorio";
    if (!formData.date1) newErrors.date1 = "Fecha es obligatoria";
    if (!selectedCompanyId && !formData.companyId) newErrors.companyId = "Debe seleccionar una compañía";
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
      idCustomer: selectedCompanyId || formData.companyId,
      companyId: undefined,
      companyName: undefined
    };

    console.log("Datos a enviar:", data);

    if (initialData.id) {
      updateMutate({ id: initialData.id, data });
    } else {
      createMutate(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    const updatedValue = name === "date1" 
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

  const handleCompanySelect = (company) => {
    setFormData(prev => ({
      ...prev,
      companyId: company.idCompany,
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
      companyId: "",
      companyName: value,
    }));
    setShowDropdown(true);
  };

  if (!isOpen) return null;
  if (companiesLoading) return <LoadingSpinner />;
  if (companiesError) return <p>Error cargando compañías.</p>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          {(isCreating || isUpdating) && <LoadingSpinner />}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {initialData.id ? "Editar Cuenta Cliente" : "Nueva Cuenta Cliente"}
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
                    className={`w-full px-3 py-2 border ${errors.companyId ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
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
                  {errors.companyId && <p className="text-sm text-red-600 mt-1">{errors.companyId}</p>}
                </div>
              )}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VIN</label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.vin ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.vin && <p className="text-sm text-red-600 mt-1">{errors.vin}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-sm text-gray-500 dark:text-gray-300"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">App Password</label>
                <input
                  type={showAppPassword ? "text" : "password"}
                  name="appPassword"
                  value={formData.appPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.appPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowAppPassword(!showAppPassword)}
                  className="absolute right-3 top-8 text-sm text-gray-500 dark:text-gray-300"
                >
                  {showAppPassword ? "Ocultar" : "Mostrar"}
                </button>
                {errors.appPassword && <p className="text-sm text-red-600 mt-1">{errors.appPassword}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha
                </label>
                <input
                  type="datetime-local"
                  name="date1"
                  value={formData.date1 ? formData.date1.substring(0, 16) : ""}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.date1 ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {errors.date1 && <p className="text-sm text-red-600 mt-1">{errors.date1}</p>}
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