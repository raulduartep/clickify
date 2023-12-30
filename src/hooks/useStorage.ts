import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  TClockifyGetTagResponse,
  TClockifyGetUserResponse,
  TClockifyProjectWithClickupList,
  TClockifyTimeEntryResponse,
} from "../@types/services";

type TStorageValues = {
  tags: TClockifyGetTagResponse[];
  runningEntry?: TClockifyTimeEntryResponse | null;
  apiKey?: string | null;
  user?: TClockifyGetUserResponse | null;
  projects?: TClockifyProjectWithClickupList[] | null;
};

export const useStorage = () => {
  const [values, setValues] = useState<TStorageValues>({
    tags: [],
  });

  const hasAllValues = useMemo(() => {
    return !!(values.apiKey && values.user && values.projects && values.tags);
  }, [values]);

  const setStorage = useCallback(
    async (partialValues: Partial<TStorageValues>) => {
      await chrome.storage.local.set(partialValues);
      setValues((prev) => ({
        ...prev,
        ...partialValues,
      }));
    },
    []
  );

  useLayoutEffect(() => {
    chrome.storage.local
      .get(["apiKey", "user", "projects", "tags", "runningEntry"])
      .then((storage) => {
        setValues((prev) => ({
          ...prev,
          ...storage,
        }));
      });
  }, []);

  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") return;

      const newValues = Object.entries(changes).reduce((acc, [key, value]) => {
        acc[key] = value.newValue;
        return acc;
      }, {} as any);

      setValues((prev) => ({
        ...prev,
        ...newValues,
      }));
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  return {
    values,
    hasAllValues,
    setStorage,
  };
};

export const useLazyStorage = () => {
  const getStorage = useCallback(async (): Promise<TStorageValues> => {
    return (await chrome.storage.local.get([
      "apiKey",
      "user",
      "projects",
      "tags",
      "runningEntry",
    ])) as any;
  }, []);

  return {
    getStorage,
  };
};
