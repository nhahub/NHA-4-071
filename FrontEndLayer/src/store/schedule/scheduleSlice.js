import { createSlice } from "@reduxjs/toolkit";
import { fetchSchedule } from "./scheduleThunks";
const initialState = { schedule: [], loading: false, error: null };
const scheduleSlice = createSlice({
  name: "schedule", initialState,
  reducers: { clearScheduleError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchSchedule.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchSchedule.fulfilled, (s, a) => { s.loading = false; s.schedule = a.payload; })
     .addCase(fetchSchedule.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { clearScheduleError } = scheduleSlice.actions;
export default scheduleSlice.reducer;