import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchSchedule } from "../store/schedule/scheduleThunks";
export const useSchedule = () => {
  const dispatch = useDispatch();
  const { schedule, loading, error } = useSelector((s) => s.schedule);
  return {
    schedule, loading, error,
    loadSchedule: useCallback(() => dispatch(fetchSchedule()), [dispatch]),
  };
};