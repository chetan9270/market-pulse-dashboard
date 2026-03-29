"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        setValue(JSON.parse(storedValue) as T);
      }
    } catch (error) {
      console.error(`Unable to hydrate ${key} from localStorage`, error);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to persist ${key} to localStorage`, error);
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
