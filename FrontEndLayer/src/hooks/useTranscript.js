import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { fetchTranscript } from "../store/transcript/transcriptThunks";
export const useTranscript = () => {
  const dispatch = useDispatch();
  const { transcript, loading, error } = useSelector((s) => s.transcript);
  return {
    transcript, loading, error,
    loadTranscript: useCallback(() => dispatch(fetchTranscript()), [dispatch]),
  };
};