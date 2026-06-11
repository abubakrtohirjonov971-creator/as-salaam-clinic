import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if(line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function test() {
  const { data: inserted, error: iErr } = await supabase.from('doctors').insert([
    { id: 'test', name: 'Test', specialty: 'Test', experience: 'Test', diseases: [] }
  ]).select();
  console.log('Insert Error:', iErr);
  console.log('Inserted:', inserted);
  
  const { data: d } = await supabase.from('doctors').select('*');
  console.log('Doctors count after insert:', d?.length);
  
  await supabase.from('doctors').delete().eq('id', 'test');
}
test();
