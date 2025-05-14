import { useState, useEffect, useRef } from "react";
import { createRemote, updateRemote } from "../../service/RemoteApi";
import { getCompanies } from "../../service/Companys";
import { getActiveTypes } from "../../service/TypesLicense";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function RemoteModal({
  isOpen,
  onClose,
  refreshData,
  initialData = {},
  selectedCompanyId
}) {
  const [formData, setFormData] = useState({
    terminal: "",
    software: "", // ahora contendrá el id del software
    ipAddress: "",
    user: "",
    password: "",
    companyId: "",
    companyName: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { data: companiesData, isLoading: companiesLoading, error: companiesError } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    enabled: !selectedCompanyId,
  });

  const { data: tiposCreados, isLoading: isLoadingTipos } = useQuery({
  queryKey: ["tipos-activos"],
  queryFn: async () => {
    try {
      const response = await getActiveTypes();
      return response.data.map((t) => ({
        value: t.idType,       // ID para el valor del select
        label: t.typeName,     // Nombre para mostrar
        typeName: t.typeName,  // Mantener referencia al nombre original
        idType: t.idType       // Mantener referencia al ID original
      }));
    } catch (error) {
      console.error("Error fetching types:", error);
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
    
    // Encontrar el tipo de software que coincide con el nombre
    const matchedSoftware = tiposCreados?.find(
      tipo => tipo.label === initialData.software || 
             tipo.typeName === initialData.software
    );
    
    setFormData({
      terminal: initialData.terminal || "",
      software: matchedSoftware?.value || matchedSoftware?.idType || "", // Usar el ID
      ipAddress: initialData.ipAddress || "",
      user: initialData.user || "",
      password: initialData.password || "",
      companyId: initialData.idCustomer || "",
      companyName: company?.companyComercialName || ""
    });
    
    setSearchTerm(company?.companyComercialName || "");
  }
}, [initialData, companiesData, tiposCreados]);

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
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      refreshData();
      onClose();
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  };

  const { mutate: createMutate, isLoading: isCreating } = useMutation({
    mutationFn: (data) => createRemote({ ...data, idCustomer: selectedCompanyId || data.companyId }),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Registro creado con éxito");
      } else {
        console.error("Error en la respuesta:", response);
        showErrorAlert(response.message || "Error al crear el registro");
      }
    },
    onError: (err) => showErrorAlert(err.response?.data?.message || err.message || "Error al crear el registro"),
  });

  const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, data }) =>
      updateRemote(id, { ...data, idCustomer: selectedCompanyId || data.companyId }),
    onSuccess: (response) => {
      if (response.success) {
        showSuccessAlert(response.message || "Registro actualizado con éxito");
      } else {
        showErrorAlert(response.message || "Error al actualizar el registro");
      }
    },
    onError: (err) => showErrorAlert(err.response?.data?.message || err.message || "Error al actualizar el registro"),
  });

  const validate = () => {
    const newErrors = {};

    if (!formData.terminal.trim()) newErrors.terminal = "Terminal es obligatorio";
    if (!formData.software) newErrors.software = "Software es obligatorio";

    const ipRegex = /^(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})\.(25[0-5]|2[0-4]\d|1?\d{1,2})$/;
    const numberSpaceRegex = /^(\d{1,3}\s?){1,4}$/;
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "Dirección IP es obligatoria";
    } else if (!ipRegex.test(formData.ipAddress) && !numberSpaceRegex.test(formData.ipAddress)) {
      newErrors.ipAddress = "Formato de IP o números inválido";
    }

    if (!formData.user.trim()) newErrors.user = "Usuario es obligatorio";
    if (!formData.password.trim()) newErrors.password = "Contraseña es obligatoria";

    if (!selectedCompanyId && !formData.companyId) {
      newErrors.companyId = "Debe seleccionar una compañía";
    }

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
      idTypeLicense: formData.software // ← importante: se envía como idTypeLicense
    };

    if (initialData.id) {
      updateMutate({ id: initialData.id, data });
    } else {
      createMutate(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
      companyName: company.companyComercialName
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
      companyName: value
    }));
    setShowDropdown(true);
  };

  // Debug para ayudar a solucionar problemas - puedes quitarlo después
  useEffect(() => {
    if (initialData.id) {
      console.log("Initial Data:", initialData);
      console.log("Form Data después de setear:", formData);
    }
  }, [formData, initialData]);

  if (!isOpen) return null;

  if (companiesLoading || isLoadingTipos) return <LoadingSpinner />;
  if (companiesError) return <p>Error cargando las compañías.</p>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" aria-hidden="true" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-0">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          {(isCreating || isUpdating) && <LoadingSpinner />}
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {initialData.id ? "Editar Registro Remoto" : "Nuevo Registro Remoto"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedCompanyId && (
                <div className="relative" ref={dropdownRef}>
                  <label htmlFor="companySearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Compañía
                  </label>
                  <input
                    type="text"
                    id="companySearch"
                    placeholder="Buscar y seleccionar compañía..."
                    value={searchTerm}
                    onChange={handleCompanySearchChange}
                    onFocus={() => setShowDropdown(true)}
                    className={`w-full px-3 py-2 border ${errors.companyId ? "border-red-300 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                  />
                  <input type="hidden" name="companyId" value={formData.companyId} />

                  {showDropdown && filteredCompanies.length > 0 && (
                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                      {filteredCompanies.map(company => (
                        <li
                          key={company.idCompany}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleCompanySelect(company)}
                        >
                          <span className="ml-3 block font-normal truncate dark:text-white">
                            {company.companyComercialName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.companyId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyId}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="software" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Software
                </label>
                <select
  id="software"
  name="software"
  value={formData.software}
  onChange={handleChange}
  className={`w-full px-3 py-2 border ${errors.software ? "border-red-300 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
>
  <option value="">Seleccionar software</option>
  {tiposCreados?.map((tipo) => (
    <option key={tipo.value} value={tipo.value}>
      {tipo.label}
    </option>
  ))}
</select>
                {errors.software && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.software}</p>
                )}
              </div>

              {["terminal", "ipAddress", "user", "password"].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                    {field === "ipAddress" ? "ID de conexion" : field === "user" ? "Usuario" : field === "password" ? "Contraseña" : field}
                  </label>
                  <input
                    type={field === "password" && !showPassword ? "password" : "text"}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors[field] ? "border-red-300 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                    placeholder={field}
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-sm text-gray-500 dark:text-gray-300"
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  )}
                  {errors[field] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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