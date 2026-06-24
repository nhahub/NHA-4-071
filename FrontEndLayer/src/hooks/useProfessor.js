import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchProfessorProfile, fetchMyOfferings, submitGrade } from '../store/professor/professorThunks';

export const useProfessor = () => {
  const dispatch = useDispatch();
  const { profile, offerings, loading, error } = useSelector((s) => s.professor);

  return {
    profile, offerings, loading, error,
    loadProfile: useCallback(() => dispatch(fetchProfessorProfile()), [dispatch]),
    loadOfferings: useCallback(() => dispatch(fetchMyOfferings()), [dispatch]),
    submitGrade: useCallback((data) => dispatch(submitGrade(data)), [dispatch]),
  };
};
