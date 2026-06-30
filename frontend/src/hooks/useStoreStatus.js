import { useEffect, useState } from 'react';
import { getStoreStatusMessage, isStoreOpen } from '../lib/store-hours';

export function useStoreStatus() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const storeOpen = isStoreOpen(now);

  return {
    now,
    storeOpen,
    statusMessage: getStoreStatusMessage(now),
  };
}
