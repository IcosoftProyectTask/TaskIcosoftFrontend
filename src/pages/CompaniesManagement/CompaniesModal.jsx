import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CompaniesModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  validationErrors = {},
  setValidationErrors,
  isLoading
}) {
  const [formData, setFormData] = useState({
    companyFiscalName: "",
    companyComercialName: "",
    email: "",
    companyAddress: "",
    idCart: "",
    companyPhone: "",
    status: true // Estado activo por defecto
  });

  const [localValidationErrors, setLocalValidationErrors] = useState({});

  useEffect(() => {
    setLocalValidationErrors({});

    if (isOpen) {
      if (initialData.id) {
        setFormData({
          companyFiscalName: initialData.companyFiscalName || "",
          companyComercialName: initialData.companyComercialName || "",
          email: initialData.email || "",
          companyAddress: initialData.companyAddress || "",
          idCart: initialData.idCart || "",
          companyPhone: initialData.companyPhone || "",
          status: initialData.status !== undefined ? initialData.status : true
        });
      } else {
        setFormData({
          companyFiscalName: "",
          companyComercialName: "",
          email: "",
          companyAddress: "",
          idCart: "",
          companyPhone: "",
          status: true // Siempre true para nuevos registros
        });
      }
    }
  }, [isOpen, initialData]);

  const displayErrors = { ...validationErrors, ...localValidationErrors };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Bloquear cambios en el status para nuevos registros
    if (name === 'status' && !initialData.id) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (displayErrors[name]) {
      setLocalValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));

      if (validationErrors[name]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8,}$/;

    if (!formData.companyFiscalName.trim()) {
      errors.companyFiscalName = "El nombre fiscal es requerido";
    }

    if (!formData.companyComercialName.trim()) {
      errors.companyComercialName = "El nombre comercial es requerido";
    }

    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email inválido";
    }

    if (!formData.companyAddress.trim()) {
      errors.companyAddress = "La dirección es requerida";
    }

    if (!formData.idCart.trim()) {
      errors.idCart = "El ID fiscal es requerido";
    }

    if (!formData.companyPhone.trim()) {
      errors.companyPhone = "El teléfono es requerido";
    } else if (!phoneRegex.test(formData.companyPhone)) {
      errors.companyPhone = "Teléfono inválido (mínimo 8 dígitos)";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setLocalValidationErrors(errors);

      Swal.fire({
        icon: 'warning',
        title: 'Validación',
        text: 'Por favor, completa correctamente todos los campos requeridos',
        confirmButtonColor: '#3085d6',
      });

      return;
    }

    try {
      // Preparar datos para enviar - Asegurarse de incluir el status
      const formDataToSubmit = {
        companyFiscalName: formData.companyFiscalName,
        companyComercialName: formData.companyComercialName,
        email: formData.email,
        companyAddress: formData.companyAddress,
        idCart: formData.idCart,
        companyPhone: formData.companyPhone,
        status: formData.status // Asegurar que siempre se incluya el status
      };

      await onSubmit(formDataToSubmit);
      setLocalValidationErrors({});
    } catch (error) {
      console.error("Error al guardar:", error);

      if (error.validationErrors) {
        setLocalValidationErrors(error.validationErrors);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo guardar la compañía',
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {initialData.id ? "Editar Compañía" : "Nueva Compañía"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Fiscal<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyFiscalName"
                  value={formData.companyFiscalName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.companyFiscalName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.companyFiscalName && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.companyFiscalName}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Comercial<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyComercialName"
                  value={formData.companyComercialName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.companyComercialName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.companyComercialName && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.companyComercialName}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dirección<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.companyAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.companyAddress && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.companyAddress}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID Fiscal<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idCart"
                  value={formData.idCart}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.idCart ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.idCart && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.idCart}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teléfono<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${displayErrors.companyPhone ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {displayErrors.companyPhone && (
                  <p className="text-sm text-red-600 mt-1">{displayErrors.companyPhone}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  disabled={!initialData.id}
                  className={`h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 ${!initialData.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                />
                <label htmlFor="status" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Activo
                </label>
                {!initialData.id && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    (Siempre activo para nuevas compañías)
                  </span>
                )}
                {process.env.NODE_ENV === 'development' && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Estado actual: {formData.status ? 'Activo' : 'Inactivo'})
                  </span>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-600 dark:text-white"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
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