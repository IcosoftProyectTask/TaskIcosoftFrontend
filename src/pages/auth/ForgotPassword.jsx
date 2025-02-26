import { toast } from "react-toastify";
import Container from "../../components/form/Container";
import InputForm from "../../components/form/InputForm";
import LinkForm from "../../components/form/LinkForm";

import { useFormik } from "formik";
import * as Yup from "yup";
import * as Exp from "../../assets/js/RegularExpressions";
import { OlvidoPassword } from "../../service/UserAPI";

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es requerido")
        .matches(Exp.emailRegex, "El email no es válido"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await OlvidoPassword(values.email);
        if (response && response.success) {
          toast.success("Se ha enviado un correo para restablecer la contraseña");
        } else {
          setErrors({ email: response.error || "No se pudo enviar el correo. Inténtelo de nuevo." });
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setErrors({ email: "Ocurrió un error. Inténtelo más tarde." });
        toast.error("Ocurrió un error. Inténtelo más tarde.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container text={"¿Olvidaste tú contraseña?"} password={true}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Enviando..." : "Restablecer contraseña"}
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
