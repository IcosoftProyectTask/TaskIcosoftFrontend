import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ¡Importante! Importar los estilos
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, ShieldQuestion } from "lucide-react";
import { getActiveTypes, deleteType } from "../../service/Types";
import TipoCard from "../../pages/ControlPanel/TipoCard";
import TiposList from "../../pages/ControlPanel/TiposList";
import ModalCrearTipo from "../../pages/ControlPanel/ModalCrearTipo";
import ModalSeleccionAccion from "../../pages/ControlPanel/ModalSeleccionAccion";

const tipos = [
  { id: 1, nombre: "TiposLicencias", icono: <Award size={32} />, description: "Gestión de licencias y permisos" },
  { id: 2, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir" },
  { id: 3, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir" },

  // agrega más aquí...
];

const WebAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoActual, setTipoActual] = useState(null);
  const [mostrarExistentes, setMostrarExistentes] = useState(false);
  const [dialogTipo, setDialogTipo] = useState(null);
  const queryClient = useQueryClient();

  const { data: tiposCreados, isLoading } = useQuery({
    queryKey: ["tipos-activos"],
    queryFn: async () => {
      try {
        const response = await getActiveTypes();
        return response.data.map((t) => ({
          idType: t.idType,
          typeName: t.typeName,
          description: t.description || "",
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          status: t.status,
        }));
      } catch (error) {
        // Manejo de error mejorado
        console.error("Error fetching types:", error);
        toast.error("Error al cargar los tipos");
        return [];
      }
    },
  });

  const handleTipoClick = (tipo) => setDialogTipo(tipo);
  
  const handleCrearNuevo = () => {
    setTipoActual(dialogTipo);
    setIsModalOpen(true);
    setDialogTipo(null);
  };
  
  const handleVerExistentes = () => {
    setTipoActual(dialogTipo);
    setMostrarExistentes(true);
    setDialogTipo(null);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTipoActual(null);
  };

  const handleDeleteTipo = async (id) => {
    try {
      await deleteType(id);
      toast.success("Tipo eliminado", { autoClose: 3000 });
      
      // Refresca los datos
      await queryClient.invalidateQueries(["tipos-activos"]);
      
      // Cierra la lista si no quedan tipos después de eliminar
      const nuevos = tiposCreados?.filter((t) => t.idType !== id);
      if (!nuevos || nuevos.length === 0) {
        setMostrarExistentes(false);
        setTipoActual(null);
      }
    } catch (e) {
      console.error("Error deleting type:", e);
      toast.error("Error al eliminar tipo", { autoClose: 4000 });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Panel de Configuración</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Administra los distintos tipos del sistema</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        {tipos.map((tipo) => (
          <TipoCard
          key={tipo.id}
          tipo={tipo}
          onClick={() => handleTipoClick(tipo)}
          disabled={tipo.nombre === "Sin Definir"}
        />        
        ))}
      </div>
      
      {mostrarExistentes && tipoActual && (
        <TiposList
          tipos={tiposCreados || []}
          isLoading={isLoading}
          tipoActual={tipoActual}
          onDelete={handleDeleteTipo}
        />
      )}
      
      {isModalOpen && tipoActual && (
        <ModalCrearTipo tipo={tipoActual} onClose={handleCloseModal} />
      )}
      
      {dialogTipo && (
        <ModalSeleccionAccion
          tipo={dialogTipo}
          onCancel={() => setDialogTipo(null)}
          onCrearNuevo={handleCrearNuevo}
          onVerExistentes={handleVerExistentes}
        />
      )}
    </div>
  );
};

export default WebAdmin;