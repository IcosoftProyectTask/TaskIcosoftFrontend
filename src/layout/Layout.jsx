//Libraries
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

//Components layouts
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

//Hook
import useIdleTimer from "use-idle-timer"
import useTokenRefresh from "../hooks/useTokenRefresh";


export default function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleIdle = () => {
    sessionStorage.clear();
    navigate("/"); 
  };

  useIdleTimer(
    600000,                            
    handleIdle,                        
    "Session expirará",
    "Su sesión expirará en 60 segundos si no interactúa con el sistema. Por favor, realice alguna acción para mantenerla activa.", 
    30000,                            
    {                                 
      position: "center",
      icon: "info",
      confirmButtonText: "Aceptar",  
      timer: 0,                    
    }
  );
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer/>
      </div>
    </div>
  );
}
