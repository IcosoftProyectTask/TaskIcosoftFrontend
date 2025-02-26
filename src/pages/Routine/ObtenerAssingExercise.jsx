import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRelationalRoutine, DeleteRelationalRoutine } from '../../service/RelationalRoutineInfo';
import { ToastError, ToastSuccess } from '../../assets/js/Toastify';
import { FaTrash } from 'react-icons/fa'; // Importar el ícono de basurero
import Swal from 'sweetalert2'; // Importar SweetAlert2

// Estilos CSS personalizados para el scrollbar
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px; /* Ancho del scrollbar */
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1; /* Color de fondo del track */
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888; /* Color del thumb */
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color del thumb al pasar el mouse */
  }
`;

const ObtenerAssigExercise = () => {
    const queryClient = useQueryClient(); // Para invalidar la caché después de eliminar

    // Obtener los datos de las rutinas
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["getRelationalRoutine"],
        queryFn: getRelationalRoutine,
    });

    // Mutación para eliminar una rutina
    const { mutate: deleteMutate } = useMutation({
        mutationFn: DeleteRelationalRoutine,
        onSuccess: () => {
            ToastSuccess("Rutina eliminada correctamente");
            queryClient.invalidateQueries("getRelationalRoutine"); // Refrescar los datos
        },
        onError: (error) => {
            ToastError(error.message || "Error al eliminar la rutina");
        },
    });

    // Función para manejar la eliminación con SweetAlert2
    const handleDelete = (idRoutine) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutate(idRoutine); // Llamar a la API para eliminar
            }
        });
    };

    // Mostrar un mensaje de carga mientras se obtienen los datos
    if (isLoading) {
        return <div className="text-center py-8 text-blue-600">Cargando...</div>;
    }

    // Mostrar un mensaje de error si ocurre algún problema
    if (isError) {
        ToastError(error.message);
        return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;
    }

    // Renderizar los datos obtenidos en tarjetas
    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Inyectar los estilos CSS personalizados */}
            <style>{styles}</style>

            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Rutinas por Asignar</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((routineData) => (
                    <div key={routineData.routine.idRoutine} className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100 relative h-[500px] flex flex-col">
                        {/* Botón de eliminar */}
                        <button
                            onClick={() => handleDelete(routineData.routine.idRoutine)}
                            className="absolute bottom-4 right-4 p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Eliminar rutina"
                        >
                            <FaTrash className="w-5 h-5" />
                        </button>

                        {/* Contenedor de información con scroll */}
                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                                {routineData.routine.routineName}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {routineData.routine.routineDescription}
                            </p>
                            <div className="space-y-4">
                                {routineData.days.map((dayData) => (
                                    <div key={dayData.day.idDay} className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-bold text-blue-600 mb-2">
                                            {dayData.day.dayName}
                                        </h3>
                                        <ul className="space-y-2">
                                            {dayData.exercises.map((exerciseData) => (
                                                <li key={exerciseData.exercise.idExercise} className="text-gray-700">
                                                    <strong className="text-blue-800">
                                                        {exerciseData.exercise.nameExercise}
                                                    </strong>
                                                    <p className="text-gray-600">{exerciseData.exercise.descriptionExercise}</p>
                                                    <div className="text-sm text-gray-500">
                                                        <span>Series: {exerciseData.exercise.numberOfSeries}</span>
                                                        <span className="mx-2">|</span>
                                                        <span>Repeticiones: {exerciseData.exercise.numberOfRepetitions}</span>
                                                        <span className="mx-2">|</span>
                                                        <span>Peso: {exerciseData.exercise.kilosWeightReduced} kg</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ObtenerAssigExercise;