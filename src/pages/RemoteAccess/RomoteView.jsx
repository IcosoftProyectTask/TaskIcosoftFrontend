import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRemotes, getRemotesByCustomerId } from "../../service/RemoteApi";
import { ToastError } from "../../assets/js/Toastify";
import { useCompany } from "../../context/CompanyContext";
import RemoteTable from "./RemoteTable";
import RemoteModal from "./RemoteModal";
import LoadingSpinner from "../../components/Spinner";

export default function RemoteView() {
  const [remotes, setRemotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompany();

  const queryFn = selectedCompany?.idCompany 
    ? () => getRemotesByCustomerId(selectedCompany.idCompany)
    : getRemotes;

  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: selectedCompany?.idCompany 
      ? ["getRemotesByCustomer", selectedCompany.idCompany] 
      : ["getRemotes"],
    queryFn,
    onError: (error) => ToastError(error.message || "Error al obtener registros"),
  });

  useEffect(() => {
    if (apiResponse?.data) {
      setRemotes(apiResponse.data.map(r => ({
        id: r.idRemote,
        idCustomer: r.idCustomer,
        customer: r.customerName || r.customer,
        terminal: r.terminal,
        software: r.software,
        ipAddress: r.ipAddress,
        user: r.user,
        password: r.password,
        status: true,
      })));
    } else {
      setRemotes([]);
    }
  }, [apiResponse]);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const refreshData = () => {
    queryClient.invalidateQueries(
      selectedCompany?.idCompany 
        ? ["getRemotesByCustomer", selectedCompany.idCompany] 
        : ["getRemotes"]
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Gestión de Registros Remotos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {selectedCompany?.name 
              ? `Mostrando registros para ${selectedCompany.name}` 
              : "Mostrando todos los registros"}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nuevo registro
        </button>
      </header>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || "Ha ocurrido un error al cargar los datos"}</p>
        </div>
      )}

      <RemoteTable 
        data={remotes} 
        onEdit={handleOpenModal} 
        refreshData={refreshData}
        selectedCompanyId={selectedCompany?.idCompany}
      />

      {modalOpen && (
        <RemoteModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          refreshData={refreshData}
          initialData={editData || {}}
          selectedCompanyId={selectedCompany?.idCompany}
        />
      )}
    </div>
  );
}