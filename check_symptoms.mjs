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
  const { data: services } = await supabase.from('services').select('*');
  for (let s of services) {
    console.log(`\nService: ${s.id}`);
    console.log('Symptoms type:', typeof s.symptoms);
    console.log('Is Array?', Array.isArray(s.symptoms));
    console.log('Value:', s.symptoms);
  }
}
test();
