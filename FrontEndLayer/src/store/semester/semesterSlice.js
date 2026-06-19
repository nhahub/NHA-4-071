import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSemesters, fetchCurrentSemester } from './semesterThunks';

const initialState = {
  semesters: [],
  currentSemester: null,
  loading: false,
  error: null,
};

const semesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSemesters.pending, (state) => { state.loading = true; })
      .addCase(fetchAllSemesters.fulfilled, (state, action) => { state.loading = false; state.semesters = action.payload; })
      .addCase(fetchAllSemesters.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCurrentSemester.fulfilled, (state, action) => { state.currentSemester = action.payload; });
  },
});

export default semesterSlice.reducer;
