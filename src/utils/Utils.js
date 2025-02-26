import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfigFile from '@tailwindConfig'
import { jwtDecode } from "jwt-decode";

export const tailwindConfig = () => {
  return resolveConfig(tailwindConfigFile)
}

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) => Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const formatThousands = (value) => Intl.NumberFormat('es-CR', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const processHierarchicalData = (dataConsultas) => {
  if (!dataConsultas || dataConsultas.length === 0) {
    return [];
  }

  const map = new Map();
  const roots = [];

  dataConsultas.forEach(item => {
    map.set(item.id, { ...item, subRows: [] });
  });

  dataConsultas.forEach(item => {
    if (item.padreId === null) {
      roots.push(map.get(item.id));
    } else {
      const parent = map.get(item.padreId);
      if (parent) {
        parent.subRows.push(map.get(item.id));
      } else {
        roots.push(map.get(item.id));
      }
    }
  });

  return roots;
};


export const decodeToken = () => {
  const token = sessionStorage.getItem("token");
  
  if (!token) return null; 

  try {
    const decoded = jwtDecode(token);
    const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return userId; 
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
