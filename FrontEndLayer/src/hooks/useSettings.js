import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchSettings, saveSettings } from '../store/settings/settingsThunks';

export const useSettings = () => {
  const dispatch = useDispatch();
  const { preferences, loading, saving, error } = useSelector((s) => s.settings);

  return {
    preferences, loading, saving, error,
    loadSettings: useCallback(() => dispatch(fetchSettings()), [dispatch]),
    saveSettings: useCallback((data) => dispatch(saveSettings(data)), [dispatch]),
  };
};
