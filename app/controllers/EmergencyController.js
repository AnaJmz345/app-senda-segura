import { EmergencyModel } from "../models/EmergencyModel";
import { logInfo, logError } from "../utils/logger";

export const EmergencyController = {

  async triggerEmergency(user, profile, routeName, coords) {
    try {
      logInfo("[Controller] Preparando emergencia…");

      // 1) Construir objeto para tabla emergencies (SIN generar ID)
      const emergencyToInsert = {
        source: "biker_app",
        trigger_user_id: user.id,
        status: "pending",
        location: {
          type: "Point",
          coordinates: [coords.longitude, coords.latitude],
        },
      };

      // 2) Guardar emergencia → Supabase genera el ID automáticamente
      const emergency = await EmergencyModel.insertEmergency(emergencyToInsert);

      // 3) Construir evento asociado
      const eventToInsert = {
        emergency_id: emergency.id, // ← ID generado por Supabase
        event_type: "sos_triggered",
        payload: {
          user_id: user.id,
          user_name: profile.real_display_name,
          phone: profile.phone,
          route_type: routeName,
          coords,
        },
      };

      // 4) Guardar evento
      await EmergencyModel.insertEvent(eventToInsert);

      logInfo("[Controller] Emergencia registrada correctamente");
      return { ok: true, emergencyId: emergency.id };

    } catch (err) {
      logError("[Controller] Error al registrar emergencia", err);
      return { ok: false, error: err };
    }
  }
};

