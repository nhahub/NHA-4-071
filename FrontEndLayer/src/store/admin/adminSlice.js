import { createSlice } from '@reduxjs/toolkit';
import { fetchAllUsers, fetchAllComplaints, resolveComplaint, addSemester } from './adminThunks';

const initialState = {
  users: [],
  complaints: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => { state.complaints = action.payload; })
      .addCase(resolveComplaint.fulfilled, (state, action) => {
        const idx = state.complaints.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.complaints[idx] = action.payload;
      })
      .addCase(addSemester.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
