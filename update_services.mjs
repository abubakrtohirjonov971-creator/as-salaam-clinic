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

async function update() {
  // 1. Delete the 3 unwanted services
  await supabase.from('services').delete().in('id', ['laboratoriya', 'stomatologiya', 'pediatriya']);
  console.log("Deleted 3 services.");

  // 2. Update Kardiologiya
  const kardiologiya = {
    id: 'kardiologiya',
    title: 'Kardiologiya',
    desc: 'Yurak-qon tomir kasalliklarini barvaqt aniqlash va samarali davolash.',
    fulldesc: 'Kardiologiya bo‘limimizda yurak ishemik kasalligi, arterial gipertenziya, aritmiya va boshqa yurak-qon tomir kasalliklari bo‘yicha jahon standartlari asosida tashxis qo‘yish va davolash xizmatlari ko‘rsatiladi. Yuqori malakali mutaxassislarimiz bemorlarga xalqaro protokollar asosida sifatli yordam ko‘rsatadi.',
    icon: 'FaHeartbeat',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000',
    symptoms: JSON.stringify(['Ko‘krak qafasida sanchuvchi yoki siquvchi og‘riq', 'Nafas qisishi va havo yetishmasligi', 'Qon bosimi tez-tez oshib yoki tushib turishi', 'Yurak urishi tezlashishi yoki ritm buzilishi']),
    treatments: JSON.stringify([
      { title: 'Medikamentoz davolash', desc: 'Eng zamonaviy dori vositalari orqali kasallik belgilarini bartaraf etish' },
      { title: 'EKG va Holter monitoring', desc: 'Yurak faoliyatini 24 soat davomida uzluksiz nazorat qilish' },
      { title: 'Reabilitatsiya', desc: 'Yurak xurujidan keyingi tiklanish dasturlari' }
    ]),
    advantages: JSON.stringify(['Xorijda malaka oshirgan tajribali shifokorlar', 'Eng so‘nggi rusumdagi EKG va UTT (UZI) apparatlari', 'Har bir bemor uchun individual davolash rejasi']),
    faqs: JSON.stringify([
      { q: 'Yurak sanchib og‘riganda nima qilish kerak?', a: 'Darhol jismoniy harakatni to‘xtatib, tinch holatda o‘tiring va tez yordam chaqiring.' },
      { q: 'Profilaktika uchun qachon ko‘rikdan o‘tish kerak?', a: '40 yoshdan oshgan insonlar yilda kamida 1 marta kardiolog ko‘rigidan o‘tishi tavsiya etiladi.' }
    ]),
    relateddoctor: 'erkinbek'
  };
  
  // 3. Update Nevrologiya
  const nevrologiya = {
    id: 'nevrologiya',
    title: 'Nevrologiya',
    desc: 'Markaziy va periferik asab tizimi kasalliklarini kompleks davolash.',
    fulldesc: 'Asab tizimi kasalliklari — bosh og‘rig‘i, uyqusizlik, nevroz, insult asoratlari va turli nevralgiyalarni samarali davolaymiz. Zamonaviy diagnostika yondashuvlari tufayli kasallikni erta bosqichda aniqlash imkoniga egamiz.',
    icon: 'FaBrain',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000',
    symptoms: JSON.stringify(['Tez-tez bosh og‘rishi va bosh aylanishi', 'Qo‘l va oyoqlarda uvishish', 'Uyqu rejimining buzilishi', 'Xotira susayishi va diqqatni jamlay olmaslik']),
    treatments: JSON.stringify([
      { title: 'Neyromodulyatsiya va Fizioterapiya', desc: 'Maxsus apparatlar yordamida asab tugunlarini rag‘batlantirish' },
      { title: 'Dori-darmon terapiyasi', desc: 'Qon aylanishi va xotirani yaxshilovchi preparatlar' }
    ]),
    advantages: JSON.stringify(['Tezkor va aniq diagnostika', 'Depressiya va nevroz holatlariga psixologik ko‘mak', 'Surunkali og‘riqlarni yengillashtirish']),
    faqs: JSON.stringify([
      { q: 'Bosh og‘rig‘ini dorisiz qoldirsa bo‘ladimi?', a: 'Ba\'zi hollarda massaj va toza havoda sayr qilish yordam beradi, ammo surunkali bo‘lsa shifokor ko‘rigi shart.' }
    ]),
    relateddoctor: 'ibrohimjon'
  };

  await supabase.from('services').upsert([kardiologiya, nevrologiya]);
  console.log("Updated Kardiologiya and Nevrologiya.");
}

update();
