// Components
import ContainerLayout from "../../components/form/ContainerLayout";
import InputForm from "../../components/form/InputForm";
import Spinner from "../../components/Spinner";

// Libraries
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { getUserById } from "../../service/UserAPI";
import { useUserContext } from '../../context/UserContext';
// Assets
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";

// API
import { updateProfile } from "../../service/UserAPI";
import { decodeToken } from "../../utils/Utils";
import { Email } from "@mui/icons-material";

export default function Profile() {
  const { setUserInfo, userInfo } = useUserContext();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      ToastError(error.message);
    },
    onSuccess: async (data) => {
      const user = decodeToken();
      try {
        const userData = await getUserById(user);
        console.log(userData);
        setUserInfo({ id: user, name: userData.name, firstSurname: userData.firstSurname, secondSurname: userData.secondSurname, phoneNumber: userData.phoneNumber });
        ToastSuccess(data.message);
      } catch (error) {
        ToastError("Error al obtener la información del usuario");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || "",
      firstSurname: userInfo?.firstSurname || "",
      secondSurname: userInfo?.secondSurname || "",
      phoneNumber: userInfo?.phoneNumber || ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      firstSurname: Yup.string().required("El primer apellido es requerido"),
      secondSurname: Yup.string().required("El segundo apellido es requerido"),
      phoneNumber: Yup.string()
        .matches(/^\d{8}$/, "El número de teléfono debe tener 8 dígitos")
        .required("El número de teléfono es requerido")
    }),
    onSubmit: (values) => {
      const formData = {
        name: values.name,
        firstSurname: values.firstSurname,
        secondSurname: values.secondSurname,
        phoneNumber: values.phoneNumber,
      };
      mutate({ id: userInfo.id, formData });
    },
  });

  return (
    <ContainerLayout text={"¡Mi perfil!"}>
      {isPending && <Spinner open={true} />}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputForm
            fieldType={"text"}
            fieldName={"name"}
            placeholder={"Nombre"}
            labelText={"Nombre"}
            formik={formik}
          />
          <InputForm
            fieldType={"text"}
            fieldName={"firstSurname"}
            placeholder={"Primer apellido"}
            labelText={"Primer apellido"}
            formik={formik}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputForm
            fieldType={"text"}
            fieldName={"secondSurname"}
            placeholder={"Segundo apellido"}
            labelText={"Segundo apellido"}
            formik={formik}
          />
          <InputForm
            fieldType={"text"}
            fieldName={"phoneNumber"}
            placeholder={"Número de teléfono"}
            labelText={"Número de teléfono"}
            formik={formik}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold"
            disabled={isPending}
          >
            Actualizar perfil
          </button>
        </div>
      </form>
    </ContainerLayout>
  );
}