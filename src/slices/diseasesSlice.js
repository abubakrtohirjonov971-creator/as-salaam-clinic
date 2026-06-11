import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// Fetch diseases from Supabase
export const fetchDiseases = createAsyncThunk(
  'diseases/fetchDiseases',
  async () => {
    const { data, error } = await supabase.from('diseases').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
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
