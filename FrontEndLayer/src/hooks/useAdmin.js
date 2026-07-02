import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAllUsers, fetchAllComplaints, resolveComplaint, addSemester, fetchAdminDashboard } from '../store/admin/adminThunks';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const { users, complaints, dashboardData, loading, error } = useSelector((s) => s.admin);

  return {
    users, complaints, dashboardData, loading, error,
    loadUsers: useCallback(() => dispatch(fetchAllUsers()), [dispatch]),
    loadComplaints: useCallback(() => dispatch(fetchAllComplaints()), [dispatch]),
    loadDashboard: useCallback(() => dispatch(fetchAdminDashboard()), [dispatch]),
    resolveComplaint: useCallback((id, status) => dispatch(resolveComplaint({ complaintId: id, status })), [dispatch]),
    addSemester: useCallback((data) => dispatch(addSemester(data)), [dispatch]),
  };
};

