import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchMyPayments, submitPayment } from '../store/payment/paymentThunks';

export const usePayment = () => {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((s) => s.payment);

  return {
    payments, loading, error,
    loadPayments: useCallback(() => dispatch(fetchMyPayments()), [dispatch]),
    pay: useCallback((data) => dispatch(submitPayment(data)), [dispatch]),
  };
};
