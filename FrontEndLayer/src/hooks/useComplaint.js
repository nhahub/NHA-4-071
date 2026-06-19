import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchMyComplaints, createComplaint } from '../store/complaint/complaintThunks';

export const useComplaint = () => {
  const dispatch = useDispatch();
  const { complaints, loading, error } = useSelector((s) => s.complaint);

  return {
    complaints, loading, error,
    loadComplaints: useCallback(() => dispatch(fetchMyComplaints()), [dispatch]),
    submitComplaint: useCallback((data) => dispatch(createComplaint(data)), [dispatch]),
  };
};
