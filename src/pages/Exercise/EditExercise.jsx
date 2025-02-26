import React, { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { getMusclegroup } from "../../service/Musclegroup";
import { updateImage } from "../../service/Image";
import { UpdateExercise } from "../../service/Exercise";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import { validateExercise } from "../../assets/js/Validations";

export default function EditExercise({ exerciseData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    ...exerciseData,

    numberOfSeries: String(exerciseData?.numberOfSeries || "0"),
    numberOfRepetitions: String(exerciseData?.numberOfRepetitions || "0"),
    kilosWeightReduced: String(exerciseData?.kilosWeightReduced || "0"),
    idMuscleGroup: String(exerciseData?.idMuscleGroup || "0")
  });
  const [previewImage, setPreviewImage] = useState("");
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (exerciseData?.imageBase64) {
      setPreviewImage(`data:image/jpeg;base64,${exerciseData.imageBase64}`);
    }
  }, [exerciseData]);

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const response = await getMusclegroup();
        setMuscleGroups(response);
      } catch (error) {
        console.error("Error al cargar los grupos musculares:", error);
      }
    };
    fetchMuscleGroups();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setNewImageFile(file);

    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewImage(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: "image/*",
  });

  const handleEdit = async () => {
    try {
      
      const exerciseUpdateData = {
        nameExercise: formData.nameExercise,
        descriptionExercise: formData.descriptionExercise,
        exerciseVideo: formData.exerciseVideo,
        idImage: formData.idImage,
        numberOfSeries: String(formData.numberOfSeries),
        numberOfRepetitions: String(formData.numberOfRepetitions),
        kilosWeightReduced: String(formData.kilosWeightReduced),
        idMuscleGroup: String(formData.idMuscleGroup),
      };
  
      const validationErrors = validateExercise(exerciseUpdateData);
  
      if (Object.keys(validationErrors).length > 0) {
        ToastError("Por favor, corrija los errores en el formulario.");
        return;
      }

      if (newImageFile) {
        try {
          await updateImage(formData.idImage, newImageFile);
        } catch (error) {
          ToastError("Error al actualizar la imagen: " + error.message);
          return;
        }
      }

      await UpdateExercise({
        id: formData.idExercise,
        values: exerciseUpdateData
      });

      onSave(exerciseUpdateData);

    } catch (error) {
      ToastError("Error al actualizar el ejercicio: " + error.message);
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
          <h3 className="text-xl font-semibold text-gray-500 dark:text-blue-400">
            Editar Ejercicio
          </h3>
        </div>
        <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">
          <form className="space-y-4">
            <TextField
              label="Nombre del ejercicio"
              name="nameExercise"
              value={formData.nameExercise || ""}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Descripción"
              name="descriptionExercise"
              value={formData.descriptionExercise || ""}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Video del ejercicio"
              name="exerciseVideo"
              value={formData.exerciseVideo || ""}
              onChange={handleInputChange}
              fullWidth
            />
            
            <div className="space-y-2">
              <p className="font-medium">Imagen actual </p>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Previsualización"
                  className="w-full h-auto rounded-lg mb-4"
                />
              )}
              
              <p className="font-medium">Actualizar Imagen</p>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 p-3 cursor-pointer rounded-lg"
              >
                <input {...getInputProps()} />
                <p className="text-center text-gray-600">
                  Arrastra o selecciona una nueva imagen
                </p>
              </div>
              {newImageFile && (
                <p className="text-sm text-gray-500">
                  Nueva imagen seleccionada: {newImageFile.name}
                </p>
              )}
            </div>

            <TextField
              label="Número de series"
              name="numberOfSeries"
              value={formData.numberOfSeries}
              onChange={handleInputChange}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Número de repeticiones"
              name="numberOfRepetitions"
              value={formData.numberOfRepetitions}
              onChange={handleInputChange}
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Peso reducido (kg)"
              name="kilosWeightReduced"
              value={formData.kilosWeightReduced}
              onChange={handleInputChange}
              fullWidth
              type="number"
              inputProps={{ min: 0, step: "0.1" }}
            />
            <FormControl fullWidth>
              <InputLabel id="muscle-group-label">Grupo Muscular</InputLabel>
              <Select
                labelId="muscle-group-label"
                value={formData.idMuscleGroup}
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
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleEdit}
              >
                Guardar Cambios
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}