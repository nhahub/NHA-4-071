import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAdvisorProfile, fetchAssignedStudents, fetchDashboardStats } from '../store/advisor/advisorThunks';

export const useAdvisor = () => {
  const dispatch = useDispatch();
  const { profile, assignedStudents, dashboardStats, loading, statsLoading, error } = useSelector((s) => s.advisor);

  return {
    profile, assignedStudents, dashboardStats, loading, statsLoading, error,
    loadProfile: useCallback(() => dispatch(fetchAdvisorProfile()), [dispatch]),
    loadStudents: useCallback(() => dispatch(fetchAssignedStudents()), [dispatch]),
    loadDashboardStats: useCallback(() => dispatch(fetchDashboardStats()), [dispatch]),
  };
};
