import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchAssignments, addAssignment } from '../store/assignment/assignmentThunks';

export const useAssignment = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((s) => s.assignment);

  return {
    assignments, loading, error,
    loadAssignments: useCallback((offeringId) => dispatch(fetchAssignments(offeringId)), [dispatch]),
    createAssignment: useCallback((data) => dispatch(addAssignment(data)), [dispatch]),
  };
};
