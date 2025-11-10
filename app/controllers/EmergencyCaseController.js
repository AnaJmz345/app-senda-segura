import { EmergencyCaseModel } from '../models/EmergencyCaseModel';

export const EmergencyCaseController = {
  async createCase(paramedicId, caseData) {
    // Validate required fields
    if (
      !caseData.bikerName ||
      !caseData.date ||
      !caseData.location ||
      !caseData.injuryType ||
      !caseData.severity ||
      !caseData.injuryDescription
    ) {
      throw new Error('Por favor completa todos los campos obligatorios.');
    }

    // Validate biker name
    if (caseData.bikerName.trim().length < 2) {
      throw new Error('El nombre del ciclista debe tener al menos 2 caracteres.');
    }

    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(caseData.date)) {
      throw new Error('La fecha debe tener el formato DD/MM/YYYY.');
    }

    // Validate location format (latitude, longitude)
    const locationRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    if (!locationRegex.test(caseData.location)) {
      throw new Error('La ubicación debe tener el formato: latitud, longitud.');
    }

    // Parse location
    const [latitude, longitude] = caseData.location.split(',').map(coord => parseFloat(coord.trim()));
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Las coordenadas deben ser números válidos.');
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Las coordenadas están fuera del rango válido.');
    }

    // Structure data for database
    const dataToInsert = {
      paramedic_id: paramedicId,
      biker_name: caseData.bikerName.trim(),
      incident_date: caseData.date,
      location_latitude: latitude,
      location_longitude: longitude,
      injury_type: caseData.injuryType,
      severity: caseData.severity,
      injury_description: caseData.injuryDescription.trim(),
      first_aid_material: caseData.firstAidMaterial || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert the case
    const insertedCase = await EmergencyCaseModel.insert(dataToInsert);
    return insertedCase;
  },

  async getCaseById(caseId) {
    return await EmergencyCaseModel.getById(caseId);
  },

  async getParamedicCases(paramedicId) {
    return await EmergencyCaseModel.getByParamedic(paramedicId);
  },

  async getBikerCases(bikerId) {
    return await EmergencyCaseModel.getByBiker(bikerId);
  },

  async updateCase(caseId, fields) {
    await EmergencyCaseModel.update(caseId, fields);
  }
};
