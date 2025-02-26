import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserClient } from "../../service/UserClient.js";
import { getSuscriptiongymtype } from "../../service/SuscriptionGymType.js";
import { insertPayments } from "../../service/Payment.js";

const InsertPayment = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    idUser: "",
    totalAmountToPay: "",
    idSuscriptionGymType: "",
  });

  const [users, setUsers] = useState([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userNames = await getUserClient();
        const formattedUsers = userNames.map(user => ({
          value: user.idUser,
          label: `${user.name} ${user.firstSurname}`
        }));
        setUsers(formattedUsers || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        toast.error("No se pudieron cargar los usuarios.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchSubscriptionTypes = async () => {
      try {
        const subscriptionTypesData = await getSuscriptiongymtype();
        setSubscriptionTypes(subscriptionTypesData || []);
      } catch (error) {
        console.error("Error al obtener tipos de suscripción:", error);
        toast.error("No se pudieron cargar los tipos de suscripción.");
      } finally {
        setLoadingSubscriptions(false);
      }
    };

    fetchUsers();
    fetchSubscriptionTypes();
  }, []);

  const { mutate: insertPayment, isLoading } = useMutation({
    mutationFn: insertPayments,
    onSuccess: () => {
      toast.success("Pago registrado correctamente.", { autoClose: 1500 });
      queryClient.invalidateQueries(["getPaymentActive"]);
      handleClose();
      setFormData({
        idUser: "",
        totalAmountToPay: "",
        idSuscriptionGymType: "",
      });
    },
    onError: (error) => {
      console.error("Error al registrar el pago:", error);
      toast.error("Error al registrar el pago.");
    },
  });

  const handleSubmit = () => {
    if (!formData.idUser || !formData.totalAmountToPay || !formData.idSuscriptionGymType) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    insertPayment(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Registrar Pago</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[400px]">
          <form>
            <div>
              <label htmlFor="idUser" className="block text-sm font-medium text-gray-700">Usuario</label>
              <Select
                id="idUser"
                name="idUser"
                options={users}
                value={users.find(user => user.value === formData.idUser) || null}
                onChange={(selectedOption) => setFormData(prev => ({ ...prev, idUser: selectedOption ? selectedOption.value : "" }))}
                isLoading={loadingUsers}
                isDisabled={loadingUsers}
                placeholder="Selecciona un usuario"
                className="w-full mt-1"
              />
            </div>

            <div>
              <label htmlFor="totalAmountToPay" className="block text-sm font-medium text-gray-700">Monto Total a Pagar</label>
              <input
                type="number"
                id="totalAmountToPay"
                name="totalAmountToPay"
                value={formData.totalAmountToPay}
                onChange={handleChange}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="idSuscriptionGymType" className="block text-sm font-medium text-gray-700">Tipo de Suscripción</label>
              <select
                id="idSuscriptionGymType"
                name="idSuscriptionGymType"
                value={formData.idSuscriptionGymType}
                onChange={handleChange}
                disabled={loadingSubscriptions}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un tipo de suscripción</option>
                {loadingSubscriptions ? (
                  <option value="">Cargando tipos de suscripción...</option>
                ) : (
                  subscriptionTypes.map((subscription) => (
                    <option key={subscription.idSuscriptionGymType} value={subscription.idSuscriptionGymType}>
                      {subscription.suscriptionGymTypeName}
                    </option>
                  ))
                )}
              </select>
            </div>
          </form>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loadingUsers || loadingSubscriptions || isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              loadingUsers || loadingSubscriptions || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertPayment;
