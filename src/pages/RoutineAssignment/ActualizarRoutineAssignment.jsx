import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { getUserClientName } from "../../service/UserClient"; // Importa la API de usuarios
import { getRoutinesName } from "../../service/Routines"; // Importa la API de rutinas
import { UpdateRoutineAssignment } from "../../service/RoutineAssignment";

const ActualizarRoutineAssignment = ({ show, handleClose, RoutineAssignment }) => {
  const [assignmentData, setAssignmentData] = useState({
    idUser: "",
    idRoutine: "",
    startDate: "",
    endDate: "",
  });

  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoutines, setLoadingRoutines] = useState(true);

  useEffect(() => {
    // Obtener lista de usuarios
    const fetchUsers = async () => {
      try {
        const userNames = await getUserClientName();
        setUsers(userNames || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    // Obtener lista de rutinas
    const fetchRoutines = async () => {
      try {
        const routineNames = await getRoutinesName();
        setRoutines(routineNames || []);
      } catch (error) {
        console.error("Error al obtener rutinas:", error);
        setRoutines([]);
      } finally {
        setLoadingRoutines(false);
      }
    };

    fetchUsers();
    fetchRoutines();
  }, []);

  useEffect(() => {
    if (RoutineAssignment) {
      setAssignmentData({
        idUser: RoutineAssignment.idUser || "",
        idRoutine: RoutineAssignment.idRoutine || "",
        startDate: RoutineAssignment.startDate ? RoutineAssignment.startDate.slice(0, 10) : "",
        endDate: RoutineAssignment.endDate ? RoutineAssignment.endDate.slice(0, 10) : "",
      });
    }
  }, [RoutineAssignment]);

  const handleSave = () => {
    if (!assignmentData.idUser || !assignmentData.idRoutine) {
      toast.error("Usuario y Rutina son obligatorios.");
      return;
    }
  
    const updatedAssignmentData = {
      idUser: parseInt(assignmentData.idUser, 10),
      idRoutine: parseInt(assignmentData.idRoutine, 10),
      startDate: assignmentData.startDate,
      endDate: assignmentData.endDate,
    };
  
    console.log("Datos enviados:", updatedAssignmentData);
  
    // Aquí pasamos el ID y los valores correctos a la API
    UpdateRoutineAssignment({ id: RoutineAssignment.idRoutineAssignment, values: updatedAssignmentData })
      .then((response) => {
        console.log("Respuesta del servidor:", response); // Ver respuesta
        toast.success("Asignación actualizada correctamente.");
        handleClose(); // Cierra el modal
      })
      .catch((error) => {
        console.error("Error al actualizar la asignación:", error); // Ver el error
        toast.error("Error al actualizar la asignación.");
      });
  };
  

  if (!show) return null; // Si `show` es falso, no se muestra el modal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Actualizar Asignación de Rutina</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
          <form>
            {/* Usuario */}
            <div>
              <label htmlFor="idUser" className="block text-sm font-medium text-gray-700">Usuario</label>
              <select
                id="idUser"
                name="idUser"
                value={assignmentData.idUser}
                onChange={(e) => setAssignmentData({ ...assignmentData, idUser: e.target.value })}
                disabled={loadingUsers}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un usuario</option>
                {loadingUsers ? (
                  <option value="">Cargando usuarios...</option>
                ) : (
                  users.map((user) => (
                    <option key={user.idUser} value={user.idUser}>
                     {`${user.name} ${user.firstSurname} ${user.secondSurname}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Rutina */}
            <div>
              <label htmlFor="idRoutine" className="block text-sm font-medium text-gray-700">Rutina</label>
              <select
                id="idRoutine"
                name="idRoutine"
                value={assignmentData.idRoutine}
                onChange={(e) => setAssignmentData({ ...assignmentData, idRoutine: e.target.value })}
                disabled={loadingRoutines}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona una rutina</option>
                {loadingRoutines ? (
                  <option value="">Cargando rutinas...</option>
                ) : (
                  routines.map((routine) => (
                    <option key={routine.idRoutine} value={routine.idRoutine}>
                      {routine.nameRoutine}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Fechas */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={assignmentData.startDate}
                onChange={(e) => setAssignmentData({ ...assignmentData, startDate: e.target.value })}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={assignmentData.endDate}
                onChange={(e) => setAssignmentData({ ...assignmentData, endDate: e.target.value })}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loadingUsers || loadingRoutines}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loadingUsers || loadingRoutines ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarRoutineAssignment;
