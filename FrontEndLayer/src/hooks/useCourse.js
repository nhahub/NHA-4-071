import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAvailableCourses, fetchCourseOfferings } from '../store/course/courseThunks';

export const useCourse = () => {
  const dispatch = useDispatch();
  const { availableCourses, offerings, loading, error } = useSelector((s) => s.course);

  return {
    availableCourses, offerings, loading, error,
    loadCourses: useCallback(() => dispatch(fetchAvailableCourses()), [dispatch]),
    loadOfferings: useCallback((id) => dispatch(fetchCourseOfferings(id)), [dispatch]),
  };
};
