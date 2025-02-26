import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQr } from '../../service/AsistenciaQr';
import {
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Grid,
} from '@mui/material';

const ObtenerAsistencia = () => {
  const { data: attendances, isLoading, error } = useQuery({
    queryKey: ['attendances'],
    queryFn: getQr,
  });

  const [selectedMonth, setSelectedMonth] = useState('Todo');

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterAttendances = (attendances) => {
    if (selectedMonth === 'Todo') return attendances;

    return attendances.filter((attendance) => {
      const attendanceMonth = new Date(attendance.dateAttendance).getMonth() + 1; // Sumamos 1 porque getMonth() devuelve 0-11
      console.log(`Fecha: ${attendance.dateAttendance}, Mes extraído: ${attendanceMonth}`);
      return attendanceMonth === Number(selectedMonth);
    });
  };

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" align="center" sx={{ marginTop: 4 }}>
        Error al cargar las asistencias
      </Typography>
    );

  const filteredAttendances = filterAttendances(attendances || []);
  console.log("Asistencias filtradas:", filteredAttendances);

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: 'auto' }}>
      {/* Título y Selector de meses */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '3px solid', borderColor: 'primary.main', paddingBottom: 2 }}>
          Asistencias Registradas
        </Typography>
        <FormControl sx={{ minWidth: 200, marginTop: 2 }}>
          <InputLabel>Filtrado por Mes</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange} label="Seleccionar Mes">
            <MenuItem value="Todo">Todo</MenuItem>
            {[...Array(12).keys()].map((month) => (
              <MenuItem key={month + 1} value={month + 1}>
                {new Date(2025, month).toLocaleString('es-ES', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Lista de asistencias */}
      {filteredAttendances.length > 0 ? (
        <Grid container spacing={3}>
          {filteredAttendances.map((attendance) => (
            <Grid item xs={12} sm={6} md={4} key={attendance.idAttendance}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
                <CardContent>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {attendance.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    <strong>Asistencia:</strong>{' '}
                    <Typography component="span" sx={{ color: attendance.checkIn ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                      {attendance.checkIn ? 'Sí' : 'No'}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fecha:</strong> {new Date(attendance.dateAttendance).toLocaleString('es-ES')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
          No hay asistencias registradas en este mes.
        </Typography>
      )}
    </Box>
  );
};

export default ObtenerAsistencia;
