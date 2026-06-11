import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Fetch services from Supabase
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
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

