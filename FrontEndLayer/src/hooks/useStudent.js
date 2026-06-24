import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchStudentProfile, updateProfile, fetchStudentDashboard } from '../store/student/studentThunks';

export const useStudent = () => {
  const dispatch = useDispatch();
  const { profile, dashboard, loading, updating, error } = useSelector((s) => s.student);

  return {
    profile, dashboard, loading, updating, error,
    loadProfile: useCallback(() => dispatch(fetchStudentProfile()), [dispatch]),
    saveProfile: useCallback((data) => dispatch(updateProfile(data)), [dispatch]),
    loadDashboard: useCallback(() => dispatch(fetchStudentDashboard()), [dispatch]),
  };
};
