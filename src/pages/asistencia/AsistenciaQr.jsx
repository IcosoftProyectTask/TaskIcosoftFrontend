import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useZxing } from 'react-zxing';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { insertQr } from '../../service/AsistenciaQr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoScanner = ({ isScanning, onDecodeResult, onError }) => {
  const { ref } = useZxing({
    onDecodeResult,
    onError,
    paused: !isScanning,
  });

  return (
    <Box sx={{ display: isScanning ? 'flex' : 'none', justifyContent: 'center', marginTop: 3 }}>
      <video ref={ref} style={{ width: '400px', height: '400px', borderRadius: '10px' }} />
    </Box>
  );
};

const AsistenciaQr = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const { mutate: insertAttendance, isLoading: isInserting } = useMutation({
    mutationFn: insertQr,
    onSuccess: () => {
        console.log("Asistencia registrada con éxito");
        toast.success('¡Asistencia registrada correctamente!');
        setTimeout(() => navigate('/obtenerAsistencia'), 2000);
    },
    onError: (error) => {
        console.error("Error en la mutación:", error);
        toast.error(`Error al registrar la asistencia: ${error.message}`);
    },
});


  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const handleDecodeResult = (result) => {
    try {
      const parsedData = JSON.parse(result.getText());
      insertAttendance(parsedData);
    } catch (error) {
      toast.error('Código QR inválido');
    }
    setIsScanning(false);
  };

  const handleError = (error) => {
    console.error(error);
    toast.error('Error al escanear el código QR');
    setIsScanning(false);
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 900, margin: 'auto' }}>
      {/* Sección del botón alineado a la derecha */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: 50,
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
          onClick={handleStartScanning}
          disabled={isInserting}
        >
          Registrar Asistencia
        </Button>
      </Box>

      {/* Sección de la cámara centrada */}
      <VideoScanner isScanning={isScanning} onDecodeResult={handleDecodeResult} onError={handleError} />

      <ToastContainer />
    </Box>
  );
};

export default AsistenciaQr;
