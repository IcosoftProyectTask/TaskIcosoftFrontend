import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRefreshToken } from "../service/TokenAPI";

const useTokenRefresh = (token, setToken) => {
  const { mutate } = useRefreshToken();
  
  useEffect(() => {
    if (!token) return;
 
    const decodedToken = jwtDecode(token); 
    const expirationTime = new Date(decodedToken.exp * 1000).getTime(); 
    const refreshThreshold = 2 * 60 * 1000; 
    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      if (expirationTime - currentTime <= refreshThreshold) {
        mutate({email: decodedToken.email});
      }
    }, 60 * 1000); // Cada 1 minuto

    return () => clearInterval(intervalId);
  }, [token, setToken]);
};

export default useTokenRefresh;
