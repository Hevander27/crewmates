import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Using import.meta.env for Vite environment variables
// For development, we'll use fallback values if env vars are not set
const supabaseUrl = "https://bexylzmkjxmrraiykogq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleHlsem1ranhtcnJhaXlrb2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDYzNjMsImV4cCI6MjA2MDYyMjM2M30.g766fRLj8zvU67PWQiCW1q3c43wKP6en2dhUFyf5gy8"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function to handle errors from Supabase
export const handleSupabaseError = (error: any) => {
    console.error("Supabase error:", error);
    return {
      message: 'An error occurred while accessing the database',
      details: error.message || 'Unknown error',
    };
  };