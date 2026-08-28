import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

const fallbackServices = [
  {
    id: 'fizioterapiya',
    title: 'Fizioterapiya',
    title_ru: 'Физиотерапия',
    desc: 'Zamonaviy usullar yordamida harakat tizimi kasalliklarini davolash.',
    desc_ru: 'Лечение заболеваний опорно-двигательного аппарата современными методами.',
    description: 'Zamonaviy usullar yordamida harakat tizimi kasalliklarini davolash.',
    description_ru: 'Лечение заболеваний опорно-двигательного аппарата современными методами.',
    icon: 'FaHeartbeat',
    image: '/services/Fizioterapiya.jpeg'
  },
  {
    id: 'uzi',
    title: 'UZI diagnostika',
    title_ru: 'УЗИ диагностика',
    desc: 'Barcha a\'zolarni yuqori aniqlikdagi UZI apparatlarida tekshirish.',
    desc_ru: 'Обследование всех органов на высокоточных аппаратах УЗИ.',
    description: 'Barcha a\'zolarni yuqori aniqlikdagi UZI apparatlarida tekshirish.',
    description_ru: 'Обследование всех органов на высокоточных аппаратах УЗИ.',
    icon: 'FaStethoscope',
    image: '/services/Uzi.jpg'
  },
  {
    id: 'ekg',
    title: 'EKG',
    title_ru: 'ЭКГ',
    desc: 'Yurak faoliyatini elektrokardiografiya orqali tekshirish.',
    desc_ru: 'Обследование сердечной деятельности с помощью электрокардиографии.',
    description: 'Yurak faoliyatini elektrokardiografiya orqali tekshirish.',
    description_ru: 'Обследование сердечной деятельности с помощью электрокардиографии.',
    icon: 'FaHeartbeat',
    image: '/services/ekg.jpg'
  },
  {
    id: 'nevropatolog',
    title: 'Nevropatolog',
    title_ru: 'Невропатолог',
    desc: 'Asab tizimi kasalliklarini aniqlash va davolash.',
    desc_ru: 'Диагностика и лечение заболеваний нервной системы.',
    description: 'Asab tizimi kasalliklarini aniqlash va davolash.',
    description_ru: 'Диагностика и лечение заболеваний нервной системы.',
    icon: 'FaBrain',
    image: '/services/nevropatolog.png'
  },
  {
    id: 'terapevt',
    title: 'Terapevt',
    title_ru: 'Терапевт',
    desc: 'Umumiy tibbiy ko\'rik va ichki kasalliklarni davolash.',
    desc_ru: 'Общий медицинский осмотр и лечение внутренних заболеваний.',
    description: 'Umumiy tibbiy ko\'rik va ichki kasalliklarni davolash.',
    description_ru: 'Общий медицинский осмотр и лечение внутренних заболеваний.',
    icon: 'FaStethoscope',
    image: '/services/terapevt.png'
  },
  {
    id: 'pediatr',
    title: 'Pediatr',
    title_ru: 'Педиатр',
    desc: 'Bolalar salomatligini saqlash va kasalliklarni davolash.',
    desc_ru: 'Сохранение здоровья детей и лечение заболеваний.',
    description: 'Bolalar salomatligini saqlash va kasalliklarni davolash.',
    description_ru: 'Сохранение здоровья детей и лечение заболеваний.',
    icon: 'FaChild',
    image: '/services/pediatr.png'
  },
  {
    id: 'ortoped',
    title: 'Ortoped-Vertebrolog',
    title_ru: 'Ортопед-Вертебролог',
    desc: 'Umurtqa va bo\'g\'im kasalliklarini kompleks davolash.',
    desc_ru: 'Комплексное лечение заболеваний позвоночника и суставов.',
    description: 'Umurtqa va bo\'g\'im kasalliklarini kompleks davolash.',
    description_ru: 'Комплексное лечение заболеваний позвоночника и суставов.',
    icon: 'FaUserMd',
    image: '/services/ortoped.jpg'
  },
  {
    id: 'travmatologiya',
    title: 'Travmatologiya',
    title_ru: 'Травматология',
    desc: 'Suyak va bo\'g\'im jarohatlarini davolash va tiklash.',
    desc_ru: 'Лечение и восстановление травм костей и суставов.',
    description: 'Suyak va bo\'g\'im jarohatlarini davolash va tiklash.',
    description_ru: 'Лечение и восстановление травм костей и суставов.',
    icon: 'FaUserMd',
    image: '/services/travmatologiya.jpg'
  },
  {
    id: 'laboratoriya',
    title: 'Laboratoriya tahlillari',
    title_ru: 'Лабораторные анализы',
    desc: 'Qon, siydik va biokimyoviy tahlillarni tezkor va aniq o\'tkazish.',
    desc_ru: 'Быстрые и точные анализы крови, мочи и биохимии.',
    description: 'Qon, siydik va biokimyoviy tahlillarni tezkor va aniq o\'tkazish.',
    description_ru: 'Быстрые и точные анализы крови, мочи и биохимии.',
    icon: 'FaVial',
    image: '/services/Fizioterapiya.jpeg'
  }
];

// Fetch services from Supabase
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return fallbackServices;

      // Ensure all 6 services are always displayed by merging missing fallback items
      if (data.length < fallbackServices.length) {
        const existingIds = new Set(data.map(item => item.id || item.title?.toLowerCase()));
        const missing = fallbackServices.filter(item => !existingIds.has(item.id));
        return [...data, ...missing];
      }
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

