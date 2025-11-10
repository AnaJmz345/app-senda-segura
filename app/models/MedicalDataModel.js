import { supabase } from '../view/lib/supabase';

export const MedicalDataModel = {
  async insert(data) {
    const { error } = await supabase.from('medical_profiles').insert(data);
    if (error) throw error;
  },

  //get saved medical data
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('medical_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  //update medical data
  async updateByUser(userId, fields) {
    const { error } = await supabase
      .from('medical_profiles')
      .update(fields)
      .eq('user_id', userId);
    if (error) throw error;
  }
};
