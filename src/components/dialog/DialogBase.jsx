import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  styled,
  useTheme,
  useMediaQuery
} from "@mui/material";

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: '16px 22px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff', // Fondo oscuro o claro
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Texto blanco o negro
  fontSize: '1.2rem',
  fontWeight: 600,
  borderBottom: theme.palette.mode === 'dark' ? '1px solid #1e293b' : '1px solid #ccc', // Color del borde
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#f9fafb', // Fondo oscuro o claro
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Texto blanco o negro
  '& .MuiFormControl-root': {
    marginBottom: '14px',
    width: '100%',
    '& .MuiFormLabel-root': {
      position: 'static',
      transform: 'none',
      marginBottom: '2px',
      display: 'block',
      color: theme.palette.mode === 'dark' ? '#94a3b8' : '#6b7280', // Color de las etiquetas
      fontSize: '0.925rem',
      fontWeight: 500,
    },
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff', // Fondo de los inputs
      color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', // Color de texto de los inputs
      borderRadius: '0.375rem',
      height: '42px',
      fontSize: '0.925rem',
      '& input': {
        padding: '8px 12px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode === 'dark' ? '#334155' : '#ccc', // Color del borde del input
      legend: { display: 'none' },
    },
  },
  '& .MuiGrid-container': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: '16px',
    rowGap: '8px',
    width: '100%',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '14px 22px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff', // Fondo de acciones oscuro o claro
  borderTop: theme.palette.mode === 'dark' ? '1px solid #1e293b' : '1px solid #ccc',
  justifyContent: 'flex-end',
  gap: '12px',
}));

const ActionButton = styled(Button)(({ theme, isPrimary }) => ({
  backgroundColor: isPrimary
    ? '#60a5fa' 
    : theme.palette.mode === 'dark' 
    ? '#1e293b'  // Fondo oscuro en modo oscuro
    : '#f3f4f6', // Fondo claro en modo claro
  color: isPrimary ? '#ffffff' : theme.palette.mode === 'dark' ? '#ffffff' : '#1f2937', // Texto blanco en modo oscuro, oscuro en modo claro
  borderRadius: '0.375rem',
  padding: '8px 16px',
  minWidth: '110px',
  fontSize: '0.925rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: isPrimary
      ? '#3b82f6'
      : theme.palette.mode === 'dark'
      ? '#334155' // Color más claro en modo oscuro
      : '#e5e7eb', // Color más oscuro en modo claro
  },
}));


export default function DialogBase({ table, row, internalEditComponents, title }) {
  const theme = useTheme();
  const isCreatingRow = table.getState().creatingRow !== null;

  const getFormValues = () => {
    const formElements = document.querySelectorAll('input, select, textarea');
    const formValues = {};
    
    formElements.forEach(element => {
      if (element.name) {
        formValues[element.name] = element.value;
      }
    });
    
    return formValues;
  };

  return (
    <>
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <StyledDialogContent>
        {internalEditComponents}
      </StyledDialogContent>
      <StyledDialogActions>
        <ActionButton
          onClick={() => isCreatingRow ? table.setCreatingRow(null) : table.setEditingRow(null)}
        >
          Cancelar
        </ActionButton>
        <ActionButton
          isPrimary={true}
          onClick={() => {
            const values = getFormValues();
            if (isCreatingRow) {
              table.options?.onCreatingRowSave?.({ table, values, row });
            } else {
              table.options?.onEditingRowSave?.({ table, values, row });
            }
          }}
        >
          {isCreatingRow ? 'Crear' : 'Guardar'}
        </ActionButton>
      </StyledDialogActions>
    </>
  );
}
