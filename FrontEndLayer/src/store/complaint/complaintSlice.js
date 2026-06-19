import { createSlice } from '@reduxjs/toolkit';
import { fetchMyComplaints, createComplaint } from './complaintThunks';

const initialState = {
  complaints: [],
  loading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    clearComplaintError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyComplaints.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => { state.loading = false; state.complaints = action.payload; })
      .addCase(fetchMyComplaints.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createComplaint.pending, (state) => { state.loading = true; })
      .addCase(createComplaint.fulfilled, (state, action) => { state.loading = false; state.complaints.push(action.payload); })
      .addCase(createComplaint.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearComplaintError } = complaintSlice.actions;
export default complaintSlice.reducer;
