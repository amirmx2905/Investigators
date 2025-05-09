import React, { useState, useRef } from "react";
import axios from "axios";

function JsonImport() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setMessage("Solo se permiten archivos JSON");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/api/import-json/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMessage(response.data.detail || "Datos importados correctamente");
        setMessageType("success");
        console.log("Importación exitosa:", response.data);
      })
      .catch((error) => {
        console.error("Error al importar JSON:", error);
        const errorMsg =
          error.response?.data?.detail ||
          "Error al importar el archivo. Verifica el formato del JSON.";
        setMessage(errorMsg);
        setMessageType("error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-6 text-center">
      <h3 className="text-sm text-blue-300 mb-2">
        ¿Tienes un respaldo? Restaura tus datos
      </h3>
      <div
        className={`border-2 border-dashed rounded-md p-4 transition-colors cursor-pointer
          ${
            isDragging
              ? "border-blue-400 bg-blue-900/20"
              : "border-gray-600 hover:border-blue-500"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={isLoading ? undefined : openFileSelector}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
          accept=".json,application/json"
          disabled={isLoading}
        />

        {isLoading ? (
          <p className="text-sm">Procesando archivo...</p>
        ) : isDragging ? (
          <p className="text-sm">Suelta el archivo JSON aquí...</p>
        ) : (
          <p className="text-sm">
            Arrastra un archivo JSON o haz clic para seleccionarlo
          </p>
        )}
      </div>

      {message && (
        <div
          className={`mt-3 text-sm px-3 py-2 rounded ${
            messageType === "success"
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default JsonImport;
