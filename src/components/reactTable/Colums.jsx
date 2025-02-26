import { useMemo } from "react";
import { Tooltip } from "@mui/material";

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

export const columnsGroupMuscular = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "nameMuscleGroup",
        header: "Nombre Grupo Muscular",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.nameMuscleGroup,
          helperText: validationErrors?.nameMuscleGroup,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nameMuscleGroup: undefined,
            }),
        },
      },
      {
        accessorKey: "descriptionMuscleGroup",
        header: "Descripción Grupo Muscular",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.descriptionMuscleGroup,
          helperText: validationErrors?.descriptionMuscleGroup,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              descriptionMuscleGroup: undefined,
            }),
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};


export const columnsRoutine = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "nameRoutine",
        header: "Nombre Rutina",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.nameRoutine,
          helperText: validationErrors?.nameRoutine,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nameRoutine: undefined,
            }),
        },
      },
      {
        accessorKey: "descriptionRoutine",
        header: "Descripción Rutina",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.descriptionRoutine,
          helperText: validationErrors?.descriptionRoutine,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              descriptionRoutine: undefined,
            }),
        },
      },
      {
        accessorKey: "routineDuration",
        header: "Duración de rutina",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.routineDuration,
          helperText: validationErrors?.routineDuration,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              routineDuration: undefined,
            }),
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

export const columnsTagImc = (validationErrors, setValidationErrors) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "nameTagImc",
        header: "Nombre TagImc",
        filterFn: "startsWith",
        columnFilterModeOptions: filterDefault,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.nameTagImc,
          helperText: validationErrors?.nameTagImc,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nameTagImc: undefined,
            }),
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );

  return columns;
};
