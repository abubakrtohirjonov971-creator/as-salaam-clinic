import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

const fallbackDoctors = [
  {
    id: 'erkinbek',
    name: 'Haydarov Erkinbek',
    specialty: 'Neyroxirurg',
    specialty_ru: 'Нейрохирург',
    experience: '15+ yil',
    image: '/doctors/erkinbek.png',
    about: 'Miya va asab tizimi bo‘yicha tajribali neyroxirurg.',
    about_ru: 'Опытный нейрохирург по заболеваниям мозга и нервной системы.',
    education: 'Toshkent Tibbiyot Akademiyasi va Rossiya davlat tibbiyot universiteti (klinik ordinatura). Turkiyada malaka oshirgan.',
    education_ru: 'Ташкентская медицинская академия и Российский государственный медицинский университет. Проходил стажировку в Турции.',
    methods: ['Neyroxirurgik operatsiyalar', 'Ortoped', 'MRT tahlil'],
    diseases: ['Miya kasalliklari', 'Umurtqa muammolari', 'Nevrologik holatlar']
  },
  {
    id: 'ibrohimjon',
    name: 'Ismoiljonov Ibrohimjon',
    specialty: 'Xirurg',
    specialty_ru: 'Хирург',
    experience: '2+ yil',
    image: '/doctors/ibrohimjon.png',
    about: 'Murakkab jarrohlik amaliyotlari bo‘yicha mutaxassis.',
    about_ru: 'Специалист по сложным хирургическим операциям.',
    education: 'Andijon Davlat Tibbiyot Instituti va Respublika Neyroxirurgiya markazi. Janubiy Koreyada mikrojarrohlik bo‘yicha tajriba orttirgan.',
    education_ru: 'Андижанский государственный медицинский институт. Опыт в микрохирургии в Южной Корее.',
    methods: ['Operatsiyalar', 'Diagnostika', 'Jarrohlik nazorati'],
    diseases: ['Ichki organlar', 'Jarrohlik patologiyalari']
  },
  {
    id: 'abror',
    name: 'Davlatov Abror',
    specialty: 'Vertebrolog',
    specialty_ru: 'Вертебролог',
    experience: '3+ yil',
    image: '/doctors/abror.png',
    about: 'Umurtqa va bel og‘rig‘i davolash bo‘yicha mutaxassis.',
    about_ru: 'Специалист по лечению позвоночника и болей в спине.',
    education: 'Samarqand Davlat Tibbiyot Instituti, umurtqa pog‘onasi patologiyalari bo‘yicha xalqaro sertifikatlar sohibi.',
    education_ru: 'Самаркандский государственный медицинский институт, обладатель международных сертификатов по патологии позвоночника.',
    methods: ['Manual terapiya', 'Reabilitatsiya', 'Vertebrologiya'],
    diseases: ['Osteoxondroz', 'Skolioz', 'Bel og‘rig‘i']
  }
];

// Supabase orqali shifokorlarni olish
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    try {
      const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return fallbackDoctors;
      return data;
    } catch (err) {
      console.warn("Supabase xatoligi (Doctors). Zaxira malumotlar ishlatilmoqda.");
      return fallbackDoctors;
    }
  }
);

// Supabase ga shifokor qo'shish
export const addDoctorAsync = createAsyncThunk(
  'doctors/addDoctor',
  async (newDoctor) => {
    const { data, error } = await supabase.from('doctors').insert([newDoctor]).select();
    if (error) throw error;
    return data[0];
  }
);

// Supabase da shifokorni o'zgartirish
export const updateDoctorAsync = createAsyncThunk(
  'doctors/updateDoctor',
  async (updatedDoctor) => {
    const { data, error } = await supabase
      .from('doctors')
      .update(updatedDoctor)
      .eq('id', updatedDoctor.id)
      .select();
    if (error) throw error;
    return data[0];
  }
);

// Supabase dan shifokorni o'chirish
export const removeDoctorAsync = createAsyncThunk(
  'doctors/removeDoctor',
  async (id) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) throw error;
    return id;
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add Doctor
      .addCase(addDoctorAsync.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Doctor
      .addCase(updateDoctorAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove Doctor
      .addCase(removeDoctorAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(d => d.id !== action.payload);
      });
  }
});

export default doctorsSlice.reducer;

