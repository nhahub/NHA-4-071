import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchStudentProfile, fetchStudentDashboard } from '../store/student/studentThunks';

export const useStudent = () => {
  const dispatch = useDispatch();
  const { profile, dashboard, loading, error } = useSelector((s) => s.student);

  return {
    profile, dashboard, loading, error,
    loadProfile: useCallback(() => dispatch(fetchStudentProfile()), [dispatch]),
    loadDashboard: useCallback(() => dispatch(fetchStudentDashboard()), [dispatch]),
  };
};
