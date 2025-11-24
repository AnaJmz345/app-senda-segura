import { executeSql } from "./sqlite";
import { supabase } from "./supabase";
import NetInfo from "@react-native-community/netinfo";


//descarga desde Supabase y guarda en SQLite
export async function downloadProfileFromSupabase(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.log("No profile found in Supabase", error);
    return null;
  }
  

  await executeSql(
    `INSERT OR REPLACE INTO profiles (id, display_name, phone, avatar_url, is_synced)
     VALUES (?, ?, ?, ?, 1)`,
    [
      data.id,
      data.display_name,
      data.phone,
      data.avatar_url,
    ]
  );

  return data;
}


//Sincroniza cambios locales a Supabase
export async function syncPendingProfile(userId) {
  const net = await NetInfo.fetch();
  if (!net.isConnected) return;

  const res = await executeSql(
    `SELECT * FROM profiles WHERE id = ? AND is_synced = 0 LIMIT 1`,
    [userId]
  );

  const local = res.rows._array[0];
  if (!local) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: local.display_name,
      phone: local.phone,
      avatar_url: local.avatar_url,
    })
    .eq("id", userId);

  if (!error) {
    await executeSql(
      `UPDATE profiles SET is_synced = 1 WHERE id = ?`,
      [userId]
    );
  }
}
