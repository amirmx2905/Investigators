import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';
import api from '../../../../api/apiConfig';
import { proyectoService } from '../../../../api/services/proyectoService';

function ProyectoForm({ isOpen, onClose, proyecto = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo',
    fecha_inicio: '',
    fecha_fin: '',
    responsable: ''
  });
  
  const [investigadores, setInvestigadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        estado: proyecto.estado || 'activo',
        fecha_inicio: proyecto.fecha_inicio ? formatDateForInput(proyecto.fecha_inicio) : '',
        fecha_fin: proyecto.fecha_fin ? formatDateForInput(proyecto.fecha_fin) : '',
        responsable: proyecto.responsable || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        estado: 'activo',
        fecha_inicio: '',
        fecha_fin: '',
        responsable: ''
      });
    }
  }, [proyecto, isOpen]);
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    async function fetchInvestigadores() {
      setFetchingData(true);
      try {
        const response = await api.get('/investigadores/');
        setInvestigadores(response.data.results || response.data);
      } catch (err) {
        console.error('Error al cargar investigadores:', err);
        setError('Error al cargar lista de investigadores');
      } finally {
        setFetchingData(false);
      }
    }
    
    if (isOpen) {
      fetchInvestigadores();
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'responsable') {
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
      let result;
      
      if (proyecto) {
        result = await proyectoService.updateProyecto(proyecto.id, formData);
      } else {
        result = await proyectoService.createProyecto(formData);
      }
      
      onSuccess(result);
    } catch (err) {
      console.error('Error al guardar proyecto:', err);
      setError(err.message || 'Error al guardar. Revisa los datos.');
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
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
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
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
              <option value="suspendido">Suspendido</option>
              <option value="cancelado">Cancelado</option>
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
              Investigador Responsable
            </label>
            <select
              name="responsable"
              value={formData.responsable || ''}
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
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors ${
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