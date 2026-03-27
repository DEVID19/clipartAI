import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pollStatus } from '../store/slices/generationSlice';
import { addHistoryItem } from '../store/slices/historySlice';

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 3 * 60 * 1000; // 3 minutes

export const useGenerationPoller = () => {
  const dispatch = useDispatch();
  const { sessionId, overallStatus, styleResults, selectedImage } = useSelector(
    (s) => s.generation
  );

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    if (!sessionId) return;

    // Timeout guard
    if (Date.now() - startTimeRef.current > MAX_POLL_DURATION_MS) {
      stopPolling();
      return;
    }

    dispatch(pollStatus(sessionId));
  }, [sessionId, dispatch, stopPolling]);

  useEffect(() => {
    const shouldPoll = overallStatus === 'processing';
    const isDone = ['completed', 'partial', 'failed'].includes(overallStatus);

    if (shouldPoll && sessionId && !intervalRef.current) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    }

    if (isDone) {
      stopPolling();

      // Add to history if there are any completed results
      const completedStyles = styleResults.filter((r) => r.resultUrl);
      if (completedStyles.length > 0 && selectedImage) {
        dispatch(
          addHistoryItem({
            id: sessionId,
            timestamp: Date.now(),
            thumbnail: selectedImage.uri,
            styles: completedStyles.map((r) => ({
              style: r.style,
              label: r.label,
              resultUrl: r.resultUrl,
            })),
          })
        );
      }
    }

    return stopPolling;
  }, [overallStatus, sessionId, poll, stopPolling, styleResults, selectedImage, dispatch]);
};
