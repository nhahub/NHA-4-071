import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchExams } from "../store/exam/examThunks";
export const useExam = () => {
  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((s) => s.exam);
  return {
    exams, loading, error,
    loadExams: useCallback(() => dispatch(fetchExams()), [dispatch]),
  };
};