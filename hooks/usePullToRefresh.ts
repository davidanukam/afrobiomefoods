import { useCallback, useState } from "react";

const MIN_SPINNER_MS = 450;

/** Pull-to-refresh state with a short minimum spinner so local reloads still feel like a refresh. */
export function usePullToRefresh(load?: () => Promise<void> | void) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const started = Date.now();
    try {
      await load?.();
    } finally {
      const wait = MIN_SPINNER_MS - (Date.now() - started);
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
      setRefreshing(false);
    }
  }, [load]);

  return { refreshing, onRefresh };
}
