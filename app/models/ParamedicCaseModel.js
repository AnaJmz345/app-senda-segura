import { supabase } from '../view/lib/supabase';

export const ParamedicCaseModel = {
  async insert(data) {
    const { data: insertedData, error } = await supabase
      .from('paramedic_cases')
      .insert(data)
      .select()
      .single();
    if (error) throw error;
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

  // get biker by display_name (email or name)
  async getBikerByDisplayName(displayName) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role')
      .eq('display_name', displayName)
      .eq('role', 'biker')
      .maybeSingle();
    if (error) throw error;
    return data;
  }
};
