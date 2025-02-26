import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useQueryClient } from "@tanstack/react-query";
import { getMusclegroup } from "../../service/Musclegroup";
import { insertImage } from "../../service/Image";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import { validateExercise } from "../../assets/js/Validations";

export default function Exercise({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nameExercise: "",
    descriptionExercise: "",
    exerciseVideo: "",
    idImage: null,
    numberOfSeries: "",
    numberOfRepetitions: "",
    kilosWeightReduced: "",
    idMuscleGroup: "",
  });

  const [imageName, setImageName] = useState("");
  const [muscleGroups, setMuscleGroups] = useState([]);
  const queryClient = useQueryClient();

  // Fetch muscle groups on component mount
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await getMusclegroup();
        setMuscleGroups(response);
      } catch (error) {
        console.error("Error al obtener los grupos musculares:", error);
      }
    };
    fetchMuscleGroups();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageDrop = (acceptedFiles) => {
    setFormData((prevState) => ({ ...prevState, idImage: acceptedFiles[0] }));
    setImageName(acceptedFiles[0].name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: "image/*",
  });

  const handleCreate = async () => {
    const validationErrors = validateExercise(formData);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        ToastError(`${field}: ${error}`);
      });
      return;
    }

    try {
      if (!formData.idImage) {
        ToastError("No se ha seleccionado ninguna imagen.");
        return;
      }

      const fileExtension = formData.idImage.name.split(".").pop().toLowerCase();
      let idImageType = 0;

      if (["jpg", "jpeg", "png", "bmp", "webp"].includes(fileExtension)) {
        idImageType = 1;
      } else if (["gif"].includes(fileExtension)) {
        idImageType = 2;
      } else {
        ToastError("Formato de archivo no permitido.");
        return;
      }

      const imageResponse = await insertImage(formData.idImage, idImageType);

      if (imageResponse.success) {
        const { idImage } = imageResponse.data;

        const updatedFormData = {
          ...formData,
          idImage,
          numberOfSeries: parseInt(formData.numberOfSeries, 10),
          numberOfRepetitions: parseInt(formData.numberOfRepetitions, 10),
          kilosWeightReduced: parseFloat(formData.kilosWeightReduced),
          idMuscleGroup: parseInt(formData.idMuscleGroup, 10),
        };

        onSave(updatedFormData); 
      } else {
        ToastError("Error al subir la imagen: " + imageResponse.message);
      }
    } catch (error) {
      ToastError("Error al crear el ejercicio: " + error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-10 overflow-y-auto"
      onClick={() => typeof onClose === "function" && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-500 dark:text-blue-400">{`Crear Ejercicio`}</h3>
        </div>
        <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">
          <form className="space-y-4">
            <TextField
              label="Nombre del ejercicio"
              name="nameExercise"
              value={formData.nameExercise}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Descripción"
              name="descriptionExercise"
              value={formData.descriptionExercise}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Video del ejercicio"
              name="exerciseVideo"
              value={formData.exerciseVideo}
              onChange={handleInputChange}
              fullWidth
            />
            <p className="font-medium">Agregar Imagen</p>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-400 p-3 cursor-pointer"
            >
              <input {...getInputProps()} />
              <p>Arrastra o selecciona una imagen</p>
            </div>
            {imageName && (
              <Typography variant="body2" className="mt-2 text-gray-500">
                Imagen seleccionada: {imageName}
              </Typography>
            )}
            <TextField
              label="Número de series"
              name="numberOfSeries"
              value={formData.numberOfSeries}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Número de repeticiones"
              name="numberOfRepetitions"
              value={formData.numberOfRepetitions}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Peso reducido (kg)"
              name="kilosWeightReduced"
              value={formData.kilosWeightReduced}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="muscle-group-label">Grupo Muscular</InputLabel>
              <Select
                labelId="muscle-group-label"
                value={formData.idMuscleGroup || ""}
                label="Grupo Muscular"
                onChange={handleInputChange}
                name="idMuscleGroup"
              >
                {muscleGroups.map((group) => (
                  <MenuItem key={group.idMuscleGroup} value={group.idMuscleGroup}>
                    {group.nameMuscleGroup}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreate}
            >
              Crear Ejercicio
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
