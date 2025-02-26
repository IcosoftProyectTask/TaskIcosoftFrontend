//Libraries
import { Routes, Route } from "react-router-dom";

//Pages/views
import PrivateRoutes from "./PrivateRoutes.jsx";
import PublicRoutes from "./PublicRoutes.jsx";


export default function AppRouter() {
  let status = "unauthenticated";
  const isAuth = !!sessionStorage.getItem("token");
  status = isAuth ? "authenticated" : "unauthenticated";

  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<PrivateRoutes />} />
      ) : (
        <Route path="/*" element={<PublicRoutes />} />
      )}

    </Routes>
  );
}
