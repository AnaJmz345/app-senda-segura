import { supabase } from "../view/lib/supabase";
import { logInfo, logError } from "../utils/logger";

export const EmergencyModel = {

  async insertEmergency(data) {
    try {
      const { data: inserted, error } = await supabase
        .from("emergencies")
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      logInfo("[Model] Emergencia guardada correctamente en Supabase");
      return inserted;

    } catch (err) {
      logError("[Model] Error guardando emergencia en Supabase", err);
      throw err;
    }
  },

  async insertEvent(event) {
    try {
      const { error } = await supabase
        .from("emergency_events")
        .insert(event);

      if (error) throw error;

      logInfo("[Model] Evento de emergencia guardado correctamente en Supabase");

    } catch (err) {
      logError("[Model] Error guardando evento en Supabase", err);
      throw err;
    }
  }
};
