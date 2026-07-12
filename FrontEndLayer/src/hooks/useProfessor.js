import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchProfessorProfile, fetchMyOfferings, submitGrade,
  fetchDashboardOverview, fetchNotifications,
  fetchGradeBook, fetchPerformanceAnalytics, fetchSchedule,
  fetchOfferingStudents, addAssignment,
} from '../store/professor/professorThunks';

export const useProfessor = () => {
  const dispatch = useDispatch();
  const { profile, offerings, students, assignments, gradeBook, performance, notifications, dashboard, schedule, loading, error } = useSelector((s) => s.professor);

  return {
    profile, offerings, students, assignments, gradeBook, performance, notifications, dashboard, schedule, loading, error,
    loadProfile: useCallback(() => dispatch(fetchProfessorProfile()), [dispatch]),
    loadOfferings: useCallback(() => dispatch(fetchMyOfferings()), [dispatch]),
    submitGrade: useCallback((data) => dispatch(submitGrade(data)), [dispatch]),
    loadDashboard: useCallback(() => dispatch(fetchDashboardOverview()), [dispatch]),
    loadNotifications: useCallback(() => dispatch(fetchNotifications()), [dispatch]),
    loadGradesOverview: useCallback(() => dispatch(fetchGradeBook()), [dispatch]),
    loadPerformance: useCallback(() => dispatch(fetchPerformanceAnalytics()), [dispatch]),
    loadSchedule: useCallback(() => dispatch(fetchSchedule()), [dispatch]),
    loadOfferingStudents: useCallback((offeringId) => dispatch(fetchOfferingStudents(offeringId)), [dispatch]),
    createAssignment: useCallback((data) => dispatch(addAssignment(data)), [dispatch]),
  };
};
