import { MedicalDataModel } from '../models/MedicalDataModel';
import { logInfo,logError } from '../utils/logger';


export const MedicalDataController = {
  async saveMedicalData(userId, form) {
    try{
      logInfo("[Controller] Validando campos del registro médico biker…");
      if (
        !form.age ||
        !form.blood_type ||
        !form.allergies ||
        !form.conditions ||
        !form.medications ||
        !form.emergency_contact_relation ||
        !form.emergency_contact_phone
      ) {
        throw new Error('Por favor completa todos los campos obligatorios.');
      }

      const ageValue = parseInt(form.age, 10);
      if (isNaN(ageValue) || ageValue <= 0 || ageValue > 120) {
        throw new Error('La edad debe ser un número válido entre 1 y 120.');
      }

      if (!/^[0-9+\-\s]{7,15}$/.test(form.emergency_contact_phone)) {
        throw new Error('El teléfono de emergencia no tiene un formato válido.');
      }

      logInfo("[Controller] Validación OK, construyendo objeto a insertar");

      // Estructura final de datos
      const dataToInsert = {
        user_id: userId,
        age: ageValue,
        blood_type: form.blood_type.trim(),
        allergies: form.allergies.trim(),
        conditions: form.conditions.trim(),
        medications: form.medications.trim(),
        emergency_contact_relation: form.emergency_contact_relation.trim(),
        emergency_contact_phone: form.emergency_contact_phone.trim(),
        updated_at: new Date().toISOString(),
      };

      logInfo("[Controller] Guardando en Supabase...");
      // Si ya existe un registro del usuario, actualizar; si no, insertar
      const existing = await MedicalDataModel.getByUser(userId);
      if (existing) {
        logInfo("[Controller] Registro datos médicos existe. Haciendo UPDATE");
        await MedicalDataModel.updateByUser(userId, dataToInsert);
      } else {
        logInfo("[Controller] Registro datos médicos no existe. Haciendo INSERT");
        await MedicalDataModel.insert(dataToInsert);
      }

      logInfo("[Controller] Guardando en SQLITE...");
        // --- GUARDAR EN SQLITE ---
      await MedicalDataModel.saveLocalMD(dataToInsert);

      logInfo("[Controller] Todo guardado correctamente");
      return true;
    }
    catch(error){
      logError("[Controller] Error al guardar datos médicos",error)
      throw(error)
    }
  },

  async loadMedicalData(userId) {
    try{
        // Intentar cargar desde SQLite
      logInfo("[Controller] Obteniendo datos médicos de SQLITE...");
      const local = await MedicalDataModel.getLocalMDById(userId);
      if (local) return local;

      // Si no hay local, traer de Supabase
      logInfo("[Controller] No hay datos médicos en sqlite, usando supa");
      const remote = await MedicalDataModel.getByUser(userId);
      if (remote) {
        logInfo("[Controller] Guardando nuevos datos en sqlite");
        // Guardarlo en SQLite para futuras cargas instantáneas
        await MedicalDataModel.saveLocalMD(remote);
      }

      return remote;
    }
    catch(error){
      logError("[Controller] Error al cargar datos médicos",error)
      throw(error)
    }
    
  }
};


