import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';
import api from '../../../../api/apiConfig';
import { proyectoService } from '../../../../api/services/proyectoService';

function ProyectoForm({ isOpen, onClose, proyecto = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    explicacion: '',
    estado: 'En Progreso',
    fecha_inicio: '',
    fecha_fin: '',
    lider: ''
  });
  
  const [investigadores, setInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  
  // Para depurar los datos recibidos del proyecto
  useEffect(() => {
    if (proyecto) {
      console.log('Datos recibidos del proyecto a editar:', proyecto);
      console.log('Tipo de dato del líder:', typeof proyecto.lider);
      console.log('Valor del líder:', proyecto.lider);
      
      // Normaliza los valores para evitar 'undefined' o nulos imprevistos
      setFormData({
        nombre: proyecto.nombre || '',
        // Aseguramos que explicación siempre tenga un valor válido
        explicacion: proyecto.explicacion !== undefined ? proyecto.explicacion : '',
        estado: proyecto.estado || 'En Progreso',
        fecha_inicio: proyecto.fecha_inicio ? formatDateForInput(proyecto.fecha_inicio) : '',
        fecha_fin: proyecto.fecha_fin ? formatDateForInput(proyecto.fecha_fin) : '',
        // Normaliza el ID del líder
        lider: normalizeId(proyecto.lider)
      });
      
      // Verificar si se normalizó correctamente
      console.log('Líder normalizado:', normalizeId(proyecto.lider));
    } else {
      // Reinicia el formulario para un nuevo proyecto
      setFormData({
        nombre: '',
        explicacion: '',
        estado: 'En Progreso',
        fecha_inicio: '',
        fecha_fin: '',
        lider: ''
      });
    }
  }, [proyecto, isOpen]);
  
  // Normaliza los IDs para asegurar que sean enteros o cadenas vacías
  const normalizeId = (value) => {
    if (value === null || value === undefined || value === '') return '';
    
    // Si es un objeto con id, devuelve el id como entero
    if (typeof value === 'object' && value !== null) {
      if ('id' in value) {
        return parseInt(value.id, 10);
      }
      // Para manejar otros formatos de objeto
      for (const key in value) {
        if (key === 'id' || key === 'ID' || key === 'Id') {
          return parseInt(value[key], 10);
        }
      }
    }
    
    // Si es un string o número, conviértelo a entero
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? '' : parsedValue;
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    async function fetchInvestigadores() {
      setFetchingData(true);
      setError(null);
      try {
        // Solicitar una cantidad grande de investigadores para evitar problemas de paginación
        const response = await api.get('/investigadores/?page_size=1000');
        
        // Obtener los resultados
        let data = response.data.results || response.data || [];
        
        // Asegurar que sea un array antes de ordenar
        if (!Array.isArray(data)) {
          console.warn('La respuesta no es un array:', data);
          data = [];
        }
        
        // Ordenar por ID para asegurar que los registros con ID 1 aparezcan primero
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        
        console.log('Investigadores cargados:', sortedData);
        setInvestigadores(sortedData);
        
        // Verificar si el líder del proyecto existe en la lista
        if (proyecto && proyecto.lider) {
          const liderId = typeof proyecto.lider === 'object' ? proyecto.lider.id : proyecto.lider;
          const liderExiste = sortedData.some(inv => inv.id === liderId);
          
          if (!liderExiste) {
            console.warn(`El líder con ID ${liderId} no está en la lista de investigadores cargados`);
            // Como no existe, vamos a cargarlo específicamente
            try {
              const liderResponse = await api.get(`/investigadores/${liderId}/`);
              const liderData = liderResponse.data;
              if (liderData && liderData.id) {
                console.log('Líder cargado individualmente:', liderData);
                setInvestigadores([liderData, ...sortedData]);
              }
            } catch (liderErr) {
              console.error(`Error al cargar líder con ID ${liderId}:`, liderErr);
            }
          }
        }
      } catch (err) {
        console.error('Error al cargar investigadores:', err);
        if (err.response) {
          setError(`Error al cargar investigadores: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          setError('Error al cargar investigadores: No se recibió respuesta del servidor');
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
  }, [isOpen, proyecto]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'lider') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validamos que la fecha de fin sea posterior a la de inicio si existe
      if (formData.fecha_fin && formData.fecha_inicio && new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      
      // Clonamos formData para no modificar el estado directamente
      const dataToSend = { ...formData };
      
      // Aseguramos que la fecha_fin sea null si está vacía (en lugar de una cadena vacía)
      if (dataToSend.fecha_fin === '') {
        dataToSend.fecha_fin = null;
      }
      
      // Si el líder es una cadena vacía, conviértelo a null
      if (dataToSend.lider === '') {
        dataToSend.lider = null;
      }
      
      console.log('Datos a enviar:', dataToSend);
      
      let result;
      
      if (proyecto) {
        result = await proyectoService.updateProyecto(proyecto.id, dataToSend);
      } else {
        result = await proyectoService.createProyecto(dataToSend);
      }
      
      onSuccess(result);
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
      let errorMsg = err.message || 'Error al guardar proyecto.';
      
      // Si hay un error de respuesta del servidor, mostrar detalles adicionales
      if (err.response) {
        const serverErrors = err.response.data;
        console.error('Detalles del error del servidor:', serverErrors);
        
        // Formatear errores de validación del backend
        if (typeof serverErrors === 'object') {
          const errorDetails = Object.entries(serverErrors)
            .map(([campo, mensaje]) => `${campo}: ${Array.isArray(mensaje) ? mensaje.join(', ') : mensaje}`)
            .join('; ');
          
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
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={proyecto ? 'Editar Proyecto' : 'Crear Proyecto'}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {fetchingData ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre del Proyecto
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Explicación
            </label>
            <textarea
              name="explicacion"
              value={formData.explicacion}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="En Progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha de Fin (Opcional)
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Lider de Proyecto
            </label>
            <select
              name="lider"
              value={formData.lider || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Seleccionar Responsable --</option>
              {investigadores.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.nombre}
                </option>
              ))}
            </select>
          </div>
          
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
              className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </FormModal>
  );
}

export default ProyectoForm;