import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

const fallbackDiseases = [
  {
    id: '1',
    title: 'Osteoxondroz',
    title_ru: 'Остеохондроз',
    description: 'Umurtqa pog‘onasining surunkali kasalligi. Davolash va reabilitatsiya.',
    description_ru: 'Хроническое заболевание позвоночника. Лечение и реабилитация.'
  },
  {
    id: '2',
    title: 'Skolioz',
    title_ru: 'Сколиоз',
    description: 'Umurtqaning qiyshayishi va qaddi-qomat buzilishi davosi.',
    description_ru: 'Лечение искривления позвоночника и нарушения осанки.'
  },
  {
    id: '3',
    title: 'Bosh og\'rig\'i va Migren',
    title_ru: 'Головная боль и Мигрень',
    description: 'Kuchli bosh og‘riqlarining asl sababini aniqlab, to‘g‘ri davolash.',
    description_ru: 'Выявление истинной причины сильных головных болей и правильное лечение.'
  }
];

// Fetch diseases from Supabase
export const fetchDiseases = createAsyncThunk(
  'diseases/fetchDiseases',
  async () => {
    try {
      const { data, error } = await supabase.from('diseases').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return fallbackDiseases;
      return data;
    } catch (err) {
      console.warn("Supabase xatoligi (Diseases). Zaxira malumotlar ishlatilmoqda.");
      return fallbackDiseases;
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const diseasesSlice = createSlice({
  name: 'diseases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default diseasesSlice.reducer;
