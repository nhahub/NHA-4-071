import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchAdvisingSessions, createSession, updateSession,
} from '../store/advisingSession/advisingSessionThunks';

export const useAdvisingSession = () => {
  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((s) => s.advisingSession);

  return {
    sessions, loading, error,
    loadSessions: useCallback(() => dispatch(fetchAdvisingSessions()), [dispatch]),
    createSession: useCallback((data) => dispatch(createSession(data)), [dispatch]),
    updateSession: useCallback((id, data) => dispatch(updateSession({ sessionId: id, data })), [dispatch]),
  };
};
