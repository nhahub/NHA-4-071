import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchMyEnrollments, enrollCourse, dropCourse } from '../store/enrollment/enrollmentThunks';

export const useEnrollment = () => {
  const dispatch = useDispatch();
  const { enrollments, loading, error } = useSelector((s) => s.enrollment);

  return {
    enrollments, loading, error,
    loadEnrollments: useCallback(() => dispatch(fetchMyEnrollments()), [dispatch]),
    enroll: useCallback((id) => dispatch(enrollCourse(id)), [dispatch]),
    drop: useCallback((id) => dispatch(dropCourse(id)), [dispatch]),
  };
};
