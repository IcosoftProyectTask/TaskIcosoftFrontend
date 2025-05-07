import { useState, useEffect } from "react";
import ContainerLayout from "../../components/form/ContainerLayout";
import InputForm from "../../components/form/InputForm";
import Spinner from "../../components/Spinner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import {
  getUserById,
  updateProfile,
  UpdateUserClientPhoto,
} from "../../service/UserAPI";
import { useUserContext } from "../../context/UserContext";
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";
import { decodeToken } from "../../utils/Utils";

export default function Profile() {
  const { setUserInfo, userInfo } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showDropArea, setShowDropArea] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Cargar imagen del usuario desde el backend si está disponible
    const fetchUserImage = async () => {
      try {
        const user = decodeToken();
        const userData = await getUserById(user);
        
        // Verificar si hay una imagen base64 en la respuesta
        if (userData.image && userData.image.base64Image) {
          setPreviewImage(userData.image.base64Image);
        }
      } catch {
        ToastError("Error al cargar la imagen de perfil");
      }
    };

    if (!selectedImage && !previewImage) {
      fetchUserImage();
    }
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.onerror = () => ToastError("Error al cargar la imagen");
    reader.readAsDataURL(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    const handleDragEnterGlobal = () => {
      setIsDragging(true);
      setShowDropArea(true);
    };

    const handleDragLeaveGlobal = (e) => {
      if (
        e.clientX <= 0 ||
        e.clientY <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setIsDragging(false);
      }
    };

    document.addEventListener("dragenter", handleDragEnterGlobal);
    document.addEventListener("dragleave", handleDragLeaveGlobal);

    return () => {
      document.removeEventListener("dragenter", handleDragEnterGlobal);
      document.removeEventListener("dragleave", handleDragLeaveGlobal);
    };
  }, []);

  const { mutate: mutateProfile, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => ToastError(error.message),
    onSuccess: async (data) => {
      try {
        const user = decodeToken();
        const userData = await getUserById(user);
        setUserInfo({
          id: user,
          name: userData.name,
          firstSurname: userData.firstSurname,
          secondSurname: userData.secondSurname,
          phoneNumber: userData.phoneNumber,
        });
        ToastSuccess(data.message);
      } catch {
        ToastError("Error al obtener la información del usuario");
      }
    },
  });

  const { mutate: mutatePhoto } = useMutation({
    mutationFn: UpdateUserClientPhoto,
    onError: (error) => ToastError(error.message),
    onSuccess: () => ToastSuccess("Imagen actualizada correctamente"),
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("No se pudo leer el archivo");
      reader.readAsDataURL(file);
    });

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || "",
      firstSurname: userInfo?.firstSurname || "",
      secondSurname: userInfo?.secondSurname || "",
      phoneNumber: userInfo?.phoneNumber || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      firstSurname: Yup.string().required("El primer apellido es requerido"),
      secondSurname: Yup.string().required("El segundo apellido es requerido"),
      phoneNumber: Yup.string()
        .matches(/^\d{8}$/, "Debe tener 8 dígitos")
        .required("Requerido"),
    }),
    onSubmit: async (values) => {
      mutateProfile({ id: userInfo.id, formData: values });

      if (selectedImage) {
        try {
          const base64 = await toBase64(selectedImage);
          mutatePhoto({ id: userInfo.id, base64Image: base64 });
        } catch {
          ToastError("Error al convertir la imagen");
        }
      }
    },
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetImage(file);
      setShowDropArea(false);
    }
  };

  const validateAndSetImage = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      ToastError("La imagen es demasiado grande, máximo 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      ToastError("Por favor seleccione una imagen válida");
      return;
    }

    setSelectedImage(file);
  };

  const toggleDropArea = () => {
    setShowDropArea(!showDropArea);
  };

  return (
    <ContainerLayout text="¡Mi perfil!">
      {isPending && <Spinner open />}
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-6 max-w-xl mx-auto"
      >
        {/* Imagen de perfil */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 shadow dark:shadow-gray-800">
            <img
              src={previewImage || "/default-avatar.png"}
              alt="Imagen de perfil"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={toggleDropArea}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
            >
              Cambiar imagen
            </button>
          </div>

          {showDropArea && (
            <div
              className={`mt-2 border-2 border-dashed p-8 rounded-lg text-center w-full transition-all duration-300
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900/30"
                    : "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-gray-800/50"
                }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-12 w-12 transition-colors duration-300 ${
                    isDragging
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-blue-400 dark:text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {isDragging
                    ? "¡Suelta la imagen aquí!"
                    : "Arrastra una imagen aquí"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Formatos permitidos: JPG, PNG, GIF, WebP (máx. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            fieldType="text"
            fieldName="name"
            placeholder="Nombre"
            labelText="Nombre"
            formik={formik}
          />
          <InputForm
            fieldType="text"
            fieldName="firstSurname"
            placeholder="Primer apellido"
            labelText="Primer apellido"
            formik={formik}
          />
          <InputForm
            fieldType="text"
            fieldName="secondSurname"
            placeholder="Segundo apellido"
            labelText="Segundo apellido"
            formik={formik}
          />
          <InputForm
            fieldType="text"
            fieldName="phoneNumber"
            placeholder="Número de teléfono"
            labelText="Número de teléfono"
            formik={formik}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
          >
            Actualizar perfil
          </button>
        </div>
      </form>
    </ContainerLayout>
  );
}
