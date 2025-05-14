import { useState, useEffect, useMemo, useRef } from "react";
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import LoadingSpinner from "../../components/Spinner";

export default function CompaniesTable({ data = [], onEdit, onDelete, isDeleting = false }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "companyFiscalName", direction: "asc" });
    const [visibleColumns, setVisibleColumns] = useState({
        companyFiscalName: true,
        companyComercialName: true,
        email: true,
        companyAddress: true,
        idCart: true,
        companyPhone: true,
        status: true
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [inactivePage, setInactivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showInactive, setShowInactive] = useState(false); // Nuevo estado para controlar visibilidad
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const requestSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
            return { key, direction };
        });
    };

    // Separar datos en activos e inactivos
    const { activeCompanies, inactiveCompanies } = useMemo(() => {
        const active = data.filter(company => company.status);
        const inactive = data.filter(company => !company.status);
        return { activeCompanies: active, inactiveCompanies: inactive };
    }, [data]);

    // Filtrar y ordenar datos
    const filterAndSortData = (companies) => {
        let filtered = [...companies];

        if (searchTerm.trim()) {
            const lowerFilter = searchTerm.toLowerCase();
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (val) => typeof val === "string" && val.toLowerCase().includes(lowerFilter)
            ));
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key] || "";
                const bVal = b[sortConfig.key] || "";
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    };

    const filteredActive = useMemo(() => filterAndSortData(activeCompanies), 
        [activeCompanies, searchTerm, sortConfig]);
    const filteredInactive = useMemo(() => filterAndSortData(inactiveCompanies), 
        [inactiveCompanies, searchTerm, sortConfig]);

    // Lógica de paginación
    const paginate = (array, page, perPage) => {
        const startIndex = (page - 1) * perPage;
        return array.slice(startIndex, startIndex + perPage);
    };

    const paginatedActive = paginate(filteredActive, activePage, itemsPerPage);
    const paginatedInactive = paginate(filteredInactive, inactivePage, itemsPerPage);

    const toggleColumn = (columnName) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnName]: !prev[columnName],
        }));
    };

    const columns = [
        { id: "companyFiscalName", label: "Nombre Fiscal", visible: visibleColumns.companyFiscalName },
        { id: "companyComercialName", label: "Nombre Comercial", visible: visibleColumns.companyComercialName },
        { id: "email", label: "Email", visible: visibleColumns.email },
        { id: "companyAddress", label: "Dirección", visible: visibleColumns.companyAddress },
        { id: "idCart", label: "ID Fiscal", visible: visibleColumns.idCart },
        { id: "companyPhone", label: "Teléfono", visible: visibleColumns.companyPhone },
        { id: "status", label: "Estado", visible: visibleColumns.status },
    ];

    const visibleColumnCount = columns.filter((col) => col.visible).length;

    if (isDeleting) return <LoadingSpinner />;

    const renderTable = (data, isActive = true) => {
        const currentPage = isActive ? activePage : inactivePage;
        const setCurrentPage = isActive ? setActivePage : setInactivePage;
        const totalItems = isActive ? filteredActive.length : filteredInactive.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isActive ? 'Compañías Activas' : 'Compañías Inactivas'} 
                        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                            ({totalItems} registros)
                        </span>
                    </h3>
                    {!isActive && (
                        <button
                            onClick={() => setShowInactive(!showInactive)}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            {showInactive ? 'Ocultar' : 'Mostrar'}
                        </button>
                    )}
                </div>

                {(!isActive && !showInactive) ? null : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                    <tr>
                                        {columns.map(column => column.visible && (
                                            <th
                                                key={column.id}
                                                className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                                onClick={() => requestSort(column.id)}
                                            >
                                                <div className="flex items-center">
                                                    {column.label}
                                                    <span className="ml-1">
                                                        {sortConfig.key === column.id ? (
                                                            sortConfig.direction === "asc" ? "↑" : "↓"
                                                        ) : ""}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((company) => (
                                            <tr
                                                key={company.id}
                                                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                {visibleColumns.companyFiscalName && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.companyFiscalName}</td>
                                                )}
                                                {visibleColumns.companyComercialName && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.companyComercialName}</td>
                                                )}
                                                {visibleColumns.email && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.email}</td>
                                                )}
                                                {visibleColumns.companyAddress && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.companyAddress}</td>
                                                )}
                                                {visibleColumns.idCart && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.idCart}</td>
                                                )}
                                                {visibleColumns.companyPhone && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{company.companyPhone}</td>
                                                )}
                                                {visibleColumns.status && (
                                                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${company.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {company.status ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => onEdit(company)}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                                            title="Editar"
                                                            disabled={isDeleting}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(company.id, company.companyFiscalName || company.companyComercialName)}
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                                            title="Eliminar"
                                                            disabled={isDeleting}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={visibleColumnCount + 1}
                                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                {searchTerm ? "No se encontraron resultados para su búsqueda" : `No hay compañías ${isActive ? 'activas' : 'inactivas'} disponibles`}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {data.length > 0 ? (
                                data.map(company => (
                                    <div key={company.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                                        {visibleColumns.companyFiscalName && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Fiscal</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.companyFiscalName}</p>
                                            </div>
                                        )}
                                        {visibleColumns.companyComercialName && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre Comercial</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.companyComercialName}</p>
                                            </div>
                                        )}
                                        {visibleColumns.email && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.email}</p>
                                            </div>
                                        )}
                                        {visibleColumns.companyAddress && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.companyAddress}</p>
                                            </div>
                                        )}
                                        {visibleColumns.idCart && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">ID Fiscal</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.idCart}</p>
                                            </div>
                                        )}
                                        {visibleColumns.companyPhone && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                                                <p className="text-base font-medium text-gray-900 dark:text-white">{company.companyPhone}</p>
                                            </div>
                                        )}
                                        {visibleColumns.status && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                                                <p className={`px-2 py-1 rounded-full text-xs inline-block ${company.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {company.status ? 'Activo' : 'Inactivo'}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(company)}
                                                className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                                                disabled={isDeleting}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => onDelete(company.id, company.companyFiscalName || company.companyComercialName)}
                                                className="w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                                                disabled={isDeleting}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    {searchTerm ? "No se encontraron resultados para su búsqueda" : `No hay compañías ${isActive ? 'activas' : 'inactivas'} disponibles`}
                                </div>
                            )}
                        </div>

                        {totalItems > 0 && (
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} compañías
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1); // Reset to first page when changing items per page
                                        }}
                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
                                    >
                                        <option value="5">5 por página</option>
                                        <option value="10">10 por página</option>
                                        <option value="20">20 por página</option>
                                        <option value="50">50 por página</option>
                                    </select>
                                    
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 disabled:opacity-50"
                                        >
                                            &lt;
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded border ${currentPage === pageNum ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 disabled:opacity-50"
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        Columnas
                    </button>

                    {dropdownOpen && (
                        <div className="fixed mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 max-h-[70vh] overflow-y-auto"
                            style={{
                                top: `${dropdownRef.current?.getBoundingClientRect().bottom + window.scrollY + 8}px`,
                                left: `${dropdownRef.current?.getBoundingClientRect().right + window.scrollX - 224}px`
                            }}
                        >
                            <div className="p-2">
                                {columns.map(column => (
                                    <div key={column.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                                        <input
                                            type="checkbox"
                                            id={`column-${column.id}`}
                                            checked={visibleColumns[column.id]}
                                            onChange={() => toggleColumn(column.id)}
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor={`column-${column.id}`}
                                            className="ml-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                                        >
                                            {column.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {renderTable(paginatedActive, true)}
            {filteredInactive.length > 0 && renderTable(paginatedInactive, false)}
        </div>
    );
}