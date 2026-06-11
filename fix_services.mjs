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
  // Update fizioterapiya image
  await supabase.from('services')
    .update({ image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000' })
    .eq('id', 'fizioterapiya');

  const newServices = [
    {
      id: 'kardiologiya',
      title: 'Kardiologiya',
      desc: 'Yurak-qon tomir kasalliklarini diagnostika va davolash.',
      fulldesc: 'Kardiologiya bo‘limida yurak va qon tomirlar bilan bog‘liq muammolar zamonaviy uskunalar orqali tekshiriladi.',
      icon: 'FaHeartbeat',
      image: 'https://images.unsplash.com/photo-1505751172876-fa143ce4aaf8?auto=format&fit=crop&q=80&w=1000',
      symptoms: JSON.stringify(['Yurak sohasidagi og‘riqlar', 'Nafas qisishi', 'Qon bosimi oshishi']),
      treatments: JSON.stringify([{ title: 'EKG', desc: 'Elektrokardiogramma tahlili' }]),
      advantages: JSON.stringify(['Malakali kardiologlar']),
      faqs: JSON.stringify([]),
      relateddoctor: 'erkinbek'
    },
    {
      id: 'nevrologiya',
      title: 'Nevrologiya',
      desc: 'Asab tizimi kasalliklarini kompleks davolash.',
      fulldesc: 'Bosh og‘riqlari, uyqusizlik, va asab kasalliklarini aniqlash va samarali davolash.',
      icon: 'FaBrain',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000',
      symptoms: JSON.stringify(['Doimiy bosh og‘rig‘i', 'Uyqusizlik', 'Xotira susayishi']),
      treatments: JSON.stringify([{ title: 'Neyroterapiya', desc: 'Asab tizimini tiklash' }]),
      advantages: JSON.stringify(['Samarali yondashuv']),
      faqs: JSON.stringify([]),
      relateddoctor: 'ibrohimjon'
    },
    {
      id: 'pediatriya',
      title: 'Pediatriya',
      desc: 'Bolalar salomatligini asrash va davolash.',
      fulldesc: 'Bolalar uchun maxsus tekshiruvlar va professional shifokorlar.',
      icon: 'FaChild',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000',
      symptoms: JSON.stringify(['Isitma', 'Holsizlik', 'Yo‘tal']),
      treatments: JSON.stringify([{ title: 'Umumiy tekshiruv', desc: 'Bolalar sog‘lig‘ini nazorat qilish' }]),
      advantages: JSON.stringify(['Bolalarga do‘stona muhit']),
      faqs: JSON.stringify([]),
      relateddoctor: 'abror'
    },
    {
      id: 'laboratoriya',
      title: 'Laboratoriya',
      desc: 'Barcha turdagi tibbiy tahlillar.',
      fulldesc: 'Zamonaviy laboratoriya uskunalarida qon va boshqa tahlillarni aniq tekshirish.',
      icon: 'FaVial',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1000',
      symptoms: JSON.stringify(['Profilaktika', 'Shifokor yo‘llanmasi']),
      treatments: JSON.stringify([{ title: 'Qon tahlili', desc: 'Umumiy va biokimyoviy tahlillar' }]),
      advantages: JSON.stringify(['Tezkor va aniq natijalar']),
      faqs: JSON.stringify([]),
      relateddoctor: 'erkinbek'
    },
    {
      id: 'stomatologiya',
      title: 'Stomatologiya',
      desc: 'Tishlarni davolash va estetik stomatologiya.',
      fulldesc: 'Og‘riqsiz davolash usullari va yuqori sifatli materiallar.',
      icon: 'FaTooth',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000',
      symptoms: JSON.stringify(['Tish og‘rig‘i', 'Mulk yallig‘lanishi']),
      treatments: JSON.stringify([{ title: 'Tish tozalash', desc: 'Kariesdan himoya' }]),
      advantages: JSON.stringify(['Og‘riqsiz muolaja']),
      faqs: JSON.stringify([]),
      relateddoctor: 'ibrohimjon'
    }
  ];

  const { error } = await supabase.from('services').upsert(newServices);
  if (error) console.error("Error inserting services:", error);
  else console.log("Successfully inserted 5 new services.");
}

fix();
