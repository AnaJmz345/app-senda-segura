import { supabase } from '../view/lib/supabase';
import { logInfo, logError } from '../utils/logger';
import {
  getLocalParamedicStatus,
  saveLocalParamedicStatus
} from '../models/ParamedicStatusModel';

// ===========================
//  CARGAR ESTADO (LECTURA)
// ===========================
export async function loadParamedicStatus(userId) {
  try {
    logInfo(`[PARAMEDIC] Cargando estado id=${userId}`);

    // 1) Leer primero de SQLite (respuesta rápida)
    const local = await getLocalParamedicStatus(userId);
    logInfo("[CONTROLLER] Estado local desde SQLite:", local);

    // 2) Intentar sincronizar con Supabase
    const { data, error } = await supabase
      .from("paramedic_status")
      .select("is_active")
      .eq("user_id", userId)
      .maybeSingle();

    // (A) Si hay error diferente a "no existe" → mantener valor local
    if (error && error.code !== "PGRST116") {
      logError("[CONTROLLER] Error en Supabase (manteniendo local):", error);
      return local;
    }

    // (B) Si no existe registro → crear uno en Supabase con el valor local
    if (error && error.code === "PGRST116") {
      logInfo("[CONTROLLER] No existía registro en Supabase, creando...");

      const { data: newRow, error: insertError } = await supabase
        .from("paramedic_status")
        .insert([{ user_id: userId, is_active: local }])
        .select()
        .single();

      if (insertError) {
        logError("[CONTROLLER] Error creando registro en Supabase:", insertError);
        return local; // Mantener valor local si falla la creación
      }

      const remoteValue = newRow.is_active === 1 || newRow.is_active === true;
      await saveLocalParamedicStatus(userId, remoteValue);
      return remoteValue;
    }

    // (C) Si Supabase tiene dato válido → usar ese como fuente de verdad
    if (data && typeof data.is_active !== "undefined" && data.is_active !== null) {
      const remoteValue = data.is_active === 1 || data.is_active === true;
      logInfo("[CONTROLLER] Sincronizando desde Supabase:", remoteValue);
      
      // Solo actualizar SQLite si el valor cambió
      if (remoteValue !== local) {
        await saveLocalParamedicStatus(userId, remoteValue);
      }
      
      return remoteValue;
    }

    // (D) Fallback: mantener valor local
    return local;
  } catch (err) {
    logError("[PARAMEDIC] Error en loadParamedicStatus:", err);
    // En caso de error, intentar leer de SQLite como fallback
    try {
      return await getLocalParamedicStatus(userId);
    } catch (localErr) {
      logError("[PARAMEDIC] Error leyendo fallback de SQLite:", localErr);
      return false;
    }
  }
}


// ===========================
//  ACTUALIZAR ESTADO
// ===========================
export async function updateParamedicStatus(userId, newValue) {
  try {
    logInfo(`[PARAMEDIC] Actualizando estado a ${newValue} para ${userId}`);

    // 1) Guardar primero localmente (para respuesta inmediata en UI)
    await saveLocalParamedicStatus(userId, newValue);

    // 2) Intentar actualizar en Supabase
    const { error: updateError } = await supabase
      .from("paramedic_status")
      .update({ is_active: newValue })
      .eq("user_id", userId);

    // Si el update falló porque no existe el registro, crearlo
    if (updateError) {
      logInfo("[PARAMEDIC] Update falló, intentando insert:", updateError);
      
      const { error: insertError } = await supabase
        .from("paramedic_status")
        .insert([{ user_id: userId, is_active: newValue }]);

      if (insertError) {
        logError("[PARAMEDIC] Error en insert de Supabase:", insertError);
        throw insertError;
      }
    }

    logInfo("[PARAMEDIC] Estado actualizado exitosamente en ambos lugares");
    return true;
  } catch (err) {
    logError("[PARAMEDIC] Error actualizando estado:", err);
    // El valor ya se guardó en SQLite, así que no revertimos
    // pero lanzamos el error para que el UI lo maneje
    throw err;
  }
}


// ===========================
//  SINCRONIZACIÓN MANUAL (OPCIONAL)
// ===========================
export async function syncParamedicStatus(userId) {
  try {
    logInfo(`[PARAMEDIC] Sincronización manual para ${userId}`);
    
    const local = await getLocalParamedicStatus(userId);
    
    const { error } = await supabase
      .from("paramedic_status")
      .upsert({ user_id: userId, is_active: local }, { onConflict: 'user_id' });

    if (error) throw error;
    
    logInfo("[PARAMEDIC] Sincronización completada");
    return true;
  } catch (err) {
    logError("[PARAMEDIC] Error en sincronización:", err);
    return false;
  }
}