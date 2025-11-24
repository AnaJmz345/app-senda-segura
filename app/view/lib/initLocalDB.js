import { executeSql } from "./sqlite";

export async function initLocalDB() {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS routes (
      id TEXT PRIMARY KEY,
      name TEXT,
      difficulty TEXT,
      geojson TEXT,
      duration_min INTEGER,
      distance_km REAL,
      is_active INTEGER,
      created_at TEXT
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      display_name TEXT,
      phone TEXT,
      avatar_url TEXT,
      is_synced INTEGER DEFAULT 0
    );
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS medical_profiles (
      user_id TEXT PRIMARY KEY,
      blood_type TEXT,
      allergies TEXT,
      medications TEXT,
      conditions TEXT,
      emergency_contact_relation TEXT,
      emergency_contact_phone TEXT,
      updated_at TEXT,
      age INTEGER
    );
  `);

  //tabla con los logs 
  await executeSql(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    level TEXT,
    message TEXT
  );
`);

}
