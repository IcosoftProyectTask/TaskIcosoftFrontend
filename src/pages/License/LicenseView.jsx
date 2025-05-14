import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLicenses, getLicenseByCustomerId } from "../../service/licenseApi";
import { ToastError } from "../../assets/js/Toastify";
import { useCompany } from "../../context/CompanyContext";
import LicenseTable from "./LicenseTable";
import LicenseModal from "./LicenseModal";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";

export default function LicenseView() {
  const [licenses, setLicenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const queryClient = useQueryClient();
  const { selectedCompany } = useCompany();

  const queryFn = selectedCompany?.idCompany 
    ? () => getLicenseByCustomerId(selectedCompany.idCompany)
    : getLicenses;

  const { data: apiResponse, isError, error } = useQuery({
    queryKey: selectedCompany?.idCompany 
      ? ["getLicenseByCustomer", selectedCompany.idCompany] 
      : ["getLicenses"],
    queryFn,
    onError: (error) => ToastError(error.message || "Error al obtener licencias"),
  });

  useEffect(() => {
    if (apiResponse?.data) {
      setLicenses(apiResponse.data.map(license => ({
        id: license.idLicense,
        idCustomer: license.idCustomer,
        customer: license.customerName,
        deviceName: license.deviceName,
        licenseNumber: license.licenseNumber,
        idTypeLicense: license.idTypeLicense,
        typeLicenseName: license.typeLicenseName,
        installationDate: license.installationDate,
        status: license.status,
      })));
    } else {
      setLicenses([]);
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
        ? ["getLicenseByCustomer", selectedCompany.idCompany] 
        : ["getLicenses"]
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Gestión de Licencias
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {selectedCompany?.name 
              ? `Mostrando licencias para ${selectedCompany.name}` 
              : "Mostrando todas las licencias"}
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Nueva licencia
        </button>
      </header>

      {isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message || "Ha ocurrido un error al cargar los datos"}</p>
        </div>
      )}

      <LicenseTable 
        data={licenses} 
        onEdit={handleOpenModal} 
        refreshData={refreshData}
        selectedCompanyId={selectedCompany?.idCompany}
      />

      {modalOpen && (
        <LicenseModal
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