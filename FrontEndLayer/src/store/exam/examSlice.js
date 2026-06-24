import { createSlice } from "@reduxjs/toolkit";
import { fetchExams } from "./examThunks";
const initialState = { exams: [], loading: false, error: null };
const examSlice = createSlice({
  name: "exam", initialState,
  reducers: { clearExamError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchExams.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchExams.fulfilled, (s, a) => { s.loading = false; s.exams = a.payload; })
     .addCase(fetchExams.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { clearExamError } = examSlice.actions;
export default examSlice.reducer;