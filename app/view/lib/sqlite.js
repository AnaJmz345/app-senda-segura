import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('senda_segura.db');

//utilidad para correr queries
export function executeSql(query, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
}

export default db;
