import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchMyPayments, fetchPaymentSummary, submitPayment } from '../store/payment/paymentThunks';
import { clearLastPaymentResult } from '../store/payment/paymentSlice';

export const usePayment = () => {
  const dispatch = useDispatch();
  const { payments, summary, lastPaymentResult, loading, error } = useSelector((s) => s.payment);

  return {
    payments, summary, lastPaymentResult, loading, error,
    loadPayments: useCallback(() => dispatch(fetchMyPayments()), [dispatch]),
    loadSummary: useCallback(() => dispatch(fetchPaymentSummary()), [dispatch]),
    pay: useCallback((data) => dispatch(submitPayment(data)), [dispatch]),
    clearResult: useCallback(() => dispatch(clearLastPaymentResult()), [dispatch]),
  };
};
