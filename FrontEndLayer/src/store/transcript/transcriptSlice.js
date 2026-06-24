import { createSlice } from "@reduxjs/toolkit";
import { fetchTranscript } from "./transcriptThunks";
const initialState = { transcript: null, loading: false, error: null };
const transcriptSlice = createSlice({
  name: "transcript", initialState,
  reducers: { clearTranscriptError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchTranscript.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchTranscript.fulfilled, (s, a) => { s.loading = false; s.transcript = a.payload; })
     .addCase(fetchTranscript.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { clearTranscriptError } = transcriptSlice.actions;
export default transcriptSlice.reducer;