import { useState } from "react";
import Container from "../../components/query/Container";
import MultiSelect from "../../components/profile/MultiSelect";
import SelectLevel from "../../components/level/SelectLevel";

export default function AddQuery() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [perfilesSeleccionados, setPerfilesSeleccionados] = useState([]);

  return (
    <Container title={isEditing ? "Editar consulta" : "Agregar consulta"}>
      <form className="space-y-3">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/2 px-2 mb-3">
            <input
              type="text"
              id="nombre"
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none dark:bg-gray-200 text-black placeholder:text-black"
            />
          </div>
          <div className="w-full sm:w-1/2 px-2 mb-3">
            <select
              id="categoria"
              className="w-full px-3 py-2 border rounded-xl focus:outline-none text-black dark:bg-gray-200 border-gray-300"
            >
              <option value="" style={{ color: "black" }}>
                Seleccione la visualización
              </option>
              <option value="PieChart" style={{ color: "black" }}>
                Gráfico circular
              </option>
              <option value="LineChart" style={{ color: "black" }}>
                Gráfico de área
              </option>
              <option value="AreaChart" style={{ color: "black" }}>
                Gráfico de barras
              </option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <textarea
            rows={6}
            id="consulta"
            placeholder="Consulta"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none dark:bg-gray-200 text-black placeholder:text-black"
          ></textarea>
        </div>

        <div className="mb-3">
          <MultiSelect
            selectedPerfiles={perfilesSeleccionados}
            onSelect={setPerfilesSeleccionados}
          />
        </div>

        <div className="mb-3">
          <SelectLevel
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
        </div>

        <div className="flex flex-wrap -mx-2 mb-3">
          <div className="w-full sm:w-1/2 px-2">
            <button
              type="button"
              className="w-full px-4 py-2 mb-3 sm:mb-0 bg-green-600 text-white rounded-xl hover:bg-green-700"
            >
              Probar Query
            </button>
          </div>
          <div className="w-full sm:w-1/2 px-2">
            <button
              type="button"
              className="w-full px-4 py-2 sm:mb-0 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              {isEditing ? "Actualizar Query" : "Agregar Query"}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          Cancelar
        </button>
      </form>
    </Container>
  );
}
