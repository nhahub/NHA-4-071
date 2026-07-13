import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchAdvisorProfile, fetchAssignedStudents, fetchDashboardStats,
  fetchSessions, addSession, modifySession,
  fetchStudentProgress, fetchGraduationAudit,
  fetchIssues, modifyIssueStatus, fetchSemesters,
} from '../store/advisor/advisorThunks';

export const useAdvisor = () => {
  const dispatch = useDispatch();
  const { profile, assignedStudents, dashboardStats, sessions, semesters, studentProgress, graduationAudit, issues, loading, statsLoading, error } = useSelector((s) => s.advisor);

  return {
    profile, assignedStudents, dashboardStats, sessions, semesters, studentProgress, graduationAudit, issues, loading, statsLoading, error,
    loadProfile: useCallback(() => dispatch(fetchAdvisorProfile()), [dispatch]),
    loadStudents: useCallback(() => dispatch(fetchAssignedStudents()), [dispatch]),
    loadDashboardStats: useCallback(() => dispatch(fetchDashboardStats()), [dispatch]),
    loadSessions: useCallback(() => dispatch(fetchSessions()), [dispatch]),
    loadSemesters: useCallback(() => dispatch(fetchSemesters()), [dispatch]),
    createSession: useCallback((data) => dispatch(addSession(data)), [dispatch]),
    updateSession: useCallback((sessionId, data) => dispatch(modifySession({ sessionId, data })), [dispatch]),
    loadStudentProgress: useCallback((studentId) => dispatch(fetchStudentProgress(studentId)), [dispatch]),
    loadGraduationAudit: useCallback((studentId) => dispatch(fetchGraduationAudit(studentId)), [dispatch]),
    loadIssues: useCallback(() => dispatch(fetchIssues()), [dispatch]),
    updateIssue: useCallback((issueId, status) => dispatch(modifyIssueStatus({ issueId, status })), [dispatch]),
  };
};
