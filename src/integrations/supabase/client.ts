import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dyeojynnbfgrggxctxbs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZW9qeW5uYmZncmdneGN0eGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNDQyMDcsImV4cCI6MjA4MDgyMDIwN30.0rsvYHRqyMHoqUw5SbqFIxGmv03Wg7hitB9c2tKyNvo';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});