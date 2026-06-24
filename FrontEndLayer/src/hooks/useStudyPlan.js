import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchStudyPlan } from "../store/studyPlan/studyPlanThunks";
export const useStudyPlan = () => {
  const dispatch = useDispatch();
  const { studyPlan, loading, error } = useSelector((s) => s.studyPlan);
  return {
    studyPlan, loading, error,
    loadStudyPlan: useCallback(() => dispatch(fetchStudyPlan()), [dispatch]),
  };
};