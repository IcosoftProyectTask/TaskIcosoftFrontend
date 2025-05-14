import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClienteAccountInfos, getClienteAccountInfosByCustomerId } from "../../service/clienteAccountInfoApi";
import { ToastError } from "../../assets/js/Toastify";
import { useCompany } from "../../context/CompanyContext";
import ClienteAccountInfoTable from "./ClienteAccountInfoTable";
import ClienteAccountInfoModal from "./ClienteAccountInfoModal";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";

export default function ClienteAccountInfoView() {
  const [accounts, setAccounts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompany();

  const queryFn = selectedCompany?.idCompany 
    ? () => getClienteAccountInfosByCustomerId(selectedCompany.idCompany)
    : getClienteAccountInfos;

  const { data: apiResponse, isError, error } = useQuery({
    queryKey: selectedCompany?.idCompany 
      ? ["getClienteAccountInfosByCustomer", selectedCompany.idCompany] 
      : ["getClienteAccountInfos"],
    queryFn,
    onError: (error) => ToastError(error.message || "Error al obtener cuentas de clientes"),
  });

  useEffect(() => {
    if (apiResponse?.data) {
      setAccounts(apiResponse.data.map(account => ({
        id: account.idClienteAccountInfo,
        idCustomer: account.idCustomer,
        customer: account.customerName || account.customer,
        email: account.email,
        password: account.password,
        appPassword: account.appPassword,
        vin: account.vin,
        date1: account.date1,
        status: account.status,
      })));
    } else {
      setAccounts([]);
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
        ? ["getClienteAccountInfosByCustomer", selectedCompany.idCompany] 
        : ["getClienteAccountInfos"]
    );
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Gestión de Cuentas de Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {selectedCompany?.name 
              ? `Mostrando cuentas para ${selectedCompany.name}` 
              : "Mostrando todas las cuentas"}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva cuenta
        </button>
      </header>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || "Ha ocurrido un error al cargar los datos"}</p>
        </div>
      )}

      <ClienteAccountInfoTable 
        data={accounts} 
        onEdit={handleOpenModal} 
        refreshData={refreshData}
        selectedCompanyId={selectedCompany?.idCompany}
      />

      {modalOpen && (
        <ClienteAccountInfoModal
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