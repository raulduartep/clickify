import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { ClickupHelper } from "../helpers/ClickupHelper";
import { useLazyStorage } from "./useStorage";
import { ClockifyService } from "../services/ClockifyService";

export const useCurrentEntriesList = () => {
  const { getStorage } = useLazyStorage();
  const currentTaskId = useMemo(() => ClickupHelper.getCurrentTaskId(), []);

  const list = useCallback(async () => {
    const values = await getStorage();

    if (!values.apiKey || !values.user)
      throw new Error("Missing API key or user");

    return ClockifyService.getAllEntriesByTaskId({
      apiKey: values.apiKey,
      workspaceId: values.user.activeWorkspace,
      taskId: currentTaskId,
      userId: values.user.id,
    });
  }, [getStorage, currentTaskId]);

  const query = useQuery(["current-entries-list", currentTaskId], list);

  return query;
};
