import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAllUsers, fetchAllComplaints, resolveComplaint, addSemester } from '../store/admin/adminThunks';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const { users, complaints, loading, error } = useSelector((s) => s.admin);

  return {
    users, complaints, loading, error,
    loadUsers: useCallback(() => dispatch(fetchAllUsers()), [dispatch]),
    loadComplaints: useCallback(() => dispatch(fetchAllComplaints()), [dispatch]),
    resolveComplaint: useCallback((id, status) => dispatch(resolveComplaint({ complaintId: id, status })), [dispatch]),
    addSemester: useCallback((data) => dispatch(addSemester(data)), [dispatch]),
  };
};
