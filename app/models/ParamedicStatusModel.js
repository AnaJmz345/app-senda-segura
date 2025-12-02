import { getDB } from "../view/lib/sqlite";
import { logError, logInfo } from "../utils/logger";

export async function getLocalParamedicStatus(userId) {
  try {
    const db = await getDB();
    const row = await db.getFirstAsync(
      "SELECT is_active FROM paramedic_status WHERE user_id = ? LIMIT 1",
      [userId]
    );

    logInfo("[MODEL] Estado local del paramédico:", row);
    return row?.is_active === 1;
  } catch (err) {
    logError("[MODEL] Error leyendo estado local", err);
    return false;
  }
}

export async function saveLocalParamedicStatus(userId, isActive) {
  try {
    const db = await getDB();
    await db.runAsync(
      `INSERT OR REPLACE INTO paramedic_status (user_id, is_active)
       VALUES (?, ?)`,
      [userId, isActive ? 1 : 0]
    );
    logInfo("[MODEL] Estado local guardado:", isActive);
  } catch (err) {
    logError("[MODEL] Error guardando estado local", err);
    throw err;
  }
}
