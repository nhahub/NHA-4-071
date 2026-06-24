import { createSlice } from '@reduxjs/toolkit';
import { fetchAttendance } from './attendanceThunks';

const initialState = { attendance: [], loading: false, error: null };

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: { clearAttendanceError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchAttendance.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAttendance.fulfilled, (s, a) => { s.loading = false; s.attendance = a.payload; })
      .addCase(fetchAttendance.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;