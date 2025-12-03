import { supabase } from '../view/lib/supabase';

export const MapMarkerModel = {
  /**
   * Insertar un nuevo marcador
   */
  async insert(markerData) {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .insert(markerData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error inserting marker:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener todos los marcadores activos
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting all markers:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener marcadores por tipo
   */
  async getByType(type) {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .select('*')
        .eq('type', type)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error getting markers by type:', error);
      return { data: null, error };
    }
  },

  /**
   * Eliminar marcador (soft delete)
   */
  async delete(markerId) {
    try {
      const { error } = await supabase
        .from('map_markers')
        .update({ is_active: false })
        .eq('id', markerId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting marker:', error);
      return { error };
    }
  },

  /**
   * Actualizar marcador
   */
  async update(markerId, updates) {
    try {
      const { data, error } = await supabase
        .from('map_markers')
        .update(updates)
        .eq('id', markerId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating marker:', error);
      return { data: null, error };
    }
  }
};