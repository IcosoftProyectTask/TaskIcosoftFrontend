import Logo from "../assets/images/logo.png";
import { Backdrop } from "@mui/material";

export default function Spinner({ open }) {
  return (
    <div>
      <Backdrop
        open={open}
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      >
        <div className="flex flex-col justify-center items-center">
          <img src={Logo} alt="spinner" className="animate-rotate-y w-36" />
          <h5 className="text-center text-2xl text-white dark:text-white font-semibold mt-2 animate-bounce">
            Cargando...
          </h5>
        </div>
      </Backdrop>
    </div>
  );
}
