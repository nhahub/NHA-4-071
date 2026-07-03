import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMySchedule } from "../../services/studentService";
export const fetchSchedule = createAsyncThunk("schedule/fetchAll", async (_, { rejectWithValue }) => {
  const result = await getMySchedule();
  if (!result.success) return rejectWithValue(result.error);
  return result.data;
});