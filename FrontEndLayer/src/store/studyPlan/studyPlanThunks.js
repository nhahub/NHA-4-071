import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyStudyPlan } from "../../services/studentService";
export const fetchStudyPlan = createAsyncThunk("studyPlan/fetchAll", async (_, { rejectWithValue }) => {
  const result = await getMyStudyPlan();
  if (!result.success) return rejectWithValue(result.error);
  return result.data;
});