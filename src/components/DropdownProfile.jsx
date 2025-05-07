import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import { Avatar } from "@mui/material";
import { lightBlue } from '@mui/material/colors';
import { decodeToken } from "../utils/Utils";
import { getUserById } from "../service/UserAPI";
import { useUserContext } from '../context/UserContext';

function DropdownProfile({
  align
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);  // Estado para la imagen del usuario
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const { userInfo } = useUserContext();

  // Fetch user image when component mounts
  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const user = decodeToken(); // Decodificar token para obtener el ID del usuario
        const userData = await getUserById(user); // Obtener datos del usuario por ID
        if (userData.image && userData.image.base64Image) {
          setUserImage(userData.image.base64Image); // Establecer la imagen del usuario
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        {/* Mostrar imagen si está disponible, sino mostrar la inicial */}
        <Avatar
          alt={`${userInfo.name} ${userInfo.firstSurname}`}
          sx={{ width: 35, height: 35 }}
          src={userImage || ""}  // Usamos la imagen si está disponible
          bgcolor={!userImage ? lightBlue[500] : 'transparent'}
        >
          {/* Si no hay imagen, mostrar la inicial del nombre */}
          {!userImage && userInfo.name.charAt(0)}
        </Avatar>

        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {userInfo.name} {userInfo.firstSurname} {userInfo.secondSurname}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{userInfo.name} {userInfo.firstSurname} {userInfo.secondSurname}</div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center py-1 px-3"
                to="/profile"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Perfil
              </Link>
            </li>
            <li>
              <Link
                className="font-medium text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center py-1 px-3"
                to="/"
                onClick={() => {
                  sessionStorage.clear();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Cerrar sesión
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
