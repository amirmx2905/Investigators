import React, { useState, useEffect } from 'react';
import FormModal from './FormModal';

function InvestigadorForm({ isOpen, onClose, investigador = null, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    area: '',
    nivel_edu: '',
    especialidad: '',
    nivel_snii: '',
    fecha_asignacion_snii: '',
    activo: true
  });
  
  const [areas, setAreas] = useState([]);
  const [nivelesEdu, setNivelesEdu] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [nivelesSNII, setNivelesSNII] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (investigador) {
      setFormData({
        nombre: investigador.nombre || '',
        correo: investigador.correo || '',
        celular: investigador.celular || '',
        area: investigador.area || '',
        nivel_edu: investigador.nivel_edu || '',
        especialidad: investigador.especialidad || '',
        nivel_snii: investigador.nivel_snii || '',
        fecha_asignacion_snii: investigador.fecha_asignacion_snii ? formatDateForInput(investigador.fecha_asignacion_snii) : '',
        activo: investigador.activo !== undefined ? investigador.activo : true
      });
    } else {
      setFormData({
        nombre: '',
        correo: '',
        celular: '',
        area: '',
        nivel_edu: '',
        especialidad: '',
        nivel_snii: '',
        fecha_asignacion_snii: '',
        activo: true
      });
    }
  }, [investigador, isOpen]);
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    async function fetchCatalogos() {
      setFetchingData(true);
      try {
        const [areasRes, nivelesEduRes, especialidadesRes, nivelesSNIIRes] = await Promise.all([
          fetch('/api/areas/').then(res => res.json()),
          fetch('/api/nivel-educacion/').then(res => res.json()),
          fetch('/api/especialidades/').then(res => res.json()),
          fetch('/api/nivel-snii/').then(res => res.json())
        ]);
        
        setAreas(areasRes.results || areasRes);
        setNivelesEdu(nivelesEduRes.results || nivelesEduRes);
        setEspecialidades(especialidadesRes.results || especialidadesRes);
        setNivelesSNII(nivelesSNIIRes.results || nivelesSNIIRes);
      } catch (err) {
        console.error('Error al cargar catálogos:', err);
        setError('Error al cargar datos de referencia');
      } finally {
        setFetchingData(false);
      }
    }
    
    if (isOpen) {
      fetchCatalogos();
    }
  }, [isOpen]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (['area', 'nivel_edu', 'especialidad', 'nivel_snii'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? null : parseInt(value, 10)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (investigador) {
        const response = await fetch(`/api/investigadores/${investigador.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar investigador');
        }
        
        result = await response.json();
      } else {
        const response = await fetch('/api/investigadores/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Error al crear investigador');
        }
        
        result = await response.json();
      }
      
      onSuccess(result);
      onClose();
    } catch (err) {
      console.error('Error al guardar investigador:', err);
      setError(err.message || 'Error al guardar. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={investigador ? 'Editar Investigador' : 'Crear Investigador'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre
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
                Correo
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Celular
              </label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Área
              </label>
              <select
                name="area"
                value={formData.area || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Área --</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nivel Educación
              </label>
              <select
                name="nivel_edu"
                value={formData.nivel_edu || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Nivel --</option>
                {nivelesEdu.map(nivel => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nivel}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Especialidad
              </label>
              <select
                name="especialidad"
                value={formData.especialidad || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Especialidad --</option>
                {especialidades.map(esp => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre_especialidad}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nivel SNII
              </label>
              <select
                name="nivel_snii"
                value={formData.nivel_snii || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Seleccionar Nivel SNII --</option>
                {nivelesSNII.map(nivel => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nivel}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha Asignación SNII
              </label>
              <input
                type="date"
                name="fecha_asignacion_snii"
                value={formData.fecha_asignacion_snii || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
            />
            <label className="ml-2 text-sm text-gray-300">
              Investigador Activo
            </label>
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

export default InvestigadorForm;