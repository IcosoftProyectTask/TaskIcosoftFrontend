import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdatePayments } from "../../service/Payment.js";

const ActualizarPayment = ({ show, handleClose, payment }) => {
  const queryClient = useQueryClient();

  // Configuración del hook useMutation
  const { mutate: updatePaymentMutate, isLoading } = useMutation({
    mutationFn: UpdatePayments,
    onError: (error) => {
      console.error("Error al actualizar el pago:", error);
      toast.error(`Error al actualizar el pago: ${error.message}`);
    },
    onSuccess: (data) => {
      console.log("Pago actualizado correctamente. Respuesta:", data);
      toast.success("Pago actualizado correctamente.");
      queryClient.invalidateQueries(["getPaymentActive"]);
      handleClose();
    },
  });

  const handleConfirm = () => {
    if (!payment || !payment.idPayment) {
      toast.error("Error: El ID del pago es inválido.");
      return;
    }

    // Solo enviamos el ID del pago
    updatePaymentMutate({ paymentId: payment.idPayment, values: {} });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Pagar Factura</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-700">¿Estás seguro de que deseas pagar esta factura?</p>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarPayment;