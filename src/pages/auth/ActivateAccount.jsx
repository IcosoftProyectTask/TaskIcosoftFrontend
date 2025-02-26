//Components
import Container from "../../components/form/Container";

//Libraries
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastSuccess, ToastError } from "../../assets/js/Toastify";

//API
import { activateAccount } from "../../service/AuthAPI";

export default function ActivateAccount() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const token = searchParams.get("token");

  const { mutate, isPending } = useMutation({
    mutationFn: activateAccount,
    onError: (error) => {
      ToastError(error.message);
    },
    onSuccess: (data) => {
      ToastSuccess(data);
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ user, token });
  };

  return (
    <Container text={"¡Activa tu cuenta!"}>
      <div className="text-center">
        <p className="mb-4">
          Nos preocupamos por tu seguridad, por lo que necesitamos que confirmes
          tu correo electrónico para activar tu cuenta. Solo debes dar click al
          botón 
        </p>
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="w-full bg-blue-500 rounded-full text-white p-3 font-semibold hover:bg-blue-600"
          >
            {isPending ? "Activando..." : "Activar cuenta"}
          </button>
        </form>
      </div>
    </Container>
  );
}
