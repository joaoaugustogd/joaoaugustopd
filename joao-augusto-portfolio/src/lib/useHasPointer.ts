import { useEffect, useState } from "react";

/**
 * True only on devices with a real, hoverable pointer.
 * Gates the custom cursor and magnetic hover so touch users get native
 * behaviour instead of a broken imitation of it.
 */
export function useHasPointer(): boolean {
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setHasPointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return hasPointer;
}
