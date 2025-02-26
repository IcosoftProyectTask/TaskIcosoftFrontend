import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UpdateBodyMeasurement } from "../../service/BodyMeasurement";
import { getUserClientName } from "../../service/UserClient";
import { getTagImc } from "../../service/TagImc";

const ActualizarBodyMeasurement = ({ show, handleClose, bodyMeasurement }) => {
  const [formData, setFormData] = useState({
    idUser: "",
    idTagImc: "",
    height: "",
    weight: "",
    waistMeasurement: "",
    fatPercentajeMuscle: "",
    bodyWaterPercentaje: "",
    fatPercentajeBody: "",
    dateMeasurements: "",
  });

  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  const queryClient = useQueryClient();

  // Configuración del hook useMutation
  const { mutate: updateBodyMeasurementMutate } = useMutation({
    mutationFn: ({ id, values }) => UpdateBodyMeasurement({ id, values }),
    onError: () => {
      toast.error("Error al actualizar la medición corporal.");
    },
    onSuccess: (data) => {
      console.log("Respuesta del servidor:", data);
      toast.success("Medición corporal actualizada correctamente.");
      queryClient.invalidateQueries(["getBodyMeasurement"]);
      
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userNames = await getUserClientName();
        setUsers(userNames || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTags = async () => {
      try {
        const tagNames = await getTagImc();
        setTags(tagNames || []);
      } catch (error) {
        console.error("Error al obtener tags IMC:", error);
        setTags([]);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchUsers();
    fetchTags();
  }, []);

  useEffect(() => {
    if (bodyMeasurement) {
      setFormData({
        idUser: bodyMeasurement.idUser || "",
        idTagImc: bodyMeasurement.idTagImc || "",
        height: bodyMeasurement.height || "",
        weight: bodyMeasurement.weight || "",
        waistMeasurement: bodyMeasurement.waistMeasurement || "",
        fatPercentajeMuscle: bodyMeasurement.fatPercentajeMuscle || "",
        bodyWaterPercentaje: bodyMeasurement.bodyWaterPercentaje || "",
        fatPercentajeBody: bodyMeasurement.fatPercentajeBody || "",
        dateMeasurements: bodyMeasurement.dateMeasurements
          ? new Date(bodyMeasurement.dateMeasurements).toISOString().split("T")[0]
          : "",
      });
    }
  }, [bodyMeasurement]);

  const handleSubmit = () => {
    if (!formData.height.includes(".")) {
      toast.error("La altura debe incluir un punto (ejemplo: 1.65).");
      return;
    }

    if (!formData.idUser || !formData.idTagImc) {
      toast.error("Usuario y Tag IMC son obligatorios.");
      return;
    }

    if (!bodyMeasurement || !bodyMeasurement.idBodyMeasurement) {
      toast.error("Error: El ID de la medición corporal es inválido.");
      return;
    }

    const bodyMeasurementData = {
      idUser: parseInt(formData.idUser, 10),
      idTagImc: parseInt(formData.idTagImc, 10),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      waistMeasurement: parseFloat(formData.waistMeasurement),
      fatPercentajeMuscle: parseFloat(formData.fatPercentajeMuscle),
      bodyWaterPercentaje: parseFloat(formData.bodyWaterPercentaje),
      fatPercentajeBody: parseFloat(formData.fatPercentajeBody),
      dateMeasurements: formData.dateMeasurements,
    };

    // Llamar a la función mutate
    updateBodyMeasurementMutate({
      id: bodyMeasurement.idBodyMeasurement,
      values: bodyMeasurementData,
    });
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
          <h2 className="text-lg font-semibold text-gray-800">Actualizar Medición Corporal</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
          <form>
            <div>
              <label htmlFor="idUser" className="block text-sm font-medium text-gray-700">Usuario</label>
              <select
                id="idUser"
                name="idUser"
                value={formData.idUser}
                onChange={handleChange}
                disabled={loadingUsers}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un usuario</option>
                {loadingUsers ? (
                  <option value="">Cargando usuarios...</option>
                ) : (
                  users.map((user) => (
                    <option key={user.idUser} value={user.idUser}>
                      {`${user.name} ${user.firstSurname}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="idTagImc" className="block text-sm font-medium text-gray-700">Tag IMC</label>
              <select
                id="idTagImc"
                name="idTagImc"
                value={formData.idTagImc}
                onChange={handleChange}
                disabled={loadingTags}
                className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un Tag IMC</option>
                {loadingTags ? (
                  <option value="">Cargando tags...</option>
                ) : (
                  tags.map((tag) => (
                    <option key={tag.idTagImc} value={tag.idTagImc}>{tag.nameTagImc}</option>
                  ))
                )}
              </select>
            </div>

            {[
              { id: "height", label: "Altura (cm)" },
              { id: "weight", label: "Peso (kg)" },
              { id: "waistMeasurement", label: "Medida de Cintura (cm)" },
              { id: "fatPercentajeMuscle", label: "% Grasa en Músculo" },
              { id: "bodyWaterPercentaje", label: "% Agua en el Cuerpo" },
              { id: "fatPercentajeBody", label: "% Grasa Corporal" },
              { id: "dateMeasurements", label: "Fecha de Medición", type: "date" },
            ].map(({ id, label, type = "text" }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
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
            disabled={loadingUsers || loadingTags}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loadingUsers || loadingTags ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActualizarBodyMeasurement;
