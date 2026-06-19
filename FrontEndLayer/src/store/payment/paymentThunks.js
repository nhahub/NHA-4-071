import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyPayments, makePayment } from '../../services/studentService';

export const fetchMyPayments = createAsyncThunk(
  'payment/fetchMine', async (_, { rejectWithValue }) => {
    const result = await getMyPayments();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const submitPayment = createAsyncThunk(
  'payment/submit', async (paymentData, { rejectWithValue }) => {
    const result = await makePayment(paymentData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
