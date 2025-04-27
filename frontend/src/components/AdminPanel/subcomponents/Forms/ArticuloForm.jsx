import React, { useState, useEffect, useRef } from "react";
import FormModal from "./FormModal";
import api from "../../../../api/apiConfig";
import { articuloService } from "../../../../api/services/articuloService";

function ArticuloForm({ isOpen, onClose, articulo = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_articulo: "",
    nombre_revista: "",
    abstracto: "",
    pais_publicacion: "",
    fecha_publicacion: "",
    doi: "",
    url: "",
    estatus: true,
    estado: "En Proceso",
    investigadores_ids: [],
    ordenes_autores: [],
  });

  // Definimos las opciones de estados
  const ESTADO_OPTIONS = [
    { value: "En Proceso", label: "En Proceso" },
    { value: "Terminado", label: "Terminado" },
    { value: "En Revista", label: "En Revista" },
    { value: "Publicado", label: "Publicado" },
  ];

  const [autoresSeleccionados, setAutoresSeleccionados] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (articulo) {
      console.log("Datos del artículo a editar:", articulo);

      setFormData({
        nombre_articulo: articulo.nombre_articulo || "",
        nombre_revista: articulo.nombre_revista || "",
        abstracto: articulo.abstracto || "",
        pais_publicacion: articulo.pais_publicacion || "",
        fecha_publicacion: articulo.fecha_publicacion
          ? formatDateForInput(articulo.fecha_publicacion)
          : "",
        doi: articulo.doi || "",
        url: articulo.url || "",
        estatus: articulo.estatus !== undefined ? articulo.estatus : true,
        estado: articulo.estado || "En Proceso",
        investigadores_ids: [],
        ordenes_autores: [],
      });

      if (articulo.autores && articulo.autores.length > 0) {
        const autoresOrdenados = [...articulo.autores].sort(
          (a, b) => a.orden_autor - b.orden_autor
        );

        setAutoresSeleccionados(
          autoresOrdenados.map((autor) => ({
            id: autor.investigador,
            nombre: autor.investigador_nombre,
            orden: autor.orden_autor,
          }))
        );
      } else {
        setAutoresSeleccionados([]);
      }
    } else {
      setFormData({
        nombre_articulo: "",
        nombre_revista: "",
        abstracto: "",
        pais_publicacion: "",
        fecha_publicacion: "",
        doi: "",
        url: "",
        estatus: true,
        estado: "En Proceso",
        investigadores_ids: [],
        ordenes_autores: [],
      });
      setAutoresSeleccionados([]);
    }
  }, [articulo, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchInvestigadores() {
      setFetchingData(true);
      setError(null);
      try {
        const response = await api.get(
          "/investigadores/?page_size=1000&activo=true"
        );

        let data = response.data.results || response.data || [];

        if (!Array.isArray(data)) {
          console.warn("La respuesta no es un array:", data);
          data = [];
        }

        const sortedData = [...data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );

        console.log("Investigadores cargados:", sortedData);
        setInvestigadores(sortedData);
      } catch (err) {
        console.error("Error al cargar investigadores:", err);
        if (err.response) {
          setError(
            `Error al cargar investigadores: ${
              err.response.status
            } - ${JSON.stringify(err.response.data)}`
          );
        } else if (err.request) {
          setError(
            "Error al cargar investigadores: No se recibió respuesta del servidor"
          );
        } else {
          setError(`Error al cargar investigadores: ${err.message}`);
        }
      } finally {
        setFetchingData(false);
      }
    }

    if (isOpen) {
      fetchInvestigadores();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "estado") {
      // Actualización automática del estado activo según el estado seleccionado
      // Si es "Publicado", activo=true, en otros casos también activo
      // Solo en caso de que se agregue un estado "Inactivo" o similar en el futuro, cambiaría a false
      const estadosActivos = [
        "En Proceso",
        "Terminado",
        "En Revista",
        "Publicado",
      ];
      const isActive = estadosActivos.includes(value);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        estatus: isActive,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAddAutor = (investigador) => {
    if (autoresSeleccionados.some((autor) => autor.id === investigador.id)) {
      return;
    }

    const nuevoOrden = autoresSeleccionados.length + 1;

    setAutoresSeleccionados([
      ...autoresSeleccionados,
      {
        id: investigador.id,
        nombre: investigador.nombre,
        orden: nuevoOrden,
      },
    ]);

    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveAutor = (id) => {
    const nuevosAutores = autoresSeleccionados.filter(
      (autor) => autor.id !== id
    );

    const autoresReordenados = nuevosAutores.map((autor, index) => ({
      ...autor,
      orden: index + 1,
    }));

    setAutoresSeleccionados(autoresReordenados);
  };

  const handleOrderChange = (id, newOrder) => {
    if (newOrder < 1 || isNaN(newOrder)) return;

    const autoresModificados = [...autoresSeleccionados];

    const autorIndex = autoresModificados.findIndex((autor) => autor.id === id);
    if (autorIndex === -1) return;

    autoresModificados[autorIndex] = {
      ...autoresModificados[autorIndex],
      orden: newOrder,
    };

    autoresModificados.sort((a, b) => a.orden - b.orden);

    setAutoresSeleccionados(autoresModificados);
  };

  const getFilteredInvestigadores = () => {
    return investigadores.filter(
      (inv) =>
        inv.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !autoresSeleccionados.some((autor) => autor.id === inv.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };

      dataToSend.investigadores_ids = autoresSeleccionados.map(
        (autor) => autor.id
      );
      dataToSend.ordenes_autores = autoresSeleccionados.map(
        (autor) => autor.orden
      );

      if (
        dataToSend.investigadores_ids.length !==
        dataToSend.ordenes_autores.length
      ) {
        throw new Error("Error en la asignación de autores y órdenes");
      }

      if (dataToSend.fecha_publicacion === "") {
        dataToSend.fecha_publicacion = null;
      }

      console.log("Datos a enviar:", dataToSend);

      let result;

      if (articulo) {
        result = await articuloService.updateArticulo(articulo.id, dataToSend);
      } else {
        result = await articuloService.createArticulo(dataToSend);
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error al guardar artículo:", err);
      let errorMsg = err.message || "Error al guardar. Revisa los datos.";

      if (err.response) {
        const serverErrors = err.response.data;
        console.error("Detalles del error del servidor:", serverErrors);

        if (typeof serverErrors === "object") {
          const errorDetails = Object.entries(serverErrors)
            .map(
              ([campo, mensaje]) =>
                `${campo}: ${
                  Array.isArray(mensaje) ? mensaje.join(", ") : mensaje
                }`
            )
            .join("; ");

          if (errorDetails) {
            errorMsg += ` Detalles: ${errorDetails}`;
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestigadores = getFilteredInvestigadores();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={articulo ? "Editar Artículo" : "Crear Artículo"}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título del artículo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título del Artículo
            </label>
            <input
              type="text"
              name="nombre_articulo"
              value={formData.nombre_articulo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Revista y País */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Revista
              </label>
              <input
                type="text"
                name="nombre_revista"
                value={formData.nombre_revista}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nombre de la revista (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                País de Publicación
              </label>
              <input
                type="text"
                name="pais_publicacion"
                value={formData.pais_publicacion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* DOI y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                DOI
              </label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="10.1000/xyz123"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Publicación
              </label>
              <input
                type="date"
                name="fecha_publicacion"
                value={formData.fecha_publicacion}
                onChange={handleChange}
                required
                className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Abstracto */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Resumen / Abstract
            </label>
            <textarea
              name="abstracto"
              value={formData.abstracto}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Sección de Autores */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-300">
                Autores
              </label>
              <span className="text-xs text-gray-400">
                {autoresSeleccionados.length}
                {autoresSeleccionados.length === 1 ? " autor" : " autores"}{" "}
                seleccionado(s)
              </span>
            </div>

            {/* Buscador de investigadores */}
            <div ref={searchRef} className="relative">
              <input
                type="text"
                placeholder="Buscar investigador para agregar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              />

              {/* Dropdown de resultados */}
              {showDropdown && searchTerm && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredInvestigadores.length > 0 ? (
                    filteredInvestigadores.map((investigador) => (
                      <div
                        key={investigador.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-gray-200"
                        onClick={() => handleAddAutor(investigador)}
                      >
                        {investigador.nombre}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      {searchTerm
                        ? "No se encontraron resultados"
                        : "Escribe para buscar investigadores"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lista de autores seleccionados */}
            {autoresSeleccionados.length > 0 && (
              <div className="mt-2 border border-gray-700 rounded-md bg-gray-800/50 p-2">
                <div className="text-xs text-gray-400 mb-2 italic">
                  El orden indica la posición del autor en la publicación (1 =
                  autor principal)
                </div>
                <ul className="space-y-2">
                  {autoresSeleccionados.map((autor) => (
                    <li
                      key={autor.id}
                      className="flex items-center justify-between bg-gray-700/40 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <label className="text-xs text-gray-400">
                            Orden:
                          </label>
                          <input
                            type="number"
                            value={autor.orden}
                            min="1"
                            onChange={(e) =>
                              handleOrderChange(
                                autor.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            className="w-12 px-1 py-0.5 bg-gray-800 border border-gray-600 rounded text-white text-center text-sm"
                          />
                        </div>
                        <span className="text-indigo-300">{autor.nombre}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAutor(autor.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Estado del artículo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado del Artículo
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="cursor-pointer w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ESTADO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-400">
              Seleccione el estado actual del artículo en el proceso de
              publicación
            </p>
          </div>

          {/* Estado Activo - Solo informativo */}
          <div className="pt-4 pb-4 flex justify-center text-center">
            <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-md">
              <span className="text-sm text-gray-400 mr-2">
                Estado activo:{" "}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  formData.estatus
                    ? "bg-green-900/50 text-green-300"
                    : "bg-red-900/50 text-red-300"
                }`}
              >
                {formData.estatus ? "Activo" : "Inactivo"}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                (Determinado por el estado del artículo)
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}
    </FormModal>
  );
}

export default ArticuloForm;
