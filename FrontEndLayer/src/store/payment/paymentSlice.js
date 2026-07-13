import { createSlice } from '@reduxjs/toolkit';
import { fetchMyPayments, fetchPaymentSummary, submitPayment } from './paymentThunks';

const initialState = {
  payments: [],
  summary: null,
  lastPaymentResult: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
    clearLastPaymentResult: (state) => { state.lastPaymentResult = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyPayments.fulfilled, (state, action) => { state.loading = false; state.payments = action.payload; })
      .addCase(fetchMyPayments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchPaymentSummary.pending, (state) => { state.error = null; })
      .addCase(fetchPaymentSummary.fulfilled, (state, action) => { state.summary = action.payload; })
      .addCase(fetchPaymentSummary.rejected, (state, action) => { state.error = action.payload; })
      .addCase(submitPayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitPayment.fulfilled, (state, action) => { state.loading = false; state.lastPaymentResult = action.payload; })
      .addCase(submitPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearPaymentError, clearLastPaymentResult } = paymentSlice.actions;
export default paymentSlice.reducer;
