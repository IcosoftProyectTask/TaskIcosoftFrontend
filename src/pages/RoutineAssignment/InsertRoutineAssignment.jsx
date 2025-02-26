import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from 'axios';
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerRoutineAssignment } from "../../service/RoutineAssignment";
import { getUserClientName } from "../../service/UserClient";
import { getRoutinesName } from "../../service/Routines";

const formatDateForBackend = (date) => {
  return date ? `${date}T00:00:00.000Z` : null;
};

const InsertRoutineAssignment = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    idUser: null,
    idRoutine: null,
    startDate: "",
    endDate: "",
  });

  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoutines, setLoadingRoutines] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userNames = await getUserClientName();
        setUsers(userNames.map(user => ({ value: user.idUser, label: user.name })));
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const filteredRoutines = await getRoutinesName();
        setRoutines(filteredRoutines.map(routine => ({ value: routine.idRoutine, label: routine.nameRoutine })));
      } catch (error) {
        console.error("Error al obtener rutinas:", error);
      } finally {
        setLoadingRoutines(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleSubmit = () => {
    if (!formData.idUser || !formData.idRoutine) {
      toast.error("Selecciona un usuario y una rutina.");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentDate = new Date();

    if (startDate < currentDate) {
      toast.error("La fecha de inicio debe ser la actual o una fecha futura.");
      return;
    }

    if (endDate <= startDate) {
      toast.error("La fecha de fin debe ser mayor a la fecha de inicio.");
      return;
    }

    const newFormData = {
      idUser: formData.idUser.value,
      idRoutine: formData.idRoutine.value,
      startDate: formatDateForBackend(formData.startDate),
      endDate: formatDateForBackend(formData.endDate),
    };

    registerRoutineAssignment(newFormData)
      .then(() => {
        toast.success("Asignación registrada correctamente.", { autoClose: 1500 });
        queryClient.invalidateQueries(["getRoutineAssignmentActive"]);
        handleClose();
        setFormData({ idUser: null, idRoutine: null, startDate: "", endDate: "" });
      })
      .catch((error) => {
        console.error("Error al registrar la asignación:", error);
        toast.error("Error inesperado al registrar la asignación.");
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Registrar Asignación de Rutina</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <form className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <Select
              options={users}
              value={formData.idUser}
              onChange={(selectedOption) => setFormData({ ...formData, idUser: selectedOption })}
              isLoading={loadingUsers}
              placeholder="Selecciona un usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rutina</label>
            <Select
              options={routines}
              value={formData.idRoutine}
              onChange={(selectedOption) => setFormData({ ...formData, idRoutine: selectedOption })}
              isLoading={loadingRoutines}
              placeholder="Selecciona una rutina"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
          <button
            onClick={handleSubmit}
            disabled={loadingUsers || loadingRoutines}
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertRoutineAssignment;
