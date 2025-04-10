//Libraries
import React, { useState, useEffect, useRef } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { decodeToken } from "../utils/Utils";
import { getUserById } from "../service/UserAPI";
import logo from "../assets/images/logo.png";
import SidebarLinkGroup from "../partials/SidebarLinkGroup";
import { ToastSuccess, ToastError } from "../assets/js/Toastify";

function Sidebar({ sidebarOpen, setSidebarOpen, variant = "default" }) {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // Obtener los datos del usuario
  useEffect(() => {
    const user = decodeToken(); // Obtienes el ID del usuario decodificando el token
    if (user) {
      console.log(user);
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(user); // Haces la llamada para obtener los detalles del usuario
          setUserRole(userData.idRole);
          console.log(userData.idRole);
          // Guardas el role del usuario en el estado
        } catch (error) {
          ToastError("Error al obtener la información del usuario");
        }
      };

      fetchUserData();
    }
  }, []); // Este useEffect se ejecutará solo una vez, al montar el componente
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:!flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
          } ${variant === "v2"
            ? "border-r border-gray-200 dark:border-gray-700/60"
            : "rounded-r-2xl shadow-sm"
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/dashboard" className="block mx-auto">
            <div className="flex flex-col items-center">
              <img
                src={logo}
                alt="Logo"
                width={sidebarExpanded ? 80 : 40}
                height={sidebarExpanded ? 80 : 40}
              />
              {sidebarExpanded && (
                <span className="text-gray-500 dark:text-white font-bold text-xl">
                 
                </span>
              )}
            </div>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-500 dark:text-blue-400 font-semibold pl-3">
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Módulos
              </span>
            </h3>
            <ul className="mt-3">
            <li
            className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("dashboard") &&
              "from-blue-500/[0.12] dark:from-blue-500/[0.24] to-blue-500/[0.04]"
              }`}
          >
            <NavLink
              end
              to="/productivity"
              className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("dashboard")
                  ? ""
                  : "hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <div className="flex items-center">
                <svg
                  className={`shrink-0 fill-current ${pathname === "/productivity" ||
                      pathname.includes("productivity")
                      ? "text-blue-500"
                      : "text-blue-500 dark:text-blue-500"
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                  <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                </svg>
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Dashboard
                </span>
              </div>
            </NavLink>
          </li>

              {/* Task */}
              <li
                className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("musclegroup") &&
                  "from-blue-500/[0.12] dark:from-blue-500/[0.24] to-blue-500/[0.04]"
                  }`}
              >
                <NavLink
                  end
                  to="/dashboard"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("musclegroup")
                      ? ""
                      : "hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 fill-current ${pathname.includes("task")
                          ? "text-blue-500"
                          : "text-blue-500 dark:text-blue-500"
                        }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2c0-1.1-.9-2-2-2s-2 .9-2 2v1H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4V2zm-2 4h4v1h-4V6zm4 11h-4v-4h4v4zm-6-4H8v4h2v-4zm6-6H6v4h12V7z"/>
                    </svg>
                    <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Tareas
                    </span>
                  </div>
                </NavLink>
              </li>
           
          {/* UserClient */}
          {userRole === 2  ? (
            <li
              className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("userClient") &&
                "from-blue-500/[0.12] dark:from-blue-500/[0.24] to-blue-500/[0.04]"
                }`}
            >
              <NavLink
                end
                to="/userClient"
                className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("userClient") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center">
                  <svg
                    className={`shrink-0 fill-current ${pathname.includes("userClient") ? "text-blue-500" : "text-blue-500 dark:text-blue-500"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Usuario
                  </span>
                </div>
              </NavLink>
            </li>
          ) : null}

          <li
            className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-[linear-gradient(135deg,var(--tw-gradient-stops))] ${pathname.includes("obtenerAsistencia") &&
              "from-blue-500/[0.12] dark:from-blue-500/[0.24] to-blue-500/[0.04]"
              }`}
          >
            <NavLink
              end
              to="/obtenerAsistencia"
              className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${pathname.includes("obtenerAsistencia") ? "" : "hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              <div className="flex items-center">
                <svg
                  className={`shrink-0 fill-current ${pathname.includes("obtenerAsistencia") ? "text-blue-500" : "text-blue-500 dark:text-blue-500"
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  Empresas
                </span>
              </div>
            </NavLink>
          </li>

            </ul>
          </div>

        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
