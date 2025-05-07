import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ExcelUploader = ({ onDataProcessed, isLoading }) => {
  const [fileName, setFileName] = useState('');

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Datos extraídos del Excel:', jsonData);
        onDataProcessed(jsonData);
      } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        alert('Error al procesar el archivo Excel. Verifique que el formato sea correcto.');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      processExcelFile(file);
    }
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 transition-colors duration-200">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">Importar desde Excel</h3>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-file-input"
          disabled={isLoading}
        />
        <label 
          htmlFor="excel-file-input" 
          className={`cursor-pointer flex items-center py-2 px-4 rounded transition-colors duration-200 ${
            isLoading 
              ? 'bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
          }`}
        >
          <CloudUploadIcon className="mr-2" />
          Seleccionar archivo
        </label>
        {fileName && (
          <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm transition-colors duration-200">
            Archivo seleccionado: {fileName}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-200">
        Formato esperado: El archivo debe contener columnas para customer, terminal, software, ipAddress, user, password, contact y phone.
      </p>
    </div>
  );
};

export default ExcelUploader;