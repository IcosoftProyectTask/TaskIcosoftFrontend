import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function UserClientModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  validationErrors = {},
  setValidationErrors,
  isLoading
}) {
  const [formData, setFormData] = useState({
    name: "",
    firstSurname: "",
    secondSurname: "",
    phoneNumber: "",
    email: ""
  });

  useEffect(() => {
    if (initialData.id) {
      setFormData({
        name: initialData.name || "",
        firstSurname: initialData.firstSurname || "",
        secondSurname: initialData.secondSurname || "",
        phoneNumber: initialData.phoneNumber || "",
        email: initialData.email || ""
      });
    }
  }, [initialData]);

  const nameRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const phoneRegex = /^[0-9]{7,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido.";
    } else if (!nameRegex.test(formData.name)) {
      errors.name = "El nombre solo puede contener letras y espacios.";
    }

    if (!formData.firstSurname.trim()) {
      errors.firstSurname = "El primer apellido es requerido.";
    } else if (!nameRegex.test(formData.firstSurname)) {
      errors.firstSurname = "El primer apellido solo puede contener letras y espacios.";
    }

    if (!formData.secondSurname.trim()) {
      errors.secondSurname = "El segundo apellido es requerido.";
    } else if (!nameRegex.test(formData.secondSurname)) {
      errors.secondSurname = "El segundo apellido solo puede contener letras y espacios.";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "El teléfono es requerido.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "El teléfono debe contener solo números y tener al menos 7 dígitos.";
    }

    if (!formData.email.trim()) {
      errors.email = "El email es requerido.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "El email no es válido.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // En UserClientModal
const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    return;
  }

  try {
    await onSubmit(formData);
    
    
  } catch (error) {
    console.error("Error al guardar:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo guardar el usuario',
    });
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {initialData.id ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {validationErrors.name && <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primer Apellido</label>
                <input
                  type="text"
                  name="firstSurname"
                  value={formData.firstSurname}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.firstSurname ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {validationErrors.firstSurname && <p className="text-sm text-red-600 mt-1">{validationErrors.firstSurname}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Segundo Apellido</label>
                <input
                  type="text"
                  name="secondSurname"
                  value={formData.secondSurname}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.secondSurname ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {validationErrors.secondSurname && <p className="text-sm text-red-600 mt-1">{validationErrors.secondSurname}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.phoneNumber ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {validationErrors.phoneNumber && <p className="text-sm text-red-600 mt-1">{validationErrors.phoneNumber}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${validationErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"} rounded-md shadow-sm dark:bg-gray-700 dark:text-white`}
                />
                {validationErrors.email && <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>}
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
