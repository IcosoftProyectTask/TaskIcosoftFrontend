//Libraries
import { Navigate, Route, Routes } from "react-router-dom";

//Layout
import Layout from "../layout/Layout";

import Dashboard from "../pages/Dashboard"
import Musclegroup from "../pages/MuscleGroup/Musclegroup";
import ExerciseCards from "../pages/Exercise/ExerciseCards";
import Routines from "../pages/Routine/Routines";
import UserClients from "../pages/UserClient/UserClients";
import TableRoutines from "../pages/RoutineAssignment/TableRoutines";
import TagImcPage from "../pages/TagImc/TagImcPage";
import TableBodyMeasurements from "../pages/BodyMeasurement/TableBodyMeasurement";
import AssingExercise from "../pages/Routine/AssingExercise";
import ObtenerAssigExercise from "../pages/Routine/ObtenerAssingExercise";
import TablePayment from "../pages/Payment/TablePayment";
import AsistenciaQr from "../pages/asistencia/AsistenciaQr";
import ObtenerAsistencia from "../pages/asistencia/obtenerAsistencia";
import Profile from "../pages/users/Profile";
import TaskDetailView from "../pages/TaskDetail/TaskDetailView";

export default function PrivateRoutes() {
  return (
    <Routes>
       <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} index />
        <Route path="/musclegroup" element={<Musclegroup/>} />
        <Route path="/exersice" element={<ExerciseCards />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/userClient" element={<UserClients />} />
        <Route path="/routine-asignment" element={<TableRoutines />} />
        <Route path="/tagImc" element={<TagImcPage/>} />
        <Route path="/bodyMeasurement" element={<TableBodyMeasurements/>} />
        <Route path="/assignExercise" element={<AssingExercise/>} />
        <Route path="/assignExerciseRoutine" element={<ObtenerAssigExercise/>} />
        <Route path="/payment" element={<TablePayment/>} />
        <Route path="/asistencia" element={<AsistenciaQr/>} />
        <Route path="/obtenerAsistencia" element={<ObtenerAsistencia/>} />
        <Route path="/task/:id" element={<TaskDetailView />} />
        <Route path="/profile" element={<Profile/>} />
      </Route>
      <Route path="*" element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
}
