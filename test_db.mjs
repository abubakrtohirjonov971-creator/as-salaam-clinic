import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://igtpfdahjzmaixyvnvle.supabase.co', 'sb_publishable_Db6HvFYTtKuUiweSJmmkJA_LGqhRQRk');
async function test() {
  const { data, error } = await supabase.from('rooms').select('*').order('id', { ascending: false }).limit(5);
  console.log('Error:', error);
  console.log('Rooms:', data);
}
test();
