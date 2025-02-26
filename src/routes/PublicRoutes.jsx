//Libraries
import { Navigate, Route, Routes } from "react-router-dom";

//Pages/Views
import Login from "../pages/auth/Login";
import CreateAccount from "../pages/auth/CreateAccount";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ActivateAccount from "../pages/auth/ActivateAccount";
import TwoFactor from "../pages/auth/TwoFactor";
import TokenView from "../pages/tokenview/tokenview";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create_account" element={<CreateAccount />} />
      <Route path="/verify-account" element={<TokenView/>} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/Account/ConfirmEmail" element={<ActivateAccount />} />
      <Route path="/two_factor" element={<TwoFactor />} />
      <Route path="*" element={<Navigate to='/' replace />} />
    </Routes>
  );
}
