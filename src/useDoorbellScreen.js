import { useEffect, useState } from "react";
import { subscribe, getState } from "./doorbellFeed";

export function useDoorbellScreen() {
  const [state, setState] = useState(getState());

  useEffect(() => {
    const unsub = subscribe(setState);
    return unsub;
  }, []);

  const totalRingsToday = state.rings.length;

  const visibleVisitors = state.rings
    .filter((ring) => !ring.flagged)
    .sort((a, b) => b.timestamp - a.timestamp);

  const mostRecentRingOverall =
    state.rings[state.rings.length - 1] || null;

  return {
    totalRingsToday,
    visibleVisitors,
    mostRecentRingOverall,
    rawRings: state.rings,
  };
}