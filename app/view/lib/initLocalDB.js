import { executeSql } from "./sqlite";


import arenosas from "../../../assets/routes/arenosas.json";
import bosque from "../../../assets/routes/bosque-nutella.json";
import brujas from "../../../assets/routes/brujas.json";
import bypass from "../../../assets/routes/by-pass-516314.json";
import espinazo from "../../../assets/routes/espinazo.json";
import extensionEspinazo from "../../../assets/routes/extension-espinazo.json";
import huevona from "../../../assets/routes/huevona.json";
import mago from "../../../assets/routes/mago-de-oz.json";
import pinitos from "../../../assets/routes/pinito-angel.json";

const ROUTES = [
  { id: "arenosas", name: "Arenosas", difficulty: "medium", description: "Ruta intermedia con secciones arenosas y curvas técnicas.", distance_km: arenosas.distance_km, duration_min: 28, points: arenosas.coords },
  { id: "bosque-nutella", name: "Bosque Nutella", difficulty: "easy", description: "Ruta cortita ideal para principiantes.", distance_km: bosque.distance_km, duration_min: 10, points: bosque.coords },
  { id: "brujas", name: "Brujas", difficulty: "hard", description: "Ruta difícil con rampas y curvas cerradas.", distance_km: brujas.distance_km, duration_min: 55, points: brujas.coords },
  { id: "bypass", name: "Bypass", difficulty: "easy", description: "Ruta rápida y sencilla.", distance_km: bypass.distance_km, duration_min: 12, points: bypass.coords },
  { id: "espinazo", name: "Espinazo", difficulty: "medium", description: "Ruta clásica del bosque, técnica pero fluida.", distance_km: espinazo.distance_km, duration_min: 38, points: espinazo.coords },
  { id: "extension-espinazo", name: "Extensión Espinazo", difficulty: "medium", description: "Extiende la ruta clásica con más distancia.", distance_km: extensionEspinazo.distance_km, duration_min: 42, points: extensionEspinazo.coords },
  { id: "huevona", name: "Huevona", difficulty: "easy", description: "Ruta suave, ideal para calentar.", distance_km: huevona.distance_km, duration_min: 15, points: huevona.coords },
  { id: "mago-de-oz", name: "Mago de Oz", difficulty: "medium", description: "Ruta intermedia rodeada de árboles.", distance_km: mago.distance_km, duration_min: 32, points: mago.coords },
  { id: "pinitos-angel", name: "Pinitos Ángel", difficulty: "easy", description: "Ruta suave, perfecta para principiantes.", distance_km: pinitos.distance_km, duration_min: 18, points: pinitos.coords }
];

export async function initLocalDB() {
  try {
    console.log("Inicializando base de datos...");

    await executeSql(`
      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT,
        difficulty TEXT,
        geojson TEXT,
        duration_min INTEGER,
        distance_km REAL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
      );
    `);

    await executeSql(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        display_name TEXT,
        phone TEXT,
        avatar_url TEXT,
        is_synced INTEGER DEFAULT 0,
        real_display_name TEXT
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
    await executeSql(`
      CREATE TABLE IF NOT EXISTS paramedic_status (
        user_id TEXT PRIMARY KEY,
        is_active INTEGER DEFAULT 0
      );
    `);


    await executeSql(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        level TEXT,
        message TEXT
      );
    `);

    console.log("Tablas verificadas.");

    let insertedRoutes = 0;

    for (const r of ROUTES) {
      try {
        const exists = await executeSql(
          `SELECT id FROM routes WHERE id='${r.id}' LIMIT 1`
        );

        if (!exists.rows || exists.rows.length === 0) {
          await executeSql(
            `INSERT INTO routes (id, name, difficulty, geojson, duration_min, distance_km, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
            [r.id, r.name, r.difficulty, JSON.stringify(r.points), r.duration_min, r.distance_km, 1]
          );

          insertedRoutes++;
          console.log("Ruta agregada:", r.name);
        } else {
          console.log("Ruta existente:", r.name);
        }
      } catch (e) {
        console.error("Error insertando ruta:", r.name, e);
      }
    }

    console.log("Rutas insertadas:", insertedRoutes);
    console.log("Base de datos lista.");
  } catch (error) {
    console.error("Error crítico inicializando base de datos:", error);
    throw error;
  }
}
