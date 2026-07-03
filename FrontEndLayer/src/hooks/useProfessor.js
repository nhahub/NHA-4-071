import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchProfessorProfile, fetchMyOfferings, submitGrade, fetchOfferingStudents, fetchAssignments, addAssignment } from '../store/professor/professorThunks';

export const useProfessor = () => {
  const dispatch = useDispatch();
  const { profile, offerings, students, assignments, loading, error } = useSelector((s) => s.professor);

  return {
    profile, offerings, students, assignments, loading, error,
    loadProfile: useCallback(() => dispatch(fetchProfessorProfile()), [dispatch]),
    loadOfferings: useCallback(() => dispatch(fetchMyOfferings()), [dispatch]),
    submitGrade: useCallback((data) => dispatch(submitGrade(data)), [dispatch]),
    loadOfferingStudents: useCallback((offeringId) => dispatch(fetchOfferingStudents(offeringId)), [dispatch]),
    loadAssignments: useCallback((offeringId) => dispatch(fetchAssignments(offeringId)), [dispatch]),
    createAssignment: useCallback((data) => dispatch(addAssignment(data)), [dispatch]),
  };
};
