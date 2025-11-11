import { ParamedicCaseModel } from '../models/ParamedicCaseModel';

export const ParamedicCaseController = {
  async createCase(paramedicId, caseData) {
    // Validate required fields
    if (!caseData.bikerName || caseData.bikerName.trim().length === 0) {
      throw new Error('El nombre del ciclista es obligatorio.');
    }

    if (!caseData.injuryType || caseData.injuryType.trim().length === 0) {
      throw new Error('El tipo de lesión es obligatorio.');
    }

    if (!caseData.injuryDescription || caseData.injuryDescription.trim().length === 0) {
      throw new Error('La descripción de la lesión es obligatoria.');
    }

    // Validate biker name length
    if (caseData.bikerName.trim().length < 2) {
      throw new Error('El nombre del ciclista debe tener al menos 2 caracteres.');
    }

    // Look up biker by display_name (could be email or name)
    console.log('🔍 Buscando ciclista con nombre:', caseData.bikerName.trim());
    const biker = await ParamedicCaseModel.getBikerByDisplayName(caseData.bikerName.trim());
    console.log('✅ Ciclista encontrado:', biker);
    
    if (!biker) {
      throw new Error(`No se encontró un ciclista con el nombre: "${caseData.bikerName}". Asegúrate de que el ciclista existe en la base de datos con ese nombre exacto.`);
    }

    // Structure data for database (matching paramedic_cases schema)
    const dataToInsert = {
      paramedic_id: paramedicId,
      biker_id: biker.id,
      injury_type: caseData.injuryType.trim(),
      description: caseData.injuryDescription.trim(),
      emergency_id: caseData.emergencyId || null, // optional for now
    };

    console.log('💾 Insertando caso en la base de datos:', dataToInsert);

    // Insert the case
    const insertedCase = await ParamedicCaseModel.insert(dataToInsert);
    console.log('🎉 Caso insertado exitosamente:', insertedCase);
    return insertedCase;
  },

  async getCaseById(caseId) {
    return await ParamedicCaseModel.getById(caseId);
  },

  async getParamedicCases(paramedicId) {
    return await ParamedicCaseModel.getByParamedic(paramedicId);
  },

  async getBikerCases(bikerId) {
    return await ParamedicCaseModel.getByBiker(bikerId);
  },

  async getEmergencyCases(emergencyId) {
    return await ParamedicCaseModel.getByEmergency(emergencyId);
  },

  async updateCase(caseId, fields) {
    await ParamedicCaseModel.update(caseId, fields);
  }
};
