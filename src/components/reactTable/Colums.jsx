import React, { useMemo, useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { TextField } from "@mui/material";
const limitText = (text) => {
  if (text.length > 30) {
    return (
      <Tooltip arrow placement="top" title={text}>
        <span>{`${text.slice(0, 100)}...`}</span>
      </Tooltip>
    );
  } else {
    return text;
  }
};

const filterDefault = [
  "contains",
  "startsWith",
  "endsWith",
  "equals",
  "notEquals",
  "fuzzy",
];

export const columnsCompany = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "companyFiscalName",
        header: "Nombre Fiscal",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.companyFiscalName,
          helperText: validationErrors?.companyFiscalName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              companyFiscalName: undefined,
            }),
        }),
      },
      {
        accessorKey: "companyComercialName",
        header: "Nombre Comercial",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.companyComercialName,
          helperText: validationErrors?.companyComercialName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              companyComercialName: undefined,
            }),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        }),
      },
      {
        accessorKey: "companyAddress",
        header: "Dirección",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.companyAddress,
          helperText: validationErrors?.companyAddress,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              companyAddress: undefined,
            }),
        }),
      },
      {
        accessorKey: "idCart",
        header: "ID Fiscal",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.idCart,
          helperText: validationErrors?.idCart,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              idCart: undefined,
            }),
        }),
      },
      {
        accessorKey: "companyPhone",
        header: "Teléfono",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.companyPhone,
          helperText: validationErrors?.companyPhone,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              companyPhone: undefined,
            }),
        }),
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};

export const columnsRemote = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "customer",
        header: "Cliente",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.customer,
          helperText: validationErrors?.customer,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              customer: undefined,
            }),
        }),
      },
      {
        accessorKey: "terminal",
        header: "Terminal",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.terminal,
          helperText: validationErrors?.terminal,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              terminal: undefined,
            }),
        }),
      },
      {
        accessorKey: "software",
        header: "Software",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.software,
          helperText: validationErrors?.software,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              software: undefined,
            }),
        }),
      },
      {
        accessorKey: "ipAddress",
        header: "Id de conexión",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.ipAddress,
          helperText: validationErrors?.ipAddress,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ipAddress: undefined,
            }),
        }),
      },
      {
        accessorKey: "user",
        header: "Usuario",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.user,
          helperText: validationErrors?.user,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              user: undefined,
            }),
        }),
      },
      {
        accessorKey: "password",
        header: "Contraseña",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
       
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          // Quitamos el tipo password para que se vea el texto
          // type: "password",
          error: !!validationErrors?.password,
          helperText: validationErrors?.password,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              password: undefined,
            }),
        }),
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};

export const columnsLicense = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "client",
        header: "Cliente",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.client,
          helperText: validationErrors?.client,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              client: undefined,
            }),
        }),
      },
      {
        accessorKey: "deviceName",
        header: "Nombre del Dispositivo",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.deviceName,
          helperText: validationErrors?.deviceName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              deviceName: undefined,
            }),
        }),
      },
      {
        accessorKey: "licenseNumber",
        header: "Número de Licencia",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          error: !!validationErrors?.licenseNumber,
          helperText: validationErrors?.licenseNumber,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              licenseNumber: undefined,
            }),
        }),
      },
      {
        accessorKey: "type",
        header: "Tipo",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.type,
          helperText: validationErrors?.type,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              type: undefined,
            }),
        }),
      },
      {
        accessorKey: "installationDate",
        header: "Fecha de instalación",
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(String(cell.getValue())).toLocaleDateString("es-ES")
            : "-",
        Edit: ({ cell, column, table }) => {
          // Usamos un ref para acceder directamente al input
          const inputRef = React.useRef(null);
          
          // Obtener el valor inicial
          let initialValue = "";
          if (cell.getValue()) {
            try {
              initialValue = new Date(String(cell.getValue())).toISOString().split("T")[0];
            } catch (e) {
              console.error("Error al parsear fecha:", e);
              initialValue = "";
            }
          }
      
          // Función para actualizar el valor al guardar el formulario
          const saveValueToForm = () => {
            if (inputRef.current && inputRef.current.value) {
              const newValue = inputRef.current.value;
              const isoDate = new Date(`${newValue}T12:00:00Z`).toISOString();
              
              // Verificamos si estamos creando o editando
              if (table.getState().creatingRow) {
                // Accedemos directamente al formulario DOM si está disponible
                const form = inputRef.current.closest('form');
                if (form) {
                  // Creamos un campo oculto para asegurar que el valor se envíe
                  let hiddenInput = form.querySelector('input[name="installationDate"]');
                  if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'installationDate';
                    form.appendChild(hiddenInput);
                  }
                  hiddenInput.value = isoDate;
                }
                
                // Intentamos también modificar el objeto values
                try {
                  table.getState().creatingRow.values.installationDate = isoDate;
                } catch (err) {
                  console.error("Error al actualizar creatingRow:", err);
                }
              } else if (table.getState().editingRow) {
                try {
                  table.getState().editingRow.values.installationDate = isoDate;
                } catch (err) {
                  console.error("Error al actualizar editingRow:", err);
                }
              }
              
              // Actualizar también el estado global
              window._selectedDate = isoDate;
            }
          };
      
          // Asegurarnos de que el valor se guarde cuando el formulario se envíe
          React.useEffect(() => {
            // Buscar el formulario y añadir un event listener
            const form = inputRef.current?.closest('form');
            if (form) {
              const submitHandler = () => saveValueToForm();
              form.addEventListener('submit', submitHandler);
              return () => form.removeEventListener('submit', submitHandler);
            }
          }, []);
          
          return (
            <TextField
              type="date"
              label="Fecha de instalación"
              defaultValue={initialValue}
              inputRef={inputRef}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue) {
                  const selectedDate = new Date(`${newValue}T12:00:00Z`);
                  if (!isNaN(selectedDate.getTime())) {
                    const isoDate = selectedDate.toISOString();
                    
                    // Guardar en variable global para acceso posterior
                    window._selectedDate = isoDate;
                    
                    // Actualizar datos en la tabla
                    table.options.meta?.updateData?.(
                      column.id,
                      cell.row.index,
                      isoDate
                    );
                  }
                }
              }}
              error={!!validationErrors?.installationDate}
              helperText={validationErrors?.installationDate}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          );
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );
  return columns;
};

export const columnsClienteAccountInfo = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "client",
        header: "Cliente",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.client,
          helperText: validationErrors?.client,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              client: undefined,
            }),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        }),
      },
      {
        accessorKey: "password",
        header: "Contraseña",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.password,
          helperText: validationErrors?.password,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              password: undefined,
            }),
        }),
      },
      {
        accessorKey: "appPassword",
        header: "Contraseña de Aplicación",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.appPassword,
          helperText: validationErrors?.appPassword,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              appPassword: undefined,
            }),
        }),
      },
      {
        accessorKey: "vin",
        header: "VIN",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          required: true,
          error: !!validationErrors?.vin,
          helperText: validationErrors?.vin,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              vin: undefined,
            }),
        }),
      },
      {
        accessorKey: "date1",
        header: "Fecha",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value ? new Date(value).toLocaleDateString() : '';
        },
        Edit: ({ cell, column, table }) => {
          // Usamos un ref para acceder directamente al input
          const inputRef = React.useRef(null);
          
          // Obtener el valor inicial
          let initialValue = "";
          if (cell.getValue()) {
            try {
              initialValue = new Date(String(cell.getValue())).toISOString().split("T")[0];
            } catch (e) {
              console.error("Error al parsear fecha:", e);
              initialValue = "";
            }
          }
      
          // Función para actualizar el valor al guardar el formulario
          const saveValueToForm = () => {
            if (inputRef.current && inputRef.current.value) {
              const newValue = inputRef.current.value;
              const isoDate = new Date(`${newValue}T12:00:00Z`).toISOString();
              
              // Verificamos si estamos creando o editando
              if (table.getState().creatingRow) {
                // Accedemos directamente al formulario DOM si está disponible
                const form = inputRef.current.closest('form');
                if (form) {
                  // Creamos un campo oculto para asegurar que el valor se envíe
                  let hiddenInput = form.querySelector('input[name="date1"]');
                  if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'date1';
                    form.appendChild(hiddenInput);
                  }
                  hiddenInput.value = isoDate;
                }
                
                // Intentamos también modificar el objeto values
                try {
                  table.getState().creatingRow.values.date1 = isoDate;
                } catch (err) {
                  console.error("Error al actualizar creatingRow:", err);
                }
              } else if (table.getState().editingRow) {
                try {
                  table.getState().editingRow.values.date1 = isoDate;
                } catch (err) {
                  console.error("Error al actualizar editingRow:", err);
                }
              }
              
              // Actualizar también el estado global
              window._selectedDate = isoDate;
            }
          };
      
          // Asegurarnos de que el valor se guarde cuando el formulario se envíe
          React.useEffect(() => {
            // Buscar el formulario y añadir un event listener
            const form = inputRef.current?.closest('form');
            if (form) {
              const submitHandler = () => saveValueToForm();
              form.addEventListener('submit', submitHandler);
              return () => form.removeEventListener('submit', submitHandler);
            }
          }, []);
          
          return (
            <TextField
              type="date"
              label="Fecha"
              defaultValue={initialValue}
              inputRef={inputRef}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue) {
                  const selectedDate = new Date(`${newValue}T12:00:00Z`);
                  if (!isNaN(selectedDate.getTime())) {
                    const isoDate = selectedDate.toISOString();
                    
                    // Guardar en variable global para acceso posterior
                    window._selectedDate = isoDate;
                    
                    // Actualizar datos en la tabla
                    table.options.meta?.updateData?.(
                      column.id,
                      cell.row.index,
                      isoDate
                    );
                  }
                }
              }}
              error={!!validationErrors?.date1}
              helperText={validationErrors?.date1}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          );
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};


export const columnsUserClient = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nombre",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: "firstSurname",
        header: "Primer Apellido",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstSurname,
          helperText: validationErrors?.firstSurname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstSurname: undefined,
            }),
        },
      },
      {
        accessorKey: "secondSurname",
        header: "Segundo apellido",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.secondSurname,
          helperText: validationErrors?.secondSurname,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              secondSurname: undefined,
            }),
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Telefono",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.phoneNumber,
          helperText: validationErrors?.phoneNumber,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              phoneNumber: undefined,
            }),
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};
