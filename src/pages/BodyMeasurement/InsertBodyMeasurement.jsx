import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserClient } from "../../service/UserClient.js";
import { getTagImc } from "../../service/TagImc.js";
import { insertBodyMeasurement } from "../../service/BodyMeasurement.js";

const InsertBodyMeasurement = ({ show, handleClose }) => {
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userNames = await getUserClient();
        setUsers(userNames.map(user => ({ value: user.idUser, label: `${user.name} ${user.firstSurname}` })) || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        toast.error("No se pudieron cargar los usuarios.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchTags = async () => {
      try {
        const tagNames = await getTagImc();
        setTags(tagNames.map(tag => ({ value: tag.idTagImc, label: tag.nameTagImc })) || []);
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

  const { mutate: insertMeasurement, isLoading } = useMutation({
    mutationFn: insertBodyMeasurement,
    onSuccess: () => {
      toast.success("Medición corporal registrada correctamente.", { autoClose: 1500 });
      queryClient.invalidateQueries(["getBodyMeasurement"]);
      handleClose();
      setFormData({
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
    },
    onError: (error) => {
      console.error("Error al registrar la medición corporal:", error);
      toast.error("Error al registrar la medición corporal.");
    },
  });

  const handleSubmit = () => {
    if (!formData.height.includes(".")) {
      toast.error("La altura debe incluir un punto (ejemplo: 1.65).");
      return;
    }

    if (!formData.idUser || !formData.idTagImc) {
      toast.error("Usuario y Tag IMC son obligatorios.");
      return;
    }
    
    insertMeasurement(formData);
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-800">Registrar Medición Corporal</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">✖</button>
        </div>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[400px]">
          <form>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuario</label>
              <Select
                options={users}
                isLoading={loadingUsers}
                onChange={(option) => handleSelectChange(option, "idUser")}
                placeholder="Selecciona un usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tag IMC</label>
              <Select
                options={tags}
                isLoading={loadingTags}
                onChange={(option) => handleSelectChange(option, "idTagImc")}
                placeholder="Selecciona un Tag IMC"
              />
            </div>

            {[{ id: "height", label: "Altura (cm)" }, { id: "weight", label: "Peso (kg)" }, { id: "waistMeasurement", label: "Medida de Cintura (cm)" }, { id: "fatPercentajeMuscle", label: "% Grasa en Músculo" }, { id: "bodyWaterPercentaje", label: "% Agua en el Cuerpo" }, { id: "fatPercentajeBody", label: "% Grasa Corporal" }, { id: "dateMeasurements", label: "Fecha de Medición", type: "date" }].map(({ id, label, type = "text" }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [id]: e.target.value }))}
                  className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </form>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
          <button onClick={handleSubmit} disabled={loadingUsers || loadingTags || isLoading} className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loadingUsers || loadingTags || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default InsertBodyMeasurement;
