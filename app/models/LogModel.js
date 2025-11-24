import { getDB } from "../view/lib/sqlite";

export async function saveLogToDB(level, message) {
  const db = await getDB();
  const timestamp = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)`,
    [timestamp, level, message]
  );
}

export async function getAllLogs() {
  const db = await getDB();
  const stmt = await db.prepareAsync(
    "SELECT * FROM logs ORDER BY id DESC"
  );
  const result = await stmt.executeAsync();
  return await result.getAllAsync();
}
