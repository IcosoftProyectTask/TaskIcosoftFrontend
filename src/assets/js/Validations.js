import { nameRegex, integerRegex, decimalRegex } from './RegularExpressions';

export const validateRequired = (value) => !!value.length;


export const validateUser = (values) => {
  const errors = {};

  if (!validateRequired(values.name)) {
    errors.name = "El nombre es requerido";
  }
  if (!validateRequired(values.firstSurname)) {
    errors.firstSurname = "El primer apellido es requerido";
  }
  if (!validateRequired(values.secondSurname)) {
    errors.secondSurname = "El segundo apellido es requerido";
  }
  if (!validateRequired(values.phoneNumber)) {
    errors.phoneNumber = "El numero es requerido";
  }
  if (!validateRequired(values.email)) {
    errors.email = "El email es requerido";
  }
  return errors;
};



export const validateRemoteData = (values) => {
  const errors = {};

  if (!values.client || values.client.trim().length < 3) {
    errors.client = "El nombre del cliente debe tener al menos 3 caracteres";
  }

  if (!values.deviceName || values.deviceName.trim().length < 3) {
    errors.deviceName = "El nombre del dispositivo debe tener al menos 3 caracteres";
  }

  if (!values.licenseNumber || values.licenseNumber.trim().length < 5) {
    errors.licenseNumber = "El número de licencia debe tener al menos 5 caracteres";
  }

  if (!values.type || values.type.trim().length < 2) {
    errors.type = "El tipo de licencia debe tener al menos 2 caracteres";
  }

  return errors;
};
