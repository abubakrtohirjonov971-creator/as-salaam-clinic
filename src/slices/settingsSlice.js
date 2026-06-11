import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  profile: {
    name: 'Administrator',
    email: 'admin@assalamclinic.uz',
    phone: '+998 71 200 00 00',
    role: 'Bosh Administrator',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
  },
  clinic: {
    name: 'As-salam Klinikasi',
    address: 'Andijon shahri, Navbahor ko\'chasi, 12-uy',
    phone: '+998 74 220 50 50',
    email: 'info@assalamclinic.uz',
    workHours: '08:00 - 20:00',
    website: 'www.assalamclinic.uz',
  },
  notifications: {
    newBooking: true,
    bookingCancel: true,
    labReady: true,
    smsToPatient: false,
    emailToPatient: true,
    dailyReport: true,
    weeklyReport: false,
  },
  system: {
    language: 'uz',
    timezone: 'Asia/Tashkent',
    currency: 'UZS',
    dateFormat: 'DD.MM.YYYY',
  },
  security: {
    twoFactor: false
  }
};

const savedState = localStorage.getItem('adminSettings');
const initialState = savedState ? JSON.parse(savedState) : defaultState;

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = action.payload;
      localStorage.setItem('adminSettings', JSON.stringify(state));
    },
    updateClinic: (state, action) => {
      state.clinic = action.payload;
      localStorage.setItem('adminSettings', JSON.stringify(state));
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload;
      localStorage.setItem('adminSettings', JSON.stringify(state));
    },
    updateSystem: (state, action) => {
      state.system = action.payload;
      localStorage.setItem('adminSettings', JSON.stringify(state));
    },
    updateSecurity: (state, action) => {
      state.security = action.payload;
      localStorage.setItem('adminSettings', JSON.stringify(state));
    }
  }
});

export const {
  updateProfile,
  updateClinic,
  updateNotifications,
  updateSystem,
  updateSecurity
} = settingsSlice.actions;

export default settingsSlice.reducer;
