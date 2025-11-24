import { MedicalDataModel } from '../models/MedicalDataModel';

export const MedicalDataController = {
  async saveMedicalData(userId, form) {
    
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

    // Si ya existe un registro del usuario, actualizar; si no, insertar
    const existing = await MedicalDataModel.getByUser(userId);
    if (existing) {
      await MedicalDataModel.updateByUser(userId, dataToInsert);
    } else {
     
      await MedicalDataModel.insert(dataToInsert);
    }
  },

  async loadMedicalData(userId) {
    return await MedicalDataModel.getByUser(userId);
  },
};
