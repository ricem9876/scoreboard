import { useEffect } from "react";

export function useWakeLock() {
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
          console.log("Wake Lock is active");
        } else {
          console.warn("Wake Lock API is not supported in this browser.");
        }
      } catch (err) {
        console.error(`Wake Lock request failed: ${err.name}, ${err.message}`);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        try {
          wakeLock = await navigator.wakeLock.request("screen");
        } catch (err) {
          console.error(
            `Wake Lock re-acquire failed: ${err.name}, ${err.message}`
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          console.log("Wake Lock released");
          wakeLock = null;
        });
      }
    };
  }, []);
}
