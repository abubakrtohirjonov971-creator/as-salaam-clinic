import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixPaths() {
  // Fix services
  const { data: services } = await supabase.from('services').select('id, image');
  if (services) {
    for (const s of services) {
      if (s.image && s.image.includes('/src/assets/')) {
        let newImage = s.image.replace('/src/assets/', '/services/');
        if (newImage.includes('ekg .jpg')) newImage = newImage.replace('ekg .jpg', 'ekg.jpg');
        await supabase.from('services').update({ image: newImage }).eq('id', s.id);
        console.log(`Updated service ${s.id} image to ${newImage}`);
      }
    }
  }

  // Fix doctors
  const { data: doctors } = await supabase.from('doctors').select('id, image');
  if (doctors) {
    for (const d of doctors) {
      if (d.image && d.image.includes('/src/assets/')) {
        let newImage = d.image.replace('/src/assets/', '/services/');
        await supabase.from('doctors').update({ image: newImage }).eq('id', d.id);
        console.log(`Updated doctor ${d.id} image to ${newImage}`);
      }
    }
  }
  
  console.log("Done fixing DB paths.");
}

fixPaths();
