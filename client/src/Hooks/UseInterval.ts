import { useEffect, useRef } from "react";

const UseInterval = (callbackFunc: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();
  useEffect(() => {
    savedCallback.current = callbackFunc;
  }, [callbackFunc]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (typeof savedCallback.current !== "undefined") {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default UseInterval;
