import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from '../slices/servicesSlice';
import doctorsReducer from '../slices/doctorsSlice';
import diseasesReducer from '../slices/diseasesSlice';
import settingsReducer from '../slices/settingsSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    doctors: doctorsReducer,
    diseases: diseasesReducer,
    settings: settingsReducer,
  },
});

