import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// REACT_TOASTIFY
export const notifySucess = (msg) => {
  toast.success(msg);
};

export const notifyError = (msg) => {
  toast.error(msg);
};

export const notifyInfo = (msg) => {
  toast.info(msg);
};
