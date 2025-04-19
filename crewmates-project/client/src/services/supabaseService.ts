import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '../types/database.types';

/**
 * Supabase service for all crewmate-related operations
 */
export const crewmateService = {
  // Get all crewmates sorted by created_at in descending order
  async getAllCrewmates() {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Get a single crewmate by ID
  async getCrewmate(id: number) {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Create a new crewmate
  async createCrewmate(crewmate: InsertTables<'crewmates'>) {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .insert(crewmate)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Update an existing crewmate
  async updateCrewmate(id: number, updates: UpdateTables<'crewmates'>) {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Delete a crewmate
  async deleteCrewmate(id: number) {
    try {
      const { error } = await supabase
        .from('crewmates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  }
};