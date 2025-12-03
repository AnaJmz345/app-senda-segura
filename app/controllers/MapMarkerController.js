import { MapMarkerModel } from '../models/MapMarkerModel';

export const MapMarkerController = {
  /**
   * Crear un nuevo marcador
   */
  async createMarker(userId, markerData) {
    try {
      // Validaciones
      if (!markerData.type || !markerData.latitude || !markerData.longitude) {
        throw new Error('Tipo, latitud y longitud son obligatorios');
      }

      if (!['first_aid', 'cell_signal'].includes(markerData.type)) {
        throw new Error('Tipo de marcador inválido. Debe ser "first_aid" o "cell_signal"');
      }

      // Validar rango de coordenadas
      if (markerData.latitude < -90 || markerData.latitude > 90) {
        throw new Error('Latitud debe estar entre -90 y 90');
      }

      if (markerData.longitude < -180 || markerData.longitude > 180) {
        throw new Error('Longitud debe estar entre -180 y 180');
      }

      // Preparar datos
      const data = {
        type: markerData.type,
        latitude: markerData.latitude,
        longitude: markerData.longitude,
        name: markerData.name || null,
        description: markerData.description || null,
        created_by: userId,
        is_active: true
      };

      // Insertar en la base de datos
      const result = await MapMarkerModel.insert(data);

      if (result.error) {
        throw result.error;
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error in createMarker:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener todos los marcadores
   */
  async getAllMarkers() {
    try {
      const result = await MapMarkerModel.getAll();

      if (result.error) {
        throw result.error;
      }

      return { success: true, data: result.data || [] };
    } catch (error) {
      console.error('Error in getAllMarkers:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  /**
   * Obtener marcadores por tipo
   */
  async getMarkersByType(type) {
    try {
      if (!['first_aid', 'cell_signal'].includes(type)) {
        throw new Error('Tipo inválido');
      }

      const result = await MapMarkerModel.getByType(type);

      if (result.error) {
        throw result.error;
      }

      return { success: true, data: result.data || [] };
    } catch (error) {
      console.error('Error in getMarkersByType:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  /**
   * Eliminar marcador
   */
  async deleteMarker(markerId) {
    try {
      if (!markerId) {
        throw new Error('ID del marcador es obligatorio');
      }

      const result = await MapMarkerModel.delete(markerId);

      if (result.error) {
        throw result.error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteMarker:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar marcador
   */
  async updateMarker(markerId, updates) {
    try {
      if (!markerId) {
        throw new Error('ID del marcador es obligatorio');
      }

      // Validar tipo si se está actualizando
      if (updates.type && !['first_aid', 'cell_signal'].includes(updates.type)) {
        throw new Error('Tipo de marcador inválido');
      }

      const result = await MapMarkerModel.update(markerId, updates);

      if (result.error) {
        throw result.error;
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error in updateMarker:', error);
      return { success: false, error: error.message };
    }
  }
};