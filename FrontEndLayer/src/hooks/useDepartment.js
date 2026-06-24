import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchDepartments } from '../store/department/departmentThunks';

export const useDepartment = () => {
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector((s) => s.department);

  return {
    departments, loading, error,
    loadDepartments: useCallback(() => dispatch(fetchDepartments()), [dispatch]),
  };
};
