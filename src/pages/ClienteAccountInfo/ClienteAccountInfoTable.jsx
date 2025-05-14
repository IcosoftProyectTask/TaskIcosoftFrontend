import { useState, useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteClienteAccountInfo } from "../../service/clienteAccountInfoApi";
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import LoadingSpinner from "../../components/Productivity/LoadingSpinner";

export default function ClienteAccountInfoTable({ data, onEdit, refreshData, selectedCompanyId }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "customer", direction: "asc" });
    const [visibleColumns, setVisibleColumns] = useState({
        customer: true,
        email: true,
        password: false,
        appPassword: false,
        vin: true,
        date1: true
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({});
    const dropdownRef = useRef(null);

    const { mutate: deleteMutate } = useMutation({
        mutationFn: deleteClienteAccountInfo,
        onMutate: () => setIsDeleting(true),
        onSuccess: () => {
            ToastSuccess("Cuenta eliminada con éxito");
            refreshData();
        },
        onError: (err) => ToastError(err.message || "Error al eliminar la cuenta"),
        onSettled: () => setIsDeleting(false)
    });

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

    const toggleShowPassword = (id, field) => {
        setShowPasswords(prev => ({
            ...prev,
            [`${id}_${field}`]: !prev[`${id}_${field}`]
        }));
    };

    const handleDelete = (id, customer) => {
        SweetAlertEliminar(
            `¿Eliminar cuenta de ${customer}?`,
            () => deleteMutate(id)
        );
    };

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const filteredData = useMemo(() => {
        let filtered = [...data];

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filtered = filtered.filter(item => {
                return Object.keys(item).some(key => {
                    return item[key] && item[key].toString().toLowerCase().includes(lowercasedFilter);
                });
            });
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (!a[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
                if (!b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;

                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (typeof aValue === "string" && typeof bValue === "string") {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig]);

    const toggleColumn = (columnName) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnName]: !prev[columnName]
        }));
    };

    const columns = [
        { id: "customer", label: "Cliente", visible: visibleColumns.customer },
        { id: "email", label: "Email", visible: visibleColumns.email },
        { id: "password", label: "Contraseña", visible: visibleColumns.password },
        { id: "appPassword", label: "App Password", visible: visibleColumns.appPassword },
        { id: "vin", label: "VIN", visible: visibleColumns.vin },
        { id: "date1", label: "Fecha", visible: visibleColumns.date1 }
    ];

    const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;

    if (isDeleting) return <LoadingSpinner />;

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
                        {filteredData.length > 0 ? (
                            filteredData.map((account) => (
                                <tr
                                    key={account.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {visibleColumns.customer && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{account.customer}</td>
                                    )}
                                    {visibleColumns.email && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{account.email}</td>
                                    )}
                                    {visibleColumns.password && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            <div className="flex items-center">
                                                <span className="font-mono">
                                                    {showPasswords[`${account.id}_password`] ? account.password : '••••••••'}
                                                </span>
                                                <button
                                                    onClick={() => toggleShowPassword(account.id, 'password')}
                                                    className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    title={showPasswords[`${account.id}_password`] ? "Ocultar" : "Mostrar"}
                                                >
                                                    {showPasswords[`${account.id}_password`] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.appPassword && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            <div className="flex items-center">
                                                <span className="font-mono">
                                                    {showPasswords[`${account.id}_appPassword`] ? account.appPassword : '••••••••'}
                                                </span>
                                                <button
                                                    onClick={() => toggleShowPassword(account.id, 'appPassword')}
                                                    className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    title={showPasswords[`${account.id}_appPassword`] ? "Ocultar" : "Mostrar"}
                                                >
                                                    {showPasswords[`${account.id}_appPassword`] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.vin && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{account.vin}</td>
                                    )}
                                    {visibleColumns.date1 && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {new Date(account.date1).toLocaleDateString()}
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(account)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                                title="Editar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(account.id, account.customer)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                                title="Eliminar"
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
                                    {searchTerm ? "No se encontraron resultados para su búsqueda" : "No hay cuentas disponibles"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
                {filteredData.map(account => (
                    <div key={account.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        {visibleColumns.customer && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{account.customer}</p>
                            </div>
                        )}
                        {visibleColumns.email && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{account.email}</p>
                            </div>
                        )}
                        {visibleColumns.password && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Contraseña</p>
                                <div className="flex items-center">
                                    <p className="text-base font-medium text-gray-900 dark:text-white font-mono">
                                        {showPasswords[`${account.id}_password`] ? account.password : '••••••••'}
                                    </p>
                                    <button
                                        onClick={() => toggleShowPassword(account.id, 'password')}
                                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showPasswords[`${account.id}_password`] ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {visibleColumns.appPassword && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">App Password</p>
                                <div className="flex items-center">
                                    <p className="text-base font-medium text-gray-900 dark:text-white font-mono">
                                        {showPasswords[`${account.id}_appPassword`] ? account.appPassword : '••••••••'}
                                    </p>
                                    <button
                                        onClick={() => toggleShowPassword(account.id, 'appPassword')}
                                        className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showPasswords[`${account.id}_appPassword`] ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {visibleColumns.vin && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">VIN</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{account.vin}</p>
                            </div>
                        )}
                        {visibleColumns.date1 && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                    {new Date(account.date1).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(account)}
                                className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(account.id, account.customer)}
                                className="w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Mostrando {filteredData.length} de {data.length} cuentas
                </div>
            </div>
        </div>
    );
}