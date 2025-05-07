import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  styled
} from "@mui/material";
// Estilos balanceados con tamaño adecuado y espaciado mínimo
const StyledDialogTitle = styled(DialogTitle)({
  padding: '16px 22px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  fontSize: '1.2rem',
  fontWeight: 600,
  borderBottom: '1px solid #1e293b',
});
const StyledDialogContent = styled(DialogContent)({
  padding: '20px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  '& .MuiFormControl-root': {
    marginBottom: '14px', // Espacio reducido entre grupos de campos
    width: '100%',
    '& .MuiFormLabel-root': {
      position: 'static',
      transform: 'none',
      marginBottom: '2px', // Espacio mínimo entre etiqueta e input
      display: 'block',
      color: '#94a3b8',
      fontSize: '0.925rem', // Tamaño intermedio
      fontWeight: 500,
    },
    '& .MuiInputBase-root': {
      backgroundColor: '#1e293b',
      color: '#ffffff',
      borderRadius: '0.375rem',
      height: '42px', // Altura intermedia
      fontSize: '0.925rem',
      '& input': {
        padding: '8px 12px',
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#334155',
      legend: { display: 'none' }
    },
  },
  // Grid con espacio optimizado
  '& .MuiGrid-container': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    columnGap: '16px',
    rowGap: '8px',
    width: '100%',
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  }
});
const StyledDialogActions = styled(DialogActions)({
  padding: '14px 22px',
  backgroundColor: '#0f172a',
  borderTop: '1px solid #1e293b',
  justifyContent: 'flex-end',
  gap: '12px'
});
// Usamos un nombre distinto para evitar conflictos con atributos HTML
const ActionButton = styled(Button)(({ isPrimary }) => ({
  backgroundColor: isPrimary ? '#60a5fa' : '#1e293b',
  color: '#ffffff',
  borderRadius: '0.375rem',
  padding: '8px 16px',
  minWidth: '110px',
  fontSize: '0.925rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: isPrimary ? '#3b82f6' : '#334155',
  }
}));
export default function DialogBase({ table, row, internalEditComponents, title }) {
  const isCreatingRow = table.getState().creatingRow !== null;
  
  // Obtener los valores actuales del formulario
  const getFormValues = () => {
    // Si estamos en modo edición o creación, buscar los valores del formulario
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
            // Obtener los valores del formulario
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