import { supabase } from '../view/lib/supabase';
import { getDB } from "../view/lib/sqlite";
import { logInfo,logError } from '../utils/logger';

export const MedicalDataModel = { //al definirla así es un objeto de JS que tiene métodos dentro de este, por eso no necesitas poner async function insert
  async insert(data) {
    try{
      await supabase.from('medical_profiles').insert(data);
      logInfo("[Model] Datos médicos insertados correctamente en supabase :)")
    }
    catch(error){
      logError("[Model] Error insertando datos médicos en supabase",error);
      throw error;
    }
   
  },

  //get saved medical data
  async getByUser(userId) {
    try{
      const {data} = await supabase
      .from('medical_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      if (data) {
        logInfo("[Model] Datos médicos traídos correctamente de supabase :)");
      } else {
        logInfo("[Model] No hay datos médicos en supabase para este usuario");
      }
      return data;

    }
    catch(error){
      logError("[Model] Error trayendo datos médicos de supabase",error);
      throw error;
    }
  
   
  },


  //update medical data
  async updateByUser(userId, fields) {
    try{
      await supabase
      .from('medical_profiles')
      .update(fields)
      .eq('user_id', userId);
      logInfo("[Model] Datos médicos actualizados correctamente en supabase :)")
    }
    catch(error){
      logError("[Model] Error actualizando datos médicos en supabse",error);
      throw error;
    }
    
  },

  async getLocalMDById(userId) {
    try{
      const db = await getDB();
      const result = await db.getFirstAsync(
        "SELECT * FROM medical_profiles WHERE user_id = ? LIMIT 1",
        [userId]
      );
      logInfo("[Model] Datos médicos traídos correctamente de sqlite :)")
      return result || null;
    }
    catch(error){
      logError("[Model] Error trayendo datos médicos de sqlite",error);
      throw error;
    }
    
  },


  /*En SQLite (y en casi cualquier base de datos), los signos de interrogación (?) son placeholders., significa “Aquí va un valor externo que voy a insertar luego”. Usar ? y luego un array evita la sql injection porque slqite lo toma como strings lo que hayas puesto en esos campos y no los pone como una query como lo haría si pusieras directo el valor
  
  Ejemplo de cómo sería con el valor directo y causa una sql injection:
  const username = "'; DROP TABLE medical_profiles; --";
  await db.runAsync(`
    INSERT INTO users (username)
    VALUES ('${username}')
  `);
  */
  async  saveLocalMD(md) {
    
    try{ 
      const db = await getDB();
      logInfo("[Model] Guardando datos médicos en sqlite",md)
      await db.runAsync( //run async es para correr una query desql
        //replace es la sintaxis de sqlite Si la clave primaria (user_id) ya existe → hace UPDATE , Si no existe → hace INSERT
        `INSERT OR REPLACE INTO medical_profiles (user_id, blood_type, allergies, medications, conditions, emergency_contact_relation, emergency_contact_phone, updated_at, age)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          md.user_id,
          md.blood_type ?? null,
          md.allergies ?? null,
          md.medications ?? null,
          md.conditions ?? null,
          md.emergency_contact_relation ?? null,
          md.emergency_contact_phone ?? null,
          md.updated_at ?? new Date().toISOString(),
          md.age ?? null
          // el ?? es un Nullish Coalescing Operator y sirve para decir “Si este valor es null o undefined, usa otro valor”.
        ]
      );
      logInfo("[Model] Guardado de datos médicos en sqlite exitoso")
    }
    catch(error){
      logError("[Model] Error guardando datos médicos en sqlite:", error);
      throw error; // <-- siempre re-lanzar el error
    }
  }



};

