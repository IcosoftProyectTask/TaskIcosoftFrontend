//Libraries
import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

// Clave secreta para cifrar y descifrar datos desde .env
const secretKey = "bf356fbe4f6e77ebaff36ec484c0ce61694bcbdad33ecd2654636acb0200f35e"

const useCrypto = () => {
    // Función para cifrar datos
    const encryptData = useCallback((data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    }, [secretKey]);

    // Función para descifrar datos
    const decryptData = useCallback((cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }, [secretKey]);

    return { encryptData, decryptData };
};

export default useCrypto;
