import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: doctors, error: dErr } = await supabase.from('doctors').select('*');
  console.log('Doctors:', doctors?.length, dErr);
  
  const { data: services, error: sErr } = await supabase.from('services').select('*');
  console.log('Services:', services?.length, sErr);
}
test();
