import { createSlice } from "@reduxjs/toolkit";
import { fetchStudyPlan } from "./studyPlanThunks";
const initialState = { studyPlan: null, loading: false, error: null };
const studyPlanSlice = createSlice({
  name: "studyPlan", initialState,
  reducers: { clearStudyPlanError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchStudyPlan.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchStudyPlan.fulfilled, (s, a) => { s.loading = false; s.studyPlan = a.payload; })
     .addCase(fetchStudyPlan.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { clearStudyPlanError } = studyPlanSlice.actions;
export default studyPlanSlice.reducer;