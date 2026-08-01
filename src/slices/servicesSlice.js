import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

const fallbackServices = [
  {
    id: '1',
    title: 'Fizioterapiya',
    title_ru: 'Физиотерапия',
    description: 'Zamonaviy usullar yordamida harakat tizimi kasalliklarini davolash.',
    description_ru: 'Лечение заболеваний опорно-двигательного аппарата современными методами.',
    icon: 'FaHeartbeat'
  },
  {
    id: '2',
    title: 'UZI diagnostika',
    title_ru: 'УЗИ диагностика',
    description: 'Barcha a\'zolarni yuqori aniqlikdagi UZI apparatlarida tekshirish.',
    description_ru: 'Обследование всех органов на высокоточных аппаратах УЗИ.',
    icon: 'FaStethoscope'
  },
  {
    id: '3',
    title: 'Kardiologiya',
    title_ru: 'Кардиология',
    description: 'Yurak qon-tomir kasalliklarini aniqlash va samarali davolash.',
    description_ru: 'Выявление и эффективное лечение сердечно-сосудистых заболеваний.',
    icon: 'FaHeartbeat'
  }
];

// Fetch services from Supabase
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return fallbackServices;
      return data;
    } catch (err) {
      console.warn("Supabase xatoligi (Services). Zaxira malumotlar ishlatilmoqda.");
      return fallbackServices;
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default servicesSlice.reducer;

