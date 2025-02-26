import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, IconButton, Tooltip, Button, Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import InsertBodyMeasurement from "./InsertBodyMeasurement";
import ActualizarBodyMeasurement from "./ActualizarBodyMeasurement";
import { getBodyMeasurement, DeleteBodyMeasurement } from "../../service/BodyMeasurement";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

export default function TableBodyMeasurements() {
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);

  const queryClient = useQueryClient();

  const { data: measurements = [], isLoading, error } = useQuery({
    queryKey: ["getBodyMeasurement"],
    queryFn: getBodyMeasurement,
  });

  const { mutate: deleteMeasurement } = useMutation({
    mutationFn: DeleteBodyMeasurement,
    onSuccess: () => {
      ToastSuccess("Se ha eliminado la medición corporal exitosamente");
      queryClient.invalidateQueries(["getBodyMeasurement"]);
    },
    onError: (err) => {
      ToastError(`Error al eliminar la medición: ${err.message}`);
    },
  });

  const handleDelete = (idBodyMeasurement) => {
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
        deleteMeasurement(idBodyMeasurement);
      }
    });
  };

  const handleEditClick = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowUpdateModal(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Tooltip arrow placement="right" title="Agregar Medición Corporal">
        <IconButton
          size="large"
          color="primary"
          onClick={() => setShowInsertModal(true)}
          sx={{ alignSelf: "flex-end", marginBottom: "24px", backgroundColor: "#1976d2", color: "#fff" }}
        >
          <FaPlus />
        </IconButton>
      </Tooltip>

      {isLoading && <Typography>Cargando mediciones...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}

      <Grid container spacing={3}>
        {measurements.map((measurement) => (
          <Grid item xs={12} sm={6} md={4} key={measurement.idBodyMeasurement}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "16px", color: "#1976d2" }}>
                    {measurement.userName || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Tag IMC:</strong> {measurement.nameTagImc || "N/A"}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Altura:</strong> {measurement.height || "N/A"} cm
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Peso:</strong> {measurement.weight || "N/A"} kg
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Cintura:</strong> {measurement.waistMeasurement || "N/A"} cm
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Porcentaje de Grasa/Músculo:</strong> {measurement.fatPercentajeMuscle || "N/A"}%
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Porcentaje de Agua Corporal:</strong> {measurement.bodyWaterPercentaje || "N/A"}%
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Porcentaje de Grasa Corporal:</strong> {measurement.fatPercentajeBody || "N/A"}%
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "8px", color: "#555" }}>
                    <strong>Fecha:</strong> {new Date(measurement.dateMeasurements).toLocaleDateString() || "N/A"}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <Button
                    onClick={() => handleEditClick(measurement)}
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(measurement.idBodyMeasurement)}
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <InsertBodyMeasurement show={showInsertModal} handleClose={() => setShowInsertModal(false)} />

      {selectedMeasurement && (
        <ActualizarBodyMeasurement
          show={showUpdateModal}
          handleClose={() => {
            setShowUpdateModal(false);
            setSelectedMeasurement(null);
          }}
          bodyMeasurement={selectedMeasurement}
        />
      )}
    </Box>
  );
}