import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchCurrentSemester, fetchAllSemesters, submitRegistration } from "../store/semester/semesterThunks";
export const useSemester = () => {
  const dispatch = useDispatch();
  const { currentSemester, semesters, registration, loading, submitting, error } = useSelector((s) => s.semester);
  return {
    currentSemester, semesters, registration, loading, submitting, error,
    loadCurrentSemester: useCallback(() => dispatch(fetchCurrentSemester()), [dispatch]),
    loadAllSemesters: useCallback(() => dispatch(fetchAllSemesters()), [dispatch]),
    submitRegistration: useCallback(() => dispatch(submitRegistration()), [dispatch]),
  };
};