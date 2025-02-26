// Validación de Correo Electrónico
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Validación de Número Entero EDAD
export const integerRegex = /^(1[89]|[2-9][0-9]|100)$/;

// Validación de Número de Teléfono (Formato Internacional)
export const phoneRegex = /^\d{8}$/;

//validacion de apellidos
export const apellidoRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ]{5,}$/;

// Validación de Nombre (Solo Letras y Espacios)
export const nameRegex = /^[a-zA-ZÁáÉéÍíÓóÚúÑñ\s]+$/;

// La contraseña debe incluir al menos 2 letras minúsculas, 2 letras mayúsculas, 2 números y 2 caracteres especiales permitidos (*, ., @, _).
export const passwordRegex = /^(?=(.*[a-z]){2})(?=(.*[A-Z]){2})(?=(.*\d){2})(?=(.*[*.@_]){2})[a-zA-Z\d*.@_]+$/;

// RegularExpressions.js
export const decimalRegex = /^[0-9]+\.[0-9]+$/; // Regex de ejemplo para números decimales
