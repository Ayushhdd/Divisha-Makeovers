import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDashboardStats = createAsyncThunk(
  'admin/dashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'admin/notifications',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/notifications');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    notifications: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      });
  },
});

export default adminSlice.reducer;
