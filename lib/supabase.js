import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zkztetxmlpvkpxkiawnr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprenRldHhtbHB2a3B4a2lhd25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjI1MzEsImV4cCI6MjEwNjUzODUzMX0.YBvZBtpzyZJr5cgTPqnfYSe4SIBkRy-XBcO8V7VAC1c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
