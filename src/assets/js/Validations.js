import { nameRegex, integerRegex, decimalRegex } from './RegularExpressions';

export const validateRequired = (value) => !!value.length;

export const validateGroupMuscle = (values) => {
    const errors = {};

    if (!validateRequired(values.nameMuscleGroup)) {
        errors.nameMuscleGroup = "El nombre es requerido";
    }

    if (!validateRequired(values.descriptionMuscleGroup)) {
        errors.descriptionMuscleGroup = "La descripción es requerida";
    } else if (values.descriptionMuscleGroup.length < 10 || values.descriptionMuscleGroup.length > 500) {
        errors.descriptionMuscleGroup = "La descripción debe tener entre 10 y 500 caracteres";
    }
    
    return errors;
};

export const validateExercise = (values) => {
  const errors = {};

  if (!values.nameExercise.trim()) {
    errors.nameExercise = "El nombre es requerido.";
  } else if (!nameRegex.test(values.nameExercise)) {
    errors.nameExercise = "El nombre solo puede contener letras y espacios.";
  }

  if (!values.descriptionExercise.trim()) {
    errors.descriptionExercise = "La descripción es requerida.";
  } else if (values.descriptionExercise.length < 10 || values.descriptionExercise.length > 500) {
    errors.descriptionExercise = "La descripción debe tener entre 10 y 500 caracteres.";
  }

  if (!values.exerciseVideo.trim()) {
    errors.exerciseVideo = "El video es requerido.";
  }

  if (!values.numberOfSeries.trim()) {
    errors.numberOfSeries = "El número de series es requerido.";
  }

  if (!values.kilosWeightReduced.trim()) {
    errors.numberOfRepetitions = "El peso reducido es requerido.";
  }

  if (!values.numberOfRepetitions.trim()) {
    errors.numberOfRepetitions = "El número de repeticiones es requerido.";
  }


  if (!values.idMuscleGroup) {
    errors.idMuscleGroup = "El grupo muscular es requerido.";
  }

  return errors;
};


  export const validateRoutine = (values) => {
    const errors = {};

    if (!validateRequired(values.nameRoutine)) {
        errors.nameRoutine = "El nombre es requerido";
    }

    if (!validateRequired(values.descriptionRoutine)) {
        errors.descriptionRoutine = "La descripción es requerida";
    } else if (values.descriptionRoutine.length < 10 || values.descriptionRoutine.length > 500) {
        errors.descriptionRoutine = "La descripción debe tener entre 10 y 500 caracteres";
    }
    
    return errors;
};

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

export const validateRoutineAssignment = (values) => {
  const errors = {};

  if (!validateRequired(values.idUser)) {
    errors.idUser = "El usuario es requerido";
  }
  if (!validateRequired(values.idRoutine)) {
    errors.idRoutine = "La rutina es requerida";
  }
  if (!validateRequired(values.startDate)) {
    errors.startDate = "La fecha de inicio es requerida";
  }
  if (!validateRequired(values.endDate)) {
    errors.endDate = "La fecha fin es requerida";
  }

  return errors; // Devuelve el objeto de errores
};

export const validateTagImc = (values) => {
  const errors = {};

  if (!validateRequired(values.nameTagImc)) {
      errors.nameTagImc = "El nombre es requerido";
  }

  return errors;
};