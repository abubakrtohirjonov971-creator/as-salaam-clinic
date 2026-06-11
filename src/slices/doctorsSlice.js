import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Supabase orqali shifokorlarni olish
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
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

