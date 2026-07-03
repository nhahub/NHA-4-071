import { createSlice } from '@reduxjs/toolkit';
import { fetchAdvisingSessions, createSession, updateSession } from './advisingSessionThunks';

const initialState = {
  sessions: [],
  loading: false,
  error: null,
};

const advisingSessionSlice = createSlice({
  name: 'advisingSession',
  initialState,
  reducers: {
    clearSessionError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvisingSessions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdvisingSessions.fulfilled, (state, action) => { state.loading = false; state.sessions = action.payload; })
      .addCase(fetchAdvisingSessions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createSession.pending, (state) => { state.loading = true; })
      .addCase(createSession.fulfilled, (state, action) => { state.loading = false; state.sessions.push(action.payload); })
      .addCase(createSession.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateSession.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.sessions.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.sessions[idx] = action.payload;
      })
      .addCase(updateSession.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSessionError } = advisingSessionSlice.actions;
export default advisingSessionSlice.reducer;
