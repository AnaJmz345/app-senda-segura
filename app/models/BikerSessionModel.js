import { supabase } from '../view/lib/supabase';

export const BikerSessionModel = {
  async getActiveSession(bikerId) {
    try {
        await supabase
            .from('biker_sessions')
            .update({ status: 'inactive' })
            .eq('biker_id', user.id)
            .eq('status', 'active');

        // Ahora insertamos la nueva sesión
        const { data, error } = await supabase
            .from("biker_sessions")
            .insert([
        {
      biker_id: user.id,
      status: "active",
      last_location: {
    
        type: "Point",
        coordinates: [coords.longitude, coords.latitude],
      },
      started_at: new Date().toISOString(),
    },
  ])
  .select()
  .single();


      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error obteniendo sesión activa:', err);
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
