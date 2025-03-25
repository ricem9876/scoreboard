import { useState, useRef, useEffect } from "react";

function useTimeClock() {
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start the clock
  const start = () => {
    if (!isRunning && !intervalRef.current) {
      setIsRunning(true);
      startTimeRef.current = new Date() - elapsedTime * 1000; // Adjust for already elapsed time
      intervalRef.current = setInterval(() => {
        const now = new Date();
        setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
      }, 1000);
    }
  };

  // Pause the clock
  const pause = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };

  // Reset the clock
  const reset = () => {
    pause();
    setElapsedTime(0);
  };

  // Cleanup interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format the elapsed time as mm:ss
  const formatTime = () => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return { time: formatTime(), start, pause, reset, isRunning };
}

export default useTimeClock;
