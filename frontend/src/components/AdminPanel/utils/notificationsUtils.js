import { toast } from "react-toastify";

export const showNotification = (message) => {
  toast(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    closeButton: false,
    progress: undefined,
    theme: "dark",
    style: {
      background: "linear-gradient(to right, #1e40af, #3b82f6)",
      color: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
      fontSize: "16px",
      padding: "12px 16px",
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
    },
    bodyStyle: {
      fontFamily: "inherit",
      fontSize: "16px",
      fontWeight: "500",
    },
  });
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => showNotification("Copiado al portapapeles"))
    .catch(() => showNotification("Error al copiar"));
};
