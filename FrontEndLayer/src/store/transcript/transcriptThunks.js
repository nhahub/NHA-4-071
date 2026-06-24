import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMyTranscript } from "../../services/studentService";
export const fetchTranscript = createAsyncThunk("transcript/fetchAll", async (_, { rejectWithValue }) => {
  const result = await getMyTranscript();
  if (!result.success) return rejectWithValue(result.error);
  return result.data;
});