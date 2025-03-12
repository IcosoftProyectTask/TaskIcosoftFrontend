// Components
import Container from "../../components/form/Container";
import LinkForm from "../../components/form/LinkForm";
import InputForm from "../../components/form/InputForm";
import InputFormPassword from "../../components/form/InputFormPassword";
import Spinner from "../../components/Spinner";

// Libraries
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Assets
import * as Exp from "../../assets/js/RegularExpressions";
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";

// API
import { register } from "../../service/AuthAPI";

export default function CreateAccount() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onError: (error) => {
      ToastError("Ocurrió un error al registrarse");
    },
    onSuccess: (data) => {
      ToastSuccess(data.message);
      navigate("/verify-account");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      firstSurname: "",
      secondSurname: "",
      phoneNumber: "",
   //   age: "",
      email:"",
      password: "",
      repeatPassword: ""
     // birthdate: ""

    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          Exp.nameRegex,
          "El nombre solo puede contener letras y espacios"
        )
        .required("El nombre es requerida"),
      firstSurname: Yup.string()
        .matches(
          Exp.apellidoRegex,
          "El primer apellido solo puede contener letras y espacios"
        )
        .min(3, "El apellido debe tener al menos 5 caracteres")
        .required("El primer Apellido es requerido"),
      secondSurname: Yup.string()
        .matches(
          Exp.apellidoRegex,
          "El segundo apellido solo puede contener letras y espacios"
        )
        .min(3, "El apellido debe tener al menos 5 caracteres")
        .required("El segundo apellido es requerido"),
      phoneNumber: Yup.string()
        .matches(
          Exp.phoneRegex,
          "Solo puede contener numeros"
        )
        .required("El telefono es requerido"),

      email: Yup.string()
        .email("El email no es válido")
        .required("El email es requerido")
        .matches(Exp.emailRegex, "El email no es válido"),
      password: Yup.string()
        .min(8, "La contraseña debe tener 8 caracteres minimo")
        .max(16, "La contraseña debe tener maximo 16 caracteres")
        .required("La contraseña es requerida")
        .matches(
          Exp.passwordRegex,
          "La contraseña debe tener al menos 2 letras mayúscula, 2 letras minúscula, 2 números y 2 caracteres especiales"
        ),
        repeatPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("La confirmación de contraseña es requerida"),
    }),
    onSubmit: (values) => {
      // Verifica que las contraseñas coincidan
      if (values.password !== values.repeatPassword) {
        ToastError("Las contraseñas no coinciden");
        return;  // Detiene la ejecución si las contraseñas no coinciden
      }
    
      // Convierte la fecha de nacimiento al formato 
    //  const birthdate = new Date(values.birthdate).toISOString();
    
      // Estructura los datos en el formato requerido por la API
      const formData = {
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        phoneNumber: values.phoneNumber,
       // age: values.age,
        email: values.email,
        password: values.password,
        repeatPassword: values.repeatPassword,
      //  birthdate: birthdate, // Usa la fecha convertida
      };
     
      // Llama a mutate
      mutate(formData);
    },
    
    
    
  });

  return (
    <Container text={"¡Crear una cuenta!"}>
      <br></br>
      {isPending && <Spinner open={true} />} 
      <form onSubmit={formik.handleSubmit}> 
        <div className="flex space-x-3 mb-4">
          <div className="flex-1">
          <label htmlFor="nombre" className="text-gray-700">
            Nombre Completo
          </label>
            <InputForm
              fieldType={"text"}
              fieldName={"name"}
              placeholder={"Nombre"}
              formik={formik}
            />
          </div>
          <div className="flex-1">
          <label htmlFor="PrimerApellido" className="text-gray-700">
            Primer Apellido
          </label>
            <InputForm
              fieldType={"text"}
              fieldName={"firstSurname"}
              placeholder={"Primer Apellido"}
              formik={formik}
            />
          </div>
          <div className="flex-1">
          <label htmlFor="SegundoApellido" className="text-gray-700">
            Segundo Apellido
          </label>
            <InputForm
              fieldType={"text"}
              fieldName={"secondSurname"}
              placeholder={"Segundo Apellido"}
              formik={formik}
            />
          </div>
        </div>

        <div className="flex space-x-3 mb-4">

        
        <div className="flex-1">
        <label htmlFor="telefono" className="text-gray-700">
            Telefono
          </label>
            <InputForm
              fieldType={"text"}
              fieldName={"phoneNumber"}
              placeholder={"Telefono"}
              formik={formik}
            />
          </div>
          {/*
          <div className="flex-1">
          <label htmlFor="edad" className="text-gray-700">
            Edad
          </label>
            <InputForm
              fieldType={"text"}
              fieldName={"age"}
              placeholder={"Edad"}
              formik={formik}
            />
          </div>

          <div className="flex-1">
          <label htmlFor="birthdate" className="text-gray-700">
            Fecha de Nacimiento
          </label>
          <InputForm
            fieldType={"date"}
            fieldName={"birthdate"}
            placeholder={"Fecha Nacimiento"}
            formik={formik}
          />
        </div>
        */}

        </div>

        <div className="flex space-x-3 mb-4">
          <div className="flex-1">
            <InputForm
              fieldType={"email"}
              fieldName={"email"}
              placeholder={"Correo electrónico: example@gmail.com"}
              formik={formik}
            />
          </div>
        </div>

        <div className="flex space-x-3 mb-4">
          <div className="flex-1">
            <InputFormPassword
              fieldType={"password"}
              fieldName={"password"}
              placeholder={"Contraseña"}
              formik={formik}
            />
          </div>
          <div className="flex-1">
            <InputFormPassword
              fieldType={"password"}
              fieldName={"repeatPassword"}
              placeholder={"Repetir Contraseña"}
              formik={formik}
            />
          </div>
        </div>

        <div className="mb-4 space-x-3 flex">
          <button
            type="submit"
            className="w-full bg-blue-500 rounded-full text-white p-3 font-semibold"
            disabled={isPending} 
          >
            Registrar Cuenta
          </button>
        </div>
      </form>
      <LinkForm
        redirect={"/"}
        text={"¿Ya tienes una cuenta? ¡Inicia Sesión!"}
      />
    </Container>
  );
}
