import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAdvisorProfile, fetchAssignedStudents } from '../store/advisor/advisorThunks';

export const useAdvisor = () => {
  const dispatch = useDispatch();
  const { profile, assignedStudents, loading, error } = useSelector((s) => s.advisor);

  return {
    profile, assignedStudents, loading, error,
    loadProfile: useCallback(() => dispatch(fetchAdvisorProfile()), [dispatch]),
    loadStudents: useCallback(() => dispatch(fetchAssignedStudents()), [dispatch]),
  };
};
