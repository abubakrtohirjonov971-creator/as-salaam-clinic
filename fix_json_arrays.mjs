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
    symptoms: [
      "Noma'lum og'riqlar",
      "Doimiy charchoq",
      "Profilaktik tekshiruvga ehtiyoj",
      "Genetik kasalliklarga moyillik"
    ],
    treatments: [
      { title: 'MRT (Magnit Rezonans Tomografiya)', desc: "Tana a'zolarini 3D formatda ko'rish" },
      { title: 'Raqamli Rentgen', desc: "Suyak va o'pkani aniq tasvirga olish" },
      { title: 'Kompleks Laboratoriya', desc: 'Barcha turdagi qon va siydik tahlillari' }
    ],
    advantages: [
      'Yuqori aniqlik (99.9%)',
      'Tezkor natijalar (1 soatda)',
      'Xavfsiz va nurlanishsiz usullar'
    ],
    faqs: [
      { q: 'MRT zararlimi?', a: "Yo'q, MRT magnit maydoni asosida ishlaydi va nurlanish bermaydi." },
      { q: 'Tahlillar natijasini online olsa bo‘ladimi?', a: 'Ha, barcha natijalar telefoningizga yuboriladi.' }
    ]
  };

  const fizioterapiya = {
    id: 'fizioterapiya',
    fulldesc: 'Fizioterapiya turli xil jismoniy omillar yordamida kasalliklarni davolashdir. U tayanch-harakat tizimi, asab tizimi kasalliklari va turli xil jarohatlardan so\'ng tiklanish davrida qo\'llaniladi.',
    symptoms: [
      'Surunkali bo‘g‘im va mushak og‘riqlari', 
      'Jarohatdan keyingi tiklanish ehtiyoji',
      'Insult yoki nevrologik kasalliklar asoratlari',
      'Harakatlanishdagi cheklovlar'
    ],
    treatments: [
      { title: 'Magnitoterapiya', desc: 'To\'qimalarda qon aylanishini yaxshilash va og\'riq qoldiruvchi ta\'sir ko\'rsatish.' },
      { title: 'Lazer terapiyasi', desc: 'Hujayralar darajasida yallig\'lanishni to\'xtatish va yaralarni tezroq bitishi.' },
      { title: 'UQT (Ultratovush)', desc: 'Chuqur to\'qimalarni mikromassaj qilish.' }
    ],
    advantages: [
      'Og\'riqsiz va dori-darmonsiz samarali davolash',
      'Mutlaqo xavfsiz texnologiyalar',
      'Organizmni tabiiy o\'z-o\'zini tiklash xususiyatini faollashtirish'
    ],
    faqs: [
      { q: 'Muolaja qancha vaqt davom etadi?', a: 'Odatda har bir seans 15-30 daqiqa atrofida bo\'ladi.' },
      { q: 'Fizioterapiyadan keyin og\'riq kuchayishi mumkinmi?', a: 'Ba\'zida birinchi seanslardan keyin qisqa muddatli reaksiyalar kuzatilishi mumkin, ammo bu tezda o\'tib ketadi va umumiy holat yaxshilanadi.' }
    ]
  };

  const kardiologiya = {
    id: 'kardiologiya',
    symptoms: [
      'Ko‘krak qafasida sanchuvchi yoki siquvchi og‘riq', 
      'Nafas qisishi va havo yetishmasligi', 
      'Qon bosimi tez-tez oshib yoki tushib turishi', 
      'Yurak urishi tezlashishi yoki ritm buzilishi'
    ],
    treatments: [
      { title: 'Medikamentoz davolash', desc: 'Eng zamonaviy dori vositalari orqali kasallik belgilarini bartaraf etish' },
      { title: 'EKG va Holter monitoring', desc: 'Yurak faoliyatini 24 soat davomida uzluksiz nazorat qilish' },
      { title: 'Reabilitatsiya', desc: 'Yurak xurujidan keyingi tiklanish dasturlari' }
    ],
    advantages: [
      'Xorijda malaka oshirgan tajribali shifokorlar', 
      'Eng so‘nggi rusumdagi EKG va UTT apparatlari', 
      'Har bir bemor uchun individual davolash rejasi'
    ],
    faqs: [
      { q: 'Yurak sanchib og‘riganda nima qilish kerak?', a: 'Darhol jismoniy harakatni to‘xtatib, tinch holatda o‘tiring va tez yordam chaqiring.' },
      { q: 'Profilaktika uchun qachon ko‘rikdan o‘tish kerak?', a: '40 yoshdan oshgan insonlar yilda kamida 1 marta kardiolog ko‘rigidan o‘tishi tavsiya etiladi.' }
    ]
  };

  const nevrologiya = {
    id: 'nevrologiya',
    symptoms: [
      'Tez-tez bosh og‘rishi va bosh aylanishi', 
      'Qo‘l va oyoqlarda uvishish', 
      'Uyqu rejimining buzilishi', 
      'Xotira susayishi va diqqatni jamlay olmaslik'
    ],
    treatments: [
      { title: 'Neyromodulyatsiya va Fizioterapiya', desc: 'Maxsus apparatlar yordamida asab tugunlarini rag‘batlantirish' },
      { title: 'Dori-darmon terapiyasi', desc: 'Qon aylanishi va xotirani yaxshilovchi preparatlar' }
    ],
    advantages: [
      'Tezkor va aniq diagnostika', 
      'Depressiya va nevroz holatlariga psixologik ko‘mak', 
      'Surunkali og‘riqlarni yengillashtirish'
    ],
    faqs: [
      { q: 'Bosh og‘rig‘ini dorisiz qoldirsa bo‘ladimi?', a: 'Ba\'zi hollarda massaj va toza havoda sayr qilish yordam beradi, ammo surunkali bo‘lsa shifokor ko‘rigi shart.' }
    ]
  };

  await supabase.from('services').update(diagnostika).eq('id', 'diagnostika');
  await supabase.from('services').update(fizioterapiya).eq('id', 'fizioterapiya');
  await supabase.from('services').update(kardiologiya).eq('id', 'kardiologiya');
  await supabase.from('services').update(nevrologiya).eq('id', 'nevrologiya');
  
  console.log("Fixed arrays!");
}

fix();
