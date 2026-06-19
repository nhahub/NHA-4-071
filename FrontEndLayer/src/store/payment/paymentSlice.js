import { createSlice } from '@reduxjs/toolkit';
import { fetchMyPayments, submitPayment } from './paymentThunks';

const initialState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPayments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyPayments.fulfilled, (state, action) => { state.loading = false; state.payments = action.payload; })
      .addCase(fetchMyPayments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitPayment.pending, (state) => { state.loading = true; })
      .addCase(submitPayment.fulfilled, (state, action) => { state.loading = false; state.payments.push(action.payload); })
      .addCase(submitPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
