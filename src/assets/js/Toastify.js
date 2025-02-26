import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const currentTheme = localStorage.getItem("theme");

export const ToastSuccess = (message) => {
  toast.success(message, {
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: currentTheme || "light",
  });
};

export const ToastError = (message) => {
  toast.error(message, {
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: currentTheme || "light",
  });
};

export const ToastWarning = (message) => {
  toast.warning(message, {
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: currentTheme || "light",
  });
};

export const ToastInfo = (message) => {
  toast.info(message, {
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: currentTheme || "light",
  });
};