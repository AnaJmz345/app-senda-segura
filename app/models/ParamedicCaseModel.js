import { supabase } from '../view/lib/supabase';

export const ParamedicCaseModel = {
  async insert(data) {
    console.log('📤 Enviando a Supabase:', data);
    const { data: insertedData, error } = await supabase
      .from('paramedic_cases')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error de Supabase:', error);
      throw new Error(`Error al insertar en la base de datos: ${error.message}`);
    }
    
    console.log('✅ Datos insertados:', insertedData);
    return insertedData;
  },

  async getById(caseId) {
    const { data, error } = await supabase
      .from('paramedic_cases')
      .select('*')
      .eq('id', caseId)
      .single();
    if (error) throw error;
    return data;
  },

  async getByParamedic(paramedicId) {
    const { data, error } = await supabase
      .from('paramedic_cases')
      .select('*')
      .eq('paramedic_id', paramedicId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByBiker(bikerId) {
    const { data, error } = await supabase
      .from('paramedic_cases')
      .select('*')
      .eq('biker_id', bikerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByEmergency(emergencyId) {
    const { data, error } = await supabase
      .from('paramedic_cases')
      .select('*')
      .eq('emergency_id', emergencyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async update(caseId, fields) {
    const { error } = await supabase
      .from('paramedic_cases')
      .update(fields)
      .eq('id', caseId);
    if (error) throw error;
  },

  // Get biker by display_name (email or name) - case insensitive and partial match
  async getBikerByDisplayName(displayName) {
    console.log('🔎 Buscando en profiles con display_name:', displayName);
    
    // Try exact match first (case insensitive)
    let { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role')
      .ilike('display_name', displayName)
      .eq('role', 'biker')
      .maybeSingle();
    
    // If no exact match, try partial match
    if (!data && !error) {
      console.log('🔍 No se encontró coincidencia exacta, buscando coincidencia parcial...');
      const { data: results, error: searchError } = await supabase
        .from('profiles')
        .select('id, display_name, role')
        .ilike('display_name', `%${displayName}%`)
        .eq('role', 'biker');
      
      if (searchError) {
        console.error('❌ Error al buscar ciclista:', searchError);
        throw searchError;
      }
      
      // If multiple matches, return the first one
      if (results && results.length > 0) {
        data = results[0];
        console.log(`✅ Se encontraron ${results.length} coincidencias, usando la primera`);
      }
    }
    
    if (error) {
      console.error('❌ Error al buscar ciclista:', error);
      throw error;
    }
    
    console.log('🔍 Resultado de búsqueda:', data);
    return data;
  },

  // Get all bikers for dropdown/selection
  async getAllBikers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, phone')
      .eq('role', 'biker')
      .order('display_name', { ascending: true });
    
    if (error) {
      console.error('❌ Error al obtener ciclistas:', error);
      throw error;
    }
    
    return data;
  }
};
