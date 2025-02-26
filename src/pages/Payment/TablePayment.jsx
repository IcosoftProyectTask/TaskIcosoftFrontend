import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import InsertPayment from "./InsertPayment";
import ActualizarPayment from "./ActualizarPayment";
import { getPaymentActive, DeletePayments, getPaymentExpired } from "../../service/Payment";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function TablePayment() {
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const queryClient = useQueryClient();

  const { data: activePayments = [], isLoading: isLoadingActive, error: errorActive } = useQuery({
    queryKey: ["getPaymentActive"],
    queryFn: getPaymentActive,
  });

  const { data: expiredPayments = [], isLoading: isLoadingExpired, error: errorExpired } = useQuery({
    queryKey: ["getPaymentExpired"],
    queryFn: getPaymentExpired,
  });

  const { mutate: deletePayment } = useMutation({
    mutationFn: DeletePayments,
    onSuccess: () => {
      ToastSuccess("Se ha eliminado el pago exitosamente");
      queryClient.invalidateQueries(["getPaymentActive"]);
      queryClient.invalidateQueries(["getPaymentExpired"]);
    },
    onError: (err) => {
      ToastError(`Error al eliminar el pago: ${err.message}`);
    },
  });

  const handleDelete = (idPayment) => {
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
        deletePayment(idPayment);
      }
    });
  };

  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setShowUpdateModal(true);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const allPayments = [...activePayments.map(p => ({ ...p, status: "paid" })), 
                       ...expiredPayments.map(p => ({ ...p, status: "pending" }))];

  const filteredPayments = selectedMonth === ""
    ? allPayments
    : allPayments.filter((payment) => {
        const paymentMonth = new Date(payment.paymentDate).getMonth();
        return paymentMonth === selectedMonth;
      });

  if (isLoadingActive || isLoadingExpired) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorActive || errorExpired) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ marginTop: 4 }}>
        Error al cargar los pagos
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "auto" }}>
      {/* Título y Botón de Insertar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            borderBottom: "3px solid",
            borderColor: "primary.main",
            paddingBottom: 2,
          }}
        >
          Pagos Registrados
        </Typography>

        <Tooltip arrow placement="right" title="Agregar Pago">
          <IconButton
            size="large"
            color="primary"
            onClick={() => setShowInsertModal(true)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            <FaPlus />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filtro de Mes */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", marginBottom: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="month-select-label">Selecciona el Mes</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Selecciona el Mes"
          >
            <MenuItem value="">Todo</MenuItem>
            {months.map((month, index) => (
              <MenuItem key={index} value={index}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Lista de Pagos */}
      {filteredPayments.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
          No hay pagos para el mes seleccionado.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredPayments.map((payment) => (
            <Grid item xs={12} key={payment.idPayment}>
              <Paper
                sx={{
                  padding: "16px",
                  marginBottom: "16px",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                  borderLeft: `6px solid ${payment.status === "paid" ? "#1976d2" : "#d32f2f"}`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {`${payment.userName} ${payment.firstSurname}`}
                </Typography>
                <Typography variant="body2">Monto Total: ₡{payment.totalAmountToPay}</Typography>
                <Typography variant="body2">Fecha de Pago: {new Date(payment.paymentDate).toLocaleDateString()}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: payment.status === "paid" ? "#1976d2" : "#d32f2f",
                  }}
                >
                  {payment.status === "paid" ? "Pagado" : "Pendiente"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 2 }}>
                  <Button
                    onClick={() => handleEditClick(payment)}
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none" }}
                  >
                    Procesar Pago
                  </Button>
                  <Button
                    onClick={() => handleDelete(payment.idPayment)}
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "none" }}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modales */}
      <InsertPayment show={showInsertModal} handleClose={() => setShowInsertModal(false)} />
      {selectedPayment && (
        <ActualizarPayment
          show={showUpdateModal}
          handleClose={() => {
            setShowUpdateModal(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}
    </Box>
  );
}
