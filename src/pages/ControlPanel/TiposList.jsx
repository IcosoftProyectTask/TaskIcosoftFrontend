import { Trash2 } from "lucide-react";
import { useState } from "react";

const TiposList = ({ tipos, isLoading, tipoActual, onDelete }) => {
  const [filtro, setFiltro] = useState("");
  const [confirmando, setConfirmando] = useState(null); // tipo a eliminar

  const tiposFiltrados = tipos?.filter((t) =>
    t.typeName.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleConfirmDelete = (tipo) => {
    setConfirmando(tipo);
  };

  const confirmarEliminacion = async () => {
    await onDelete(confirmando.idType);
    setConfirmando(null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        {tipoActual.icono}
        Tipos de {tipoActual.nombre}
      </h2>

      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-6 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Buscar por nombre..."
      />

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      ) : tiposFiltrados.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No se encontraron tipos.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border-b dark:border-gray-600">Nombre</th>
                <th className="px-4 py-3 border-b dark:border-gray-600">Descripción</th>
                <th className="px-4 py-3 border-b dark:border-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tiposFiltrados.map((tipo) => (
                <tr
                  key={tipo.idType}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                    {tipo.typeName}
                  </td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    {tipo.description || "—"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleConfirmDelete(tipo)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmando && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ¿Eliminar tipo <span className="font-bold">{confirmando.typeName}</span>?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setConfirmando(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiposList;
