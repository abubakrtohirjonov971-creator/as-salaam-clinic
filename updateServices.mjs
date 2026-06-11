import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://igtpfdahjzmaixyvnvle.supabase.co',
  'sb_publishable_Db6HvFYTtKuUiweSJmmkJA_LGqhRQRk'
);

const newServices = [
  {
    id: crypto.randomUUID(),
    icon: 'FaNotesMedical',
    title: 'UZI (UTT)',
    desc: "Barcha ichki a'zolarni zamonaviy va aniq diagnostika qilish.",
    image: '/src/assets/Uzi.jpg'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaHeartbeat',
    title: 'EKG',
    desc: "Yurak-qon tomir tizimi faoliyatini tekshirish va kasalliklarni aniqlash.",
    image: '/src/assets/ekg .jpg'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaChild',
    title: 'Pediatr',
    desc: "Bolalar kasalliklarini tajribali shifokorlar nazoratida diagnostika qilish va davolash.",
    image: '/src/assets/pediatr.png'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaStethoscope',
    title: 'Terapevt',
    desc: "Kattalardagi barcha ichki kasalliklarni aniqlash va kompleks davolash usullari.",
    image: '/src/assets/terapevt.png'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaBrain',
    title: 'Nevropatolog',
    desc: "Markaziy va periferik asab tizimi kasalliklarini zamonaviy usulda davolash.",
    image: '/src/assets/nevropatolog.png'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaBone',
    title: 'Travmatolog',
    desc: "Suyak, bo'g'im va mushaklardagi barcha turdagi shikastlanishlarni davolash.",
    image: '/src/assets/travmatologiya.jpg'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaWheelchair',
    title: 'Ortoped',
    desc: "Tayanch-harakat tizimidagi tug'ma yoki orttirilgan kasalliklarni diagnostika qilish.",
    image: '/src/assets/ortoped.jpg'
  },
  {
    id: crypto.randomUUID(),
    icon: 'FaSpa',
    title: 'Fizioterapiya',
    desc: "Dori-darmonsiz davolashning eng samarali va zamonaviy fizioterapevtik usullari.",
    image: '/src/assets/Fizioterapiya.jpeg'
  }
];

async function updateServices() {
  console.log('Clearing old services...');
  const { error: deleteError } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) { console.error('Delete error:', deleteError); return; }

  console.log('Inserting new services...');
  const { error: insertError } = await supabase.from('services').insert(newServices);
  if (insertError) { console.error('Insert error:', insertError); }
  else { console.log('✅ Services updated successfully!'); }
}

updateServices();
