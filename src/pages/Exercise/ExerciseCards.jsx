import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExercise, DeleteExercise, insertExercise } from "../../service/Exercise";
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import Exercise from "./Exercise";
import EditExercise from "./EditExercise"; // Modal para editar

const ExerciseCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para modal de edición
  const [exerciseToEdit, setExerciseToEdit] = useState(null); // Ejercicio seleccionado
  const queryClient = useQueryClient();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["getExercise"],
    queryFn: getExercise,
  });

  const { mutate: deleteExercise } = useMutation({
    mutationFn: DeleteExercise,
    onError: () => {
      ToastError("Ocurrió un error al eliminar el ejercicio");
    },
    onSuccess: () => {
      ToastSuccess("Ejercicio eliminado exitosamente");
      queryClient.invalidateQueries(["getExercise"]);
    },
  });

  const { mutate: insertMutate } = useMutation({
    mutationFn: insertExercise,
    onError: () => {
      ToastError("Ocurrió un error al insertar el ejercicio");
    },
    onSuccess: () => {
      ToastSuccess("Ejercicio insertado exitosamente");
      queryClient.invalidateQueries(["getExercise"]);
    },
  });

  const handleDelete = (exerciseId, exerciseName) => {
    SweetAlertEliminar(
      `¿Estás seguro que deseas eliminar el ejercicio ${exerciseName}?`,
      () => {
        deleteExercise(exerciseId);
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateExercise = (newExercise) => {
    insertMutate(newExercise);
    setIsModalOpen(false);
  };

  const handleEditExercise = (exercise) => {
    setExerciseToEdit(exercise); // Guardar ejercicio seleccionado
    setIsEditModalOpen(true); // Abrir modal de edición
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setExerciseToEdit(null); // Limpiar ejercicio seleccionado
  };

  if (isLoading) {
    return <div>Cargando ejercicios...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-start p-6 relative">
      {/* Botón de insertar ejercicio */}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-600 text-lg flex items-center justify-center z-10"
        onClick={() => setIsModalOpen(true)}
        title="Agregar ejercicio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Modal de agregar ejercicio */}
      {isModalOpen && <Exercise onClose={handleModalClose} onSave={handleCreateExercise} />}

      {/* Modal de editar ejercicio */}
      {isEditModalOpen && (
        <EditExercise
          exerciseData={exerciseToEdit}
          onClose={handleEditModalClose}
          onSave={(updatedExercise) => {
            // Lógica para actualizar ejercicio aquí
            ToastSuccess("Ejercicio actualizado exitosamente");
            queryClient.invalidateQueries(["getExercise"]);
            handleEditModalClose();
          }}
        />
      )}

      {/* Tarjetas de ejercicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 pb-16">
        {exercises?.map((exercise) => (
          <div
            key={exercise.idExercise}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={`data:image/jpeg;base64,${exercise.imageBase64}`}
              alt={exercise.nameExercise}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{exercise.nameExercise}</h2>
              <p className="text-gray-600 text-sm mb-4">{exercise.descriptionExercise}</p>
              <div className="text-sm text-gray-500 mb-2">
                <p>Series: {exercise.numberOfSeries}</p>
                <p>Repeticiones: {exercise.numberOfRepetitions}</p>
                <p>Peso reducido: {exercise.kilosWeightReduced} kg</p>
                <p>Grupo muscular: {exercise.muscleGroupName}</p>
              </div>
              <a
                href={exercise.exerciseVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm block mb-4"
              >
                Ver video del ejercicio
              </a>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditExercise(exercise)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(exercise.idExercise, exercise.nameExercise)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCards;
