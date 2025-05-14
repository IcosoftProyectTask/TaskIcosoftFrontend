import { useState, useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { DeleteUserClient } from "../../service/UserClient";
import { SweetAlertEliminar } from "../../assets/js/SweetAlert";
import { ToastError, ToastSuccess } from "../../assets/js/Toastify";
import LoadingSpinner from "../../components/Spinner";

export default function UserClientTable({ data = [], onEdit, refreshData }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        firstSurname: true,
        secondSurname: true,
        phoneNumber: true,
        email: true,
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { mutate: deleteMutate } = useMutation({
        mutationFn: DeleteUserClient,
        onMutate: () => setIsDeleting(true),  // Elimina esta línea si ya lo manejas en el componente principal
        onSuccess: () => {
            ToastSuccess("Usuario eliminado con éxito");
            refreshData();
        },
        onError: (err) => ToastError(err?.message || "Error al eliminar el usuario"),
        onSettled: () => setIsDeleting(false),
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

    // Si prefieres esta opción, sustituye tu función handleDelete por:
    const handleDelete = (id, name) => {
    SweetAlertEliminar(
      `¿Estás seguro de que deseas eliminar al usuario ${name}?`,
      () => deleteMutate(id)  // Usamos el deleteMutate pasado por props
    );
};


    const requestSort = (key) => {
        setSortConfig((prevConfig) => {
            const direction = prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
            return { key, direction };
        });
    };

    const filteredData = useMemo(() => {
        let filtered = [...data];

        if (searchTerm.trim()) {
            const lowerFilter = searchTerm.toLowerCase();
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (val) => typeof val === "string" && val.toLowerCase().includes(lowerFilter)
                )
            );
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
    }, [data, searchTerm, sortConfig]);

    const toggleColumn = (columnName) => {
        setVisibleColumns((prev) => ({
            ...prev,
            [columnName]: !prev[columnName],
        }));
    };

    const columns = [
        { id: "name", label: "Nombre", visible: visibleColumns.name },
        { id: "firstSurname", label: "Primer Apellido", visible: visibleColumns.firstSurname },
        { id: "secondSurname", label: "Segundo Apellido", visible: visibleColumns.secondSurname },
        { id: "phoneNumber", label: "Teléfono", visible: visibleColumns.phoneNumber },
        { id: "email", label: "Email", visible: visibleColumns.email },
    ];

    const visibleColumnCount = columns.filter((col) => col.visible).length;

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
                            filteredData.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {visibleColumns.name && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{user.name}</td>
                                    )}
                                    {visibleColumns.firstSurname && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{user.firstSurname}</td>
                                    )}
                                    {visibleColumns.secondSurname && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{user.secondSurname}</td>
                                    )}
                                    {visibleColumns.phoneNumber && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{user.phoneNumber}</td>
                                    )}
                                    {visibleColumns.email && (
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{user.email}</td>
                                    )}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(user)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                                title="Editar"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, `${user.name} ${user.firstSurname}`)}
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
                                    {searchTerm ? "No se encontraron resultados para su búsqueda" : "No hay usuarios disponibles"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
                {filteredData.map(user => (
                    <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                        {visibleColumns.name && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{user.name}</p>
                            </div>
                        )}
                        {visibleColumns.firstSurname && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Primer Apellido</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{user.firstSurname}</p>
                            </div>
                        )}
                        {visibleColumns.secondSurname && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Segundo Apellido</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{user.secondSurname}</p>
                            </div>
                        )}
                        {visibleColumns.phoneNumber && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{user.phoneNumber}</p>
                            </div>
                        )}
                        {visibleColumns.email && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-base font-medium text-gray-900 dark:text-white">{user.email}</p>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(user)}
                                className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(user.id, `${user.name} ${user.firstSurname}`)}
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
                    Mostrando {filteredData.length} de {data.length} usuarios
                </div>
            </div>
        </div>
    );
}