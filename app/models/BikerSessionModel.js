import { supabase } from '../view/lib/supabase';

export const BikerSessionModel = {
  async getActiveSession(bikerId) {
    try {
      const { data, error } = await supabase
        .from('biker_sessions')
        .select('*')
        .eq('biker_id', bikerId)
        .eq('status', 'active')
        .single();

      if (error) {
        // Si no hay sesión activa, retornar null
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error obteniendo sesión activa:', err);
      throw err;
    }
  },

  // Iniciar nueva sesión (NUEVA FUNCIÓN)
  async startSession(bikerId, coords) {
    try {
      // Desactivar sesiones previas
      await supabase
        .from('biker_sessions')
        .update({ status: 'inactive' })
        .eq('biker_id', bikerId)
        .eq('status', 'active');

      // Crear nueva sesión
      const { data, error } = await supabase
        .from("biker_sessions")
        .insert([{
          biker_id: bikerId,
          status: "active",
          last_location: {
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          },
          started_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error iniciando sesión:', err);
      throw err;
    }
  },

  async getSessionById(sessionId) {
    try {
      const { data, error } = await supabase
        .from('biker_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error obteniendo sesión:', err);
      throw err;
    }
  },

  async endSession(sessionId) {
    try {
      const { error } = await supabase
        .from('biker_sessions')
        .update({ status: 'ended' })
        .eq('id', sessionId);

      if (error) throw error;
      console.log('Sesión finalizada');
    } catch (err) {
      console.error('Error finalizando sesión:', err);
      throw err;
    }
  },

  async updateSessionLocation(sessionId, location) {
    try {
      const { error } = await supabase
        .from('biker_sessions')
        .update({ last_location: location })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error actualizando ubicación de sesión:', err);
      throw err;
    }
  }
};
