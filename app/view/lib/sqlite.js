import * as SQLite from 'expo-sqlite';

let dbPromise = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('senda_segura.db');
  }
  return dbPromise;
}

export async function executeSql(sql, params = []) {
  try {
    const db = await getDB();
    const isSelect = /^\s*select/i.test(sql);

    if (isSelect) {
      const rows = await db.getAllAsync(sql);
      return {
        rows: { _array: rows, length: rows.length }
      };
    } else {
      return await db.runAsync(sql, ...(params || []));
    }
  } catch (error) {
    console.error('SQL error:', sql, error);
    throw error;
  }
}
