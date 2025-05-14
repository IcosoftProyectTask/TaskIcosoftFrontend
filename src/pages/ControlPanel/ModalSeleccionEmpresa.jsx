// pages/ControlPanel/ModalSeleccionEmpresa.jsx
import React, { useState, useEffect, useRef } from 'react';

const ModalSeleccionEmpresa = ({ companies, onSelect, onClose, selectedCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(companies);
  const [page, setPage] = useState(1);
  const companiesPerPage = 10;
  const listRef = useRef(null);

  useEffect(() => {
    setFilteredCompanies(
      companies.filter(company =>
        company.companyComercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyFiscalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.idCompany.toString().includes(searchTerm)
    ));
    setPage(1); // Resetear a la primera página al buscar
  }, [searchTerm, companies]);


  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20 && 
          page * companiesPerPage < filteredCompanies.length) {
        setPage(prev => prev + 1);
      }
    }
  };

  const displayedCompanies = filteredCompanies.slice(0, page * companiesPerPage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Seleccionar Empresa
          {selectedCompany && (
            <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
              (Actual: {selectedCompany.companyComercialName})
            </span>
          )}
        </h2>
        
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar empresa..."
            className="w-full p-2 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div 
          ref={listRef}
          onScroll={handleScroll}
          className="space-y-2 max-h-96 overflow-y-auto pr-2"
        >
          {displayedCompanies.length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No se encontraron empresas
            </p>
          ) : (
            displayedCompanies.map((company) => (
              <div
                key={company.idCompany}
                onClick={() => onSelect(company)}
                className={`p-3 border rounded cursor-pointer transition-colors flex justify-between items-center ${
                  selectedCompany?.idCompany === company.idCompany
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {company.companyComercialName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {company.companyFiscalName}
                  </p>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                  ID: {company.idCompany}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {displayedCompanies.length} de {filteredCompanies.length} empresas
          </span>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionEmpresa;