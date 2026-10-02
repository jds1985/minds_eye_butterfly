import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zkztetxmlpvkpxkiawnr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Sb_publishable_XGhznBNGI2LBGNiSnAPqDg_16KtI90D';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
