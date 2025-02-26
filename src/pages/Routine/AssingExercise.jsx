import React, { useState } from 'react';
import Select from 'react-select';
import { getRoutines } from "../../service/Routines";
import { insertRelationalRoutine } from "../../service/RelationalRoutineInfo";
import { getMusclegroup } from "../../service/Musclegroup";
import { getExercise } from "../../service/Exercise";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import { useNavigate } from 'react-router-dom'; 

const AssingExercise = () => {
    const navigate = useNavigate();
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [muscleGroups, setMuscleGroups] = useState({
        Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [], Domingo: [],
    });

    const { data: routines, isLoading, isError, error } = useQuery({
        queryKey: ["getRoutines"],
        queryFn: getRoutines,
    });

    const { data: muscleGroup, isLoading: loadingMuscle } = useQuery({
        queryKey: ["getMusclegroup"],
        queryFn: getMusclegroup,
    });

    const { data: exercisesGet, isLoading: loadingExercises } = useQuery({
        queryKey: ["getExercise"],
        queryFn: getExercise,
    });

    const { mutate: insertMutate } = useMutation({
        mutationFn: insertRelationalRoutine,
        onError: () => ToastError("Ocurrió un error al insertar la rutina"),
        onSuccess: (data) => {
            ToastSuccess(data.message);
            navigate('/assignExerciseRoutine');
        },
    });

    const days = [
        { idDay: 1, name: 'Lunes' }, { idDay: 2, name: 'Martes' }, { idDay: 3, name: 'Miércoles' },
        { idDay: 4, name: 'Jueves' }, { idDay: 5, name: 'Viernes' }, { idDay: 6, name: 'Sábado' },
        { idDay: 7, name: 'Domingo' },
    ];
    const groups = muscleGroup || [];
    const exercises = exercisesGet || [];

    const handleRoutineChange = (selectedOption) => {
        setSelectedRoutine(selectedOption);
    };

    const handleDayChange = (e) => {
        const day = e.target.value;
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleMuscleGroupChange = (day, group) => {
        setMuscleGroups((prev) => ({
            ...prev,
            [day]: prev[day].includes(group)
                ? prev[day].filter((g) => g !== group)
                : [...prev[day], group],
        }));
    };

    const handleSubmit = () => {
        if (!selectedRoutine) {
            ToastError("Por favor, selecciona una rutina.");
            return;
        }

        if (selectedDays.length === 0) {
            ToastError("Por favor, selecciona al menos un día.");
            return;
        }

        const dataToSend = selectedDays.flatMap(day => {
            const dayId = days.find(d => d.name === day).idDay;
            return muscleGroups[day].flatMap(group => {
                return exercises
                    .filter(exercise => exercise.idMuscleGroup === group)
                    .map(exercise => ({
                        idRoutine: selectedRoutine.value,
                        idDay: dayId,
                        idExercise: exercise.idExercise,
                        idMuscleGroup: group
                    }));
            });
        });

        insertMutate(dataToSend);
    };

    if (isLoading || loadingMuscle || loadingExercises) {
        return <div>Cargando...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-4">
                <label className="block mb-2">Selecciona una rutina:</label>
                <Select
                    options={routines?.map(routine => ({
                        value: routine.idRoutine,
                        label: routine.nameRoutine,
                    }))}
                    value={selectedRoutine}
                    onChange={handleRoutineChange}
                    placeholder="Selecciona una rutina"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Selecciona los días:</label>
                {days.map((day) => (
                    <label key={day.idDay} className="inline-flex items-center mr-4">
                        <input
                            type="checkbox"
                            value={day.name}
                            onChange={handleDayChange}
                            className="form-checkbox"
                        />
                        <span className="ml-2">{day.name}</span>
                    </label>
                ))}
            </div>

            {selectedDays.map((day) => {
                return (
                    <div key={day} className="mb-6">
                        <h3 className="text-lg font-bold mb-2">{day}</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="mb-4">
                                    <label className="block mb-2">Selecciona grupos musculares:</label>
                                    {groups.map((group) => (
                                        <label key={group.idMuscleGroup} className="inline-flex items-center mr-4">
                                            <input
                                                type="checkbox"
                                                value={group.idMuscleGroup}
                                                onChange={() => handleMuscleGroupChange(day, group.idMuscleGroup)}
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2">{group.nameMuscleGroup}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block mb-2">Selecciona ejercicios:</label>
                                {muscleGroups[day].map((group) => {
                                    const filteredExercises = exercises.filter(exercise => exercise.idMuscleGroup === group);
                                    return (
                                        <div key={group} className="mb-4">
                                            <h4 className="font-semibold">{groups.find(g => g.idMuscleGroup === group)?.nameMuscleGroup}</h4>
                                            {filteredExercises.map((exercise) => (
                                                <label key={exercise.idExercise} className="inline-flex items-center mr-4">
                                                    <input
                                                        type="checkbox"
                                                        value={exercise.idExercise}
                                                        className="form-checkbox"
                                                    />
                                                    <span className="ml-2">{exercise.nameExercise}</span>
                                                </label>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                onClick={handleSubmit}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Enviar
            </button>
        </div>
    );
};

export default AssingExercise;
