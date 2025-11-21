import { executeSql } from "./sqlite";

//inicializa todas las tablas locales necesarias
export async function initLocalDB() {
  // Tabla de rutas
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

  // Tabla de perfiles de usuario
  await executeSql(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    display_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_synced INTEGER DEFAULT 0
  );
`);

  //Tabla de perfiles médicos
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
}
