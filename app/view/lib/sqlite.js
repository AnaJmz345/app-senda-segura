import { SQLite } from "expo-sqlite";

let dbInstance = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("senda_segura.db");
  }
  return dbInstance;
}

export async function executeSql(query, params = []) {
  const db = await getDB();
  return db.runAsync(query, params);
}
