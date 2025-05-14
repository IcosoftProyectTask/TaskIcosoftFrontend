import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Award, ShieldQuestion, SendToBack } from "lucide-react";
import { useCompany } from "../../context/CompanyContext";
import { getActiveTypes, deleteType } from "../../service/TypesLicense";
import TipoCard from "../../pages/ControlPanel/TipoCard";
import { getCompanies } from "../../service/Companys";
import TiposList from "../../pages/ControlPanel/TiposList";
import ModalCrearTipo from "../../pages/ControlPanel/ModalCrearTipo";
import ModalSeleccionAccion from "../../pages/ControlPanel/ModalSeleccionAccion";
import ModalSeleccionEmpresa from "../../pages/ControlPanel/ModalSeleccionEmpresa";
import { decodeToken } from "../../utils/Utils";
import { getUserById } from "../../service/UserAPI";
import { useNavigate } from "react-router-dom";

const WebAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoActual, setTipoActual] = useState(null);
  const [mostrarExistentes, setMostrarExistentes] = useState(false);
  const [dialogTipo, setDialogTipo] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const queryClient = useQueryClient();
  const { selectedCompany, setSelectedCompany } = useCompany();
  const navigate = useNavigate();

  // Obtener el rol del usuario al montar el componente
  useEffect(() => {
    const user = decodeToken();
    if (user) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(user);
          setUserRole(userData.idRole);
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error al cargar los datos del usuario");
        }
      };
      fetchUserData();
    }
  }, []);


  // Definir los tipos basados en el rol del usuario
  const getTipos = () => [
    { 
      id: 1, 
      nombre: userRole === 2 ? "Tipos Licencias" : "Sin Definir", 
      icono: userRole === 2 ? <Award size={32} /> : <ShieldQuestion size={32} />,
      description: userRole === 2 ? "Gestión de licencias y permisos" : "Sin definir",
      disabled: userRole !== 2
    },
    { 
      id: 2, 
      nombre: "Selección de empresa", 
      icono: <SendToBack size={32} />, 
      description: "Seleccione la empresa por la cual desee filtrar la informacion en todo el sistema",
      disabled: false
    },
    { id: 3, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
    { id: 4, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
    { id: 5, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
    { id: 6, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
    { id: 7, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
    { id: 8, nombre: "Sin Definir", icono: <ShieldQuestion size={32} />, description: "Sin definir", disabled: true },
  ];

  const tipos = getTipos();

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
        console.error("Error fetching types:", error);
        toast.error("Error al cargar los tipos");
        return [];
      }
    },
    enabled: userRole === 2 // Solo hacer la query si el usuario tiene permiso
  });

  const handleCompanySelectionClick = async () => {
    try {
      const response = await getCompanies();
      if (response.success) {
        setCompanies(response.data);
        setIsCompanyModalOpen(true);
      } else {
        toast.error("No se pudieron cargar las empresas");
      }
    } catch (error) {
      toast.error("Error al cargar las empresas");
      console.error("Error fetching companies:", error);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(false);
    toast.success(`Empresa seleccionada: ${company.companyComercialName}`);
  };

  const handleTipoClick = (tipo) => {
    if (tipo.id === 2) {
      handleCompanySelectionClick();
    } else if (!tipo.disabled) {
      setDialogTipo(tipo);
    }
  };

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
      
      await queryClient.invalidateQueries(["tipos-activos"]);
      
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

  if (userRole === null) {
    return <div className="container mx-auto px-4 py-6">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Panel de Configuración</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Administra los distintos tipos del sistema</p>
        </div>
        
        {selectedCompany && (
          <div className="flex items-center bg-white dark:bg-gray-700 shadow-md rounded-full px-4 py-2 border border-gray-200 dark:border-gray-600">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="text-sm">
              <span className="font-medium text-gray-600 dark:text-gray-300">Empresa: </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {selectedCompany.companyComercialName}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        {tipos.map((tipo) => (
          <TipoCard
            key={tipo.id}
            tipo={tipo}
            onClick={() => handleTipoClick(tipo)}
            disabled={tipo.disabled}
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
      
      {isCompanyModalOpen && (
        <ModalSeleccionEmpresa
          companies={companies}
          onSelect={handleSelectCompany}
          onClose={() => setIsCompanyModalOpen(false)}
          selectedCompany={selectedCompany}
        />
      )}
      
      <ToastContainer position="bottom-right" autoClose={5000} />
    </div>
  );
};

export default WebAdmin;