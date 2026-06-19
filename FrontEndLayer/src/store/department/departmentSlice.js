import { createSlice } from '@reduxjs/toolkit';
import { fetchDepartments } from './departmentThunks';

const initialState = {
  departments: [],
  loading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.loading = true; })
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.loading = false; state.departments = action.payload; })
      .addCase(fetchDepartments.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default departmentSlice.reducer;
