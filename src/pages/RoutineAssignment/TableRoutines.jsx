import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Box, IconButton, Tooltip, Button, Card, CardContent, Typography, Grid, Avatar, Divider } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import InsertRoutineAssignment from "./InsertRoutineAssignment";
import ActualizarRoutineAssignment from "./ActualizarRoutineAssignment";
import { getRoutineAssignmentActive, DeleteRoutineAssignment } from "../../service/RoutineAssignment";
import { getUserClient } from "../../service/UserClient";
import { getRoutines } from "../../service/Routines";
import { ToastSuccess } from "../../assets/js/Toastify";
import { toast } from "react-toastify";

export default function TableRoutines() {
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const queryClient = useQueryClient();

  // Obtener asignaciones
  const {
    data: assignments = [],
    isLoading: loadingAssignments,
    error: assignmentsError,
  } = useQuery({
    queryKey: ["getRoutineAssignmentActive"],
    queryFn: getRoutineAssignmentActive,
  });

  // Obtener usuarios
  const {
    data: users = [],
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["getUserClient"],
    queryFn: getUserClient,
  });

  // Obtener rutinas
  const {
    data: routines = [],
    isLoading: loadingRoutines,
    error: routinesError,
  } = useQuery({
    queryKey: ["getRoutines"],
    queryFn: getRoutines,
  });

  // Mutación para eliminar una asignación
  const { mutate: deleteAssignment } = useMutation({
    mutationFn: DeleteRoutineAssignment,
    onSuccess: () => {
      ToastSuccess("Se ha eliminado la asignación de rutina exitosamente");
      queryClient.invalidateQueries(["getRoutineAssignmentActive"]);
    },
    onError: (error) => {
      toast.error(`Error al eliminar la asignación: ${error.message}`);
    },
  });

  // Función para manejar la eliminación de una asignación
  const handleDelete = (idRoutineAssignment) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAssignment(idRoutineAssignment);
      }
    });
  };

  // Función para manejar la edición de una asignación
  const handleEditClick = (RoutineAssignment) => {
    setSelectedAssignment(RoutineAssignment);
    setShowUpdateModal(true);
  };

  const mappedAssignments = assignments.map((assignment) => {
    const user = users.find((user) => user.idUser === assignment.idUser);
    const routine = assignment.routine;

    const routineDetails = routine ? routine.relationalRoutineInfos.map((info) => ({
      day: info.day.dayName,
      exercise: info.exercise.nameExercise,
      muscleGroup: info.exercise.muscleGroup.nameMuscleGroup,
      numberOfSeries: info.exercise.numberOfSeries,
      numberOfRepetitions: info.exercise.numberOfRepetitions,
      kilosWeightReduced: info.exercise.kilosWeightReduced,
    })) : [];

    return {
      ...assignment,
      name: user ? user.name : "Usuario no encontrado",
      firstSurname: user ? user.firstSurname : "",
      secondSurname: user ? user.secondSurname : "",
      phoneNumber: user ? user.phoneNumber : "N/A",
      age: user ? user.age : "N/A",
      email: user ? user.email : "N/A",
      birthdate: user ? new Date(user.birthdate).toLocaleDateString() : "N/A",
      nameRoutine: routine ? routine.nameRoutine : "Rutina no encontrada",
      descriptionRoutine: routine ? routine.descriptionRoutine : "Descripción no disponible",
      routineDetails,
    };
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        {/* Botón para agregar una nueva asignación */}
        <Tooltip arrow placement="right" title="Agregar Asignación">
        <IconButton
          size="large"
          color="primary" // Cambiado a azul
          onClick={() => setShowInsertModal(true)}
          sx={{
            alignSelf: "flex-end",
            marginBottom: "16px",
            backgroundColor: "#1976d2", // Fondo azul
            color: "#fff", // Texto blanco
            borderRadius: "50%", // Bordes redondeados
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra suave
            transition: "background-color 0.3s, box-shadow 0.3s", // Transición suave
            "&:hover": {
              backgroundColor: "#115293", // Color azul más oscuro al hacer hover
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Sombra más pronunciada al hacer hover
            },
          }}
        >
          <FaPlus />
        </IconButton>
      </Tooltip>

        {/* Mensajes de carga y errores */}
        {loadingAssignments && <Typography>Cargando asignaciones...</Typography>}
        {assignmentsError && <Typography color="error">Error: {assignmentsError.message}</Typography>}
        {loadingUsers && <Typography>Cargando usuarios...</Typography>}
        {usersError && <Typography color="error">Error: {usersError.message}</Typography>}
        {loadingRoutines && <Typography>Cargando rutinas...</Typography>}
        {routinesError && <Typography color="error">Error: {routinesError.message}</Typography>}

        {/* Lista de asignaciones */}
        <Grid container spacing={3}>
          {mappedAssignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.idRoutineAssignment}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  },
                  height: "400px", // Altura fija para todas las cartas
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Contenedor de información con scroll */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto", // Scroll interno para la información
                    padding: "16px",
                    "&::-webkit-scrollbar": {
                      width: "6px", // Ancho de la barra de scroll
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888", // Color de la barra de scroll
                      borderRadius: "3px", // Bordes redondeados
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#555", // Color al hacer hover
                    },
                  }}
                >
                  {/* Avatar y nombre del usuario */}
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                    <Avatar sx={{ bgcolor: "#3f51b5", marginRight: 2 }}>
                      {assignment.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {assignment.name} {assignment.firstSurname} {assignment.secondSurname}
                    </Typography>
                  </Box>

                  <Divider sx={{ marginBottom: 2 }} />

                  {/* Información del usuario */}
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Correo:</strong> {assignment.email}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Teléfono:</strong> {assignment.phoneNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Edad:</strong> {assignment.age}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    <strong>Fecha de nacimiento:</strong> {assignment.birthdate}
                  </Typography>

                  <Divider sx={{ marginBottom: 2 }} />

                  {/* Información de la rutina */}
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Rutina:</strong> {assignment.nameRoutine}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Descripción:</strong> {assignment.descriptionRoutine}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Inicio:</strong> {new Date(assignment.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    <strong>Fin:</strong> {new Date(assignment.endDate).toLocaleDateString()}
                  </Typography>

                  {/* Detalles de los ejercicios */}
                  {assignment.routineDetails.length > 0 ? (
                    assignment.routineDetails.map((detail, index) => (
                      <Box key={index} sx={{ marginBottom: 2 }}>
                        <Typography variant="body2">
                          <strong>Día:</strong> {detail.day}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Ejercicio:</strong> {detail.exercise}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Grupo muscular:</strong> {detail.muscleGroup}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Series:</strong> {detail.numberOfSeries}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Repeticiones:</strong> {detail.numberOfRepetitions}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Peso reducido (kg):</strong> {detail.kilosWeightReduced}
                        </Typography>
                        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ marginBottom: 2 }}>
                      No hay ejercicios relacionado a esa rutina.
                    </Typography>
                  )}
                </Box>

                {/* Contenedor de botones (siempre visible) */}
                <Box
                  sx={{
                    padding: "16px",
                    borderTop: "1px solid #e0e0e0", // Línea divisoria
                    backgroundColor: "#f5f5f5", // Fondo ligeramente diferente
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => handleEditClick(assignment)}
                      startIcon={<EditIcon />}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(assignment.idRoutineAssignment)}
                      startIcon={<DeleteIcon />}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal para insertar nueva asignación */}
      <InsertRoutineAssignment show={showInsertModal} handleClose={() => setShowInsertModal(false)} />

      {/* Modal para actualizar asignación */}
      {selectedAssignment && (
        <ActualizarRoutineAssignment
          show={showUpdateModal}
          handleClose={() => {
            setShowUpdateModal(false);
            setSelectedAssignment(null);
          }}
          RoutineAssignment={selectedAssignment}
        />
      )}
    </>
  );
}