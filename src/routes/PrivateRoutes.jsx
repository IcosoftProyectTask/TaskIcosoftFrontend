//Libraries
import { Navigate, Route, Routes } from "react-router-dom";

//Layout
import Layout from "../layout/Layout";

import Dashboard from "../pages/Dashboard"
import { useUserContext } from "../context/UserContext"; 
import UserClients from "../pages/UserCliente/UserClientView";
import Profile from "../pages/users/Profile";
import TaskDetailView from "../pages/TaskDetail/TaskDetailView";
import ProductivityDashboard from "../pages/TaskDetail/ProductivityDashboard";
import CompaniesManagementView from "../pages/CompaniesManagement/CompaniesManagementView";
import RomoteView from "../pages/RemoteAccess/RomoteView";
import ClienteAccountInfoView from "../pages/ClienteAccountInfo/ClienteAccountInfoView";
import LicenseView from "../pages/License/LicenseView";
import NotAuthorized from "../pages/NotAuthorized/NotAuthorized";
import WebAdmin from "../pages/ControlPanel/WebAdmin";

export default function PrivateRoutes() {
  const { userInfo } = useUserContext(); // Obtener la información del usuario desde el contexto
  const userRole = userInfo.IdRole; //
  console.log(userRole)
  return (
    <Routes>
       <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} index />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/userClient"  element={userRole !== 2 ? <UserClients /> : <Navigate to="/not-authorized" />} />
        <Route path="/task/:id" element={<TaskDetailView />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/webadmin" element={<WebAdmin/>} />
        <Route path="/productivity" element={userRole !== 2 ? <ProductivityDashboard /> : <Navigate to="/not-authorized" />} />
        <Route path="/companies" element={<CompaniesManagementView />} />
        <Route path="/remote" element={<RomoteView />} />
        <Route path="/clienteAccountInfo" element={<ClienteAccountInfoView />} />
        <Route path="/license" element={<LicenseView />} />
      </Route>
      <Route path="*" element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
}
