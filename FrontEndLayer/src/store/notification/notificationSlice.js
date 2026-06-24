import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications, markRead } from './notificationThunks';

const initialState = { notifications: [], loading: false, error: null };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotificationError: (s) => { s.error = null; },
    markAllRead: (s) => { s.notifications.forEach((n) => { n.read = true; }); },
    toggleRead: (s, a) => {
      const n = s.notifications.find((x) => x._id === a.payload || x.id === a.payload);
      if (n) n.read = !n.read;
    },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, a) => { s.loading = false; s.notifications = a.payload; })
      .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(markRead.fulfilled, (s, a) => {
        const n = s.notifications.find((x) => x._id === a.payload || x.id === a.payload);
        if (n) n.read = true;
      });
  },
});

export const { clearNotificationError, markAllRead, toggleRead } = notificationSlice.actions;
export default notificationSlice.reducer;