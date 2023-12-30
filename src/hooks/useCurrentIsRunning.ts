import { useMemo } from "react";
import { useStorage } from "./useStorage";
import { ClickupHelper } from "../helpers/ClickupHelper";

export const useCurrentIsRunning = () => {
  const {
    values: { runningEntry },
  } = useStorage();

  const isRunning = useMemo(() => {
    if (!runningEntry) {
      return false;
    }

    const currentClickupTaskId = ClickupHelper.getCurrentTaskId();
    const clickupIdFromText = ClickupHelper.getClickupIdFromText(
      runningEntry.description
    );

    if (!clickupIdFromText || clickupIdFromText !== currentClickupTaskId) {
      return false;
    }

    return true;
  }, [runningEntry]);

  return isRunning;
};
