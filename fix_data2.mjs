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

async function fix() {
  const diagnostika = {
    id: 'diagnostika',
    title: 'Diagnostika',
    desc: 'Kasalliklarni erta aniqlash uchun zamonaviy tahlil va tekshiruvlar.',
    fulldesc: 'Bizning diagnostika markazimiz tibbiyotdagi eng so‘nggi va aniq tekshiruv uskunalariga ega. To‘g‘ri tashxis – muvaffaqiyatli davolanishning yarmi demakdir.',
    icon: 'FaMicroscope',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000',
    symptoms: JSON.stringify([
      "Noma'lum og'riqlar",
      "Doimiy charchoq",
      "Profilaktik tekshiruvga ehtiyoj",
      "Genetik kasalliklarga moyillik"
    ]),
    treatments: JSON.stringify([
      { title: 'MRT (Magnit Rezonans Tomografiya)', desc: "Tana a'zolarini 3D formatda ko'rish" },
      { title: 'Raqamli Rentgen', desc: "Suyak va o'pkani aniq tasvirga olish" },
      { title: 'Kompleks Laboratoriya', desc: 'Barcha turdagi qon va siydik tahlillari' }
    ]),
    advantages: JSON.stringify([
      'Yuqori aniqlik (99.9%)',
      'Tezkor natijalar (1 soatda)',
      'Xavfsiz va nurlanishsiz usullar'
    ]),
    faqs: JSON.stringify([
      { q: 'MRT zararlimi?', a: "Yo'q, MRT magnit maydoni asosida ishlaydi va nurlanish bermaydi." },
      { q: 'Tahlillar natijasini online olsa bo‘ladimi?', a: 'Ha, barcha natijalar telefoningizga yuboriladi.' }
    ]),
    relateddoctor: 'erkinbek' 
  };
  
  const { error: sErr } = await supabase.from('services').upsert([diagnostika]);
  if(sErr) console.error("Error inserting diagnostika:", sErr);
  else console.log("Diagnostika inserted successfully.");
  
  const fizioterapiya = {
    id: 'fizioterapiya',
    title: 'Fizioterapiya',
    desc: 'Dori-darmonsiz davolashning eng samarali usullari.',
    fulldesc: 'Fizioterapiya turli xil jismoniy omillar yordamida kasalliklarni davolashdir.',
    icon: 'FaHeartbeat',
    image: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?auto=format&fit=crop&q=80&w=1000',
    symptoms: JSON.stringify(['Surunkali og‘riqlar', 'Jarohatdan keyingi holat']),
    treatments: JSON.stringify([{ title: 'Magnitoterapiya', desc: 'Og‘riq qoldiruvchi ta‘sir' }]),
    advantages: JSON.stringify(['Tezroq tiklanish']),
    faqs: JSON.stringify([]),
    relateddoctor: 'abror'
  };
  
  const { error: fErr } = await supabase.from('services').upsert([fizioterapiya]);
  if(fErr) console.error("Error inserting fizioterapiya:", fErr);
  else console.log("Fizioterapiya inserted successfully.");
}

fix();
