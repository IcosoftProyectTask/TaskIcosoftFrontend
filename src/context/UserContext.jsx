import { createContext, useState, useContext, useEffect } from "react";
import useCrypto from "../hooks/useCrypto";

// 1. Crea el contexto
const UserContext = createContext()

// 2. Provee acceso al contexto 
export function UserProvider ({ children })  {
    // Importa la función de cifrado
    const { encryptData, decryptData } = useCrypto();

    // Obtiene el usuario desde la sesión
    const [userInfo, setUserInfo] = useState(() => {
        const storedUserInfo = sessionStorage.getItem('user');
        return storedUserInfo ? decryptData(storedUserInfo) : { id:'', name: '', firstSurname: '', secondSurname: '', phoneNumber: '', IdRole: '' };
    });

    // Guarda el usuario en la sesión
    useEffect(() => {
        sessionStorage.setItem('user', encryptData(userInfo));
    }, [userInfo, encryptData]);

    return <UserContext.Provider value={{userInfo, setUserInfo}}> {children} </UserContext.Provider>;
}

// 3. Usa el contexto
export function useUserContext () {
    return useContext(UserContext)
}
