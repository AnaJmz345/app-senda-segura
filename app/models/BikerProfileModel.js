import { getDB } from "../view/lib/sqlite";
//../lib/sqlite
export async function getLocalProfileById(userId) {
  const db = await getDB();
  const stmt = await db.prepareAsync(
    "SELECT * FROM profiles WHERE id = ? LIMIT 1"
  );
  const result = await stmt.executeAsync([userId]);
  const rows = await result.getAllAsync();
  return rows[0] || null;
}

export async function saveLocalProfile(profile) {
  const db = await getDB();
  await db.runAsync(
    `INSERT OR REPLACE INTO profiles (id, display_name, phone, avatar_url, is_synced)
     VALUES (?, ?, ?, ?, ?)`,
    [
      profile.id,
      profile.display_name ?? null,
      profile.phone ?? null,
      profile.avatar_url ?? null,
      profile.is_synced ?? 1,
    ]
  );
}
