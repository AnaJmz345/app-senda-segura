import { getLocalProfileById,saveLocalProfile  } from "../models/BikerProfileModel";
import { logInfo,logError } from '../utils/logger';
import { supabase } from "../view/lib/supabase";


export async function loadUserProfile(userId) {
  if (!userId) return null;

  const profile = await getLocalProfileById(userId);
  return profile; // si existe lo mandamos al View
}

export async function updateUserProfile(userId, changes) {
  try {
    logInfo(`[PROFILE] Iniciando actualización del perfil id=${userId}`);

    // 1) Actualizar Supabase
    const { error: supaError } = await supabase
      .from("profiles")
      .update({
        real_display_name: changes.real_display_name,
        phone: changes.phone,
      })
      .eq("id", userId);

    if (supaError) {
      logError("[PROFILE] Error actualizando Supabase", supaError);
      throw new Error("No se pudo actualizar el perfil en Supabase");
    }

    logInfo("[PROFILE] Perfil actualizado en Supabase");

    // 2) Obtener versión anterior para mantener display_name (correo)
    const existing = await getLocalProfileById(userId);


    // 3) Guardar en SQLite
    await saveLocalProfile({
      id: userId,
      display_name: existing?.display_name ?? null, // mantener correo
      phone: changes.phone,
      avatar_url: changes.avatar_url ?? existing?.avatar_url ?? null,
      is_synced: 1,
      real_display_name: changes.real_display_name,
    });

    logInfo("[PROFILE] Perfil local actualizado");
    return true;

  } catch (error) {
      logError("[PROFILE] Error actualizando perfil", error);
      throw error;
    }

}