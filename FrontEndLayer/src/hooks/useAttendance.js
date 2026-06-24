import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAttendance } from '../store/attendance/attendanceThunks';

export const useAttendance = () => {
  const dispatch = useDispatch();
  const { attendance, loading, error } = useSelector((s) => s.attendance);

  return {
    attendance, loading, error,
    loadAttendance: useCallback(() => dispatch(fetchAttendance()), [dispatch]),
  };
};