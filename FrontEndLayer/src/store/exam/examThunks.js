import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyExams } from "../../services/studentService";
export const fetchExams = createAsyncThunk("exam/fetchAll", async (_, { rejectWithValue }) => {
  const result = await getMyExams();
  if (!result.success) return rejectWithValue(result.error);
  return result.data;
});