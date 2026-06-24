import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchNotifications, markRead } from '../store/notification/notificationThunks';
import { markAllRead as markAllAction, toggleRead as toggleAction } from '../store/notification/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((s) => s.notification);

  return {
    notifications, loading, error,
    loadNotifications: useCallback(() => dispatch(fetchNotifications()), [dispatch]),
    markRead: useCallback((id) => dispatch(markRead(id)), [dispatch]),
    markAllRead: useCallback(() => dispatch(markAllAction()), [dispatch]),
    toggleRead: useCallback((id) => dispatch(toggleAction(id)), [dispatch]),
  };
};