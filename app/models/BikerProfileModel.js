import { getDB } from "../view/lib/sqlite";
import { logInfo, logError } from "../utils/logger";

export async function getLocalProfileById(userId) {
  try {
    logInfo(`Buscando perfil local con id=${userId}`);

    const db = await getDB();

    const result = await db.getFirstAsync(
      "SELECT * FROM profiles WHERE id = ? LIMIT 1",
      [userId]
    );

    logInfo("[MODEL] Perfil obtenido correctamente de sqlite:", result);

    return result || null;

  } catch (error) {
    logError(`[MODEL] Error obteniendo perfil local id=${userId}`, error);
    throw error;
  }
}

export async function saveLocalProfile(profile) {
  try {
    const db = await getDB();

    logInfo("[MODEL] Valores que se guardarán en sqlite:", profile);

    await db.runAsync(
      `INSERT OR REPLACE INTO profiles 
       (id, display_name, phone, avatar_url, is_synced, real_display_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.display_name ?? null,       // correo
        profile.phone ?? null,
        profile.avatar_url ?? null,
        profile.is_synced ?? 1,
        profile.real_display_name ?? null,  // nombre real
      ]
    );

    logInfo(`Perfil LOCAL guardado correctamente con id=${profile.id}`);

    // 👇 COMPROBACIÓN INMEDIATA
    const check = await db.getFirstAsync(
      "SELECT * FROM profiles WHERE id = ? LIMIT 1",
      [profile.id]
    );
    logInfo("[MODEL] Perfil en sqlite DESPUÉS de guardar:", check);

  } catch (error) {
    logError(`Error guardando perfil local id=${profile.id}`, error);
    throw error;
  }
}
