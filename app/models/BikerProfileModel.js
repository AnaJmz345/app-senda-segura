import { getDB   } from "../view/lib/sqlite";
import { logInfo,logError } from '../utils/logger';


export async function getLocalProfileById(userId) {
  try {
    logInfo(`Buscando perfil local con id=${userId}`);

     const db = await getDB();

    const result = await db.getFirstAsync(
      "SELECT * FROM profiles WHERE id = ? LIMIT 1",
      [userId]
    );

    logInfo("[MODEL] Perfil obtenido correctamente:", result);

    return result || null;

  } catch (error) {
    logError(`[MODEL] Error obteniendo perfil local id=${userId}`, error);
    throw error; // lo vuelves a lanzar para manejarlo arriba si quieres
  }
}

export async function saveLocalProfile(profile) {
  try {
    logInfo(`Guardando perfil local con id=${profile.id}`);

     await db.runAsync(
      `INSERT OR REPLACE INTO profiles 
       (id, display_name, phone, avatar_url, is_synced)
       VALUES (?, ?, ?, ?, ?)`,
      [
        profile.id,
        profile.display_name ?? null,
        profile.phone ?? null,
        profile.avatar_url ?? null,
        profile.is_synced ?? 1,
      ]
    );

    logInfo(`Perfil guardado correctamente con id=${profile.id}`);

  } catch (error) {
    logError(`Error guardando perfil local id=${profile.id}`, error);
    throw error;
  }
}

