//Components
import Container from "../../components/form/Container";
import InputForm from "../../components/form/InputForm";
import LinkForm from "../../components/form/LinkForm";
import InputFormPassword from "../../components/form/InputFormPassword";
import Spinner from "../../components/Spinner";
import { decodeToken } from "../../utils/Utils";
import { useUserContext } from "../../context/UserContext";

// Libraries
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery  } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

//Assets
import * as Exp from "../../assets/js/RegularExpressions"
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";

//API
import { login } from "../../service/AuthAPI";
import { getUserById } from "../../service/UserAPI";


export default function Login() {
  const { setUserInfo, userInfo } = useUserContext();

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error) => {
      ToastError(error.message)
    },
    onSuccess: async (data) => {
      sessionStorage.setItem("token", data.data.token);
      const user = decodeToken();
      try {
        const userData = await getUserById(user); 

        setUserInfo({id: user, name: userData.name, firstSurname: userData.firstSurname, secondSurname: userData.secondSurname, phoneNumber: userData.phoneNumber, age: userData.age, birthdate: userData.birthdate});
        ToastSuccess(data.message);
        navigate("/dashboard");
      } catch (error) {
        ToastError("Error al obtener la información del usuario");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .email("El email no es válido")
      .required("El email es requerido")
      .matches(Exp.emailRegex, "El email no es válido"),
      password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(16, "La contraseña debe tener al menos 16 caracteres")
      .required("La contraseña es requerida")
      .matches(Exp.passwordRegex, "La contraseña debe tener al menos una mayúscula, una minúscula y un número"),
    }),
    onSubmit: (values) => {
      //Estructura los datos
      const formData = {
        email: values.email,
        password: values.password
      }
      mutate(formData);
    }
  })


  return (  
    <Container text={"¡Bienvenido/a!"}>
      {isPending && <Spinner open={true} />} 
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <InputForm
            fieldType={"email"}
            fieldName={"email"}
            placeholder={"example@gmail.com"}
            labelText={"Correo electrónico"}
            formik={formik}
          />
        </div>
        <div className="mb-4">
          <InputFormPassword
            fieldType={"password"}
            fieldName={"password"}
            placeholder={"Passw@rd"}
            labelText={"Contraseña"}
            formik={formik}
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold"
            disabled={isPending} 
          >
            Iniciar sesión
          </button>
        </div>
      </form>
      <LinkForm
        redirect={"/forgot_password"}
        text={"¿Olvidaste tu contraseña?"}
      />
      <LinkForm
        redirect={"/create_account"}
        text={"¡Crear una cuenta!"}
        className={"mt-2"}
      />
    </Container>
  );
  
}
