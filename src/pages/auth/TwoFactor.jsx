//Components
import Container from "../../components/form/Container";
import InputForm from "../../components/form/InputForm";
import Spinner from "../../components/Spinner";

// Libraries
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

//Assets
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";


//API
import { verify2FA } from "../../service/AuthAPI";

export default function TwoFactor() {


    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: verify2FA,
        onError: (error) => {
            ToastError(error.message);
        },
        onSuccess: (data) => {
            sessionStorage.setItem('token', data.accessToken);
          
            ToastSuccess('¡Sesión iniciada correctamente!');
            navigate("/dashboard");
        },
    });


  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: Yup.object({
      code: Yup.string()
      .required("El código es requerido")
      .min(6, "El código debe tener al menos 6 dígitos")
      .max(6, "El código debe tener 6 dígitos")
    }),
    onSubmit: (values) => {
      //Estructura los datos
      const formData = {
        Email: userInfo.email,
        Token: values.code,
      }

      mutate(formData);
    }
  })


  return (
    <Container text={"Ingresa el código enviado al correo electrónico"}>
    {isPending && <Spinner open={true} />} 
      <p className="mb-4 text-center">
        Entendemos que la seguridad es muy importante. Sólo tienes que
        introducir tu código que fue enviado a tú dirección de correo
        electrónico a continuación ¡Y podrás acceder al sistema!
      </p>
      <form onSubmit={formik.handleSubmit}>
      <div className="mb-4">
          <InputForm
            fieldType={"text"}
            fieldName={"code"}
            labelText={"Código 2FA"}
            formik={formik}
          />
        </div>

      <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600"
          >
            Verificar código
          </button>
        </div>
      </form>
    </Container>
  );
}
