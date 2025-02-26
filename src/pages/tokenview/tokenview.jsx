import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import { ActivatAccount } from "../../service/AuthAPI";
import { useMutation } from '@tanstack/react-query';

// Components
import { ToastSuccess, ToastError } from "../../assets/js/Toastify"; 

const TokenView = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // Mutate 
  const { mutate, isLoading } = useMutation({
    mutationFn: ActivatAccount,
    onSuccess: (data) => {
      ToastSuccess('Cuenta activada correctamente');
      navigate("/");
    },
    onError: () => {
      ToastError('Error al activar la cuenta. Por favor, intente de nuevo.');
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!token) {
      ToastError('El token es requerido');
      return;
    }  
    mutate({ activationCode: token });
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-lg p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Activación de Cuenta
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Por favor, introduzca el token proporcionado para activar su cuenta.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Token de activación
          </label>
          <input
            id="token"
            type="text"
            placeholder="Ingrese su token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-6"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Activando...' : 'Activar Cuenta'}
          </button>
          
        </form>
        
        <div className="mt-6 text-center">
          {/* mensaje adicional  */}
        </div>
      </div>
    </div>
  );
};

export default TokenView;
