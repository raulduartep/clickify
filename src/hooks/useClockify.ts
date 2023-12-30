import { useCallback } from "react";
import { TClickupVersion } from "../@types/clickup";
import {
  TClockifyEditTimeEntryBodyParam,
  TClockifyGetTagResponse,
} from "../@types/services";
import { ClickupHelper } from "../helpers/ClickupHelper";
import { DateUTCHelper } from "../helpers/DateHelper";
import { ClockifyService } from "../services/ClockifyService";
import { useStorage } from "./useStorage";

export const useClockify = (version: TClickupVersion) => {
  const { values, hasAllValues, setStorage } = useStorage();

  const playEntry = useCallback(
    async (tag?: TClockifyGetTagResponse) => {
      if (!values.apiKey || !values.user || !values.projects) {
        throw new Error(
          "API Key, User or Projects not found. You need to open the extension popup and set your API Key."
        );
      }

      const start = DateUTCHelper.formattedNowDateTime();
      const description = ClickupHelper.getCurrentTimeEntryDescription(version);
      const project = ClickupHelper.getCurrentProject(values.projects, version);

      const createdTimeEntry = await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          projectId: project?.id,
          tagIds: tag ? [tag.id] : [],
        },
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      });

      setStorage({ runningEntry: createdTimeEntry });
    },
    [setStorage, values.apiKey, values.user, values.projects, version]
  );

  const stopEntry = useCallback(async () => {
    try {
      if (!values.apiKey || !values.user) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      const end = DateUTCHelper.formattedNowDateTime();
      await ClockifyService.stopRunningTimeEntry({
        body: {
          end,
        },
        userId: values.user.id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      });
    } finally {
      setStorage({ runningEntry: null });
    }
  }, [values.apiKey, values.user, setStorage]);

  const addManualEntry = useCallback(
    async (start: string, end: string) => {
      if (!values.apiKey || !values.user || !values.projects) {
        throw new Error(
          "API Key, User or Projects not found. You need to open the extension popup and set your API Key."
        );
      }

      const description = ClickupHelper.getCurrentTimeEntryDescription(version);
      const project = ClickupHelper.getCurrentProject(values.projects, version);

      await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          end,
          projectId: project?.id,
        },
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      });
    },
    [version, values.apiKey, values.user, values.projects]
  );

  const editTimeEntry = useCallback(
    async (id: string, body: TClockifyEditTimeEntryBodyParam) => {
      if (!values.apiKey || !values.user) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      await ClockifyService.editTimeEntry({
        body,
        id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      });
    },
    [values.apiKey, values.user]
  );

  const deleteTimeEntry = useCallback(
    async (id: string) => {
      if (!values.apiKey || !values.user) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      await ClockifyService.deleteTimeEntry({
        id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      });
    },
    [values.apiKey, values.user]
  );

  return {
    playEntry,
    stopEntry,
    addManualEntry,
    editTimeEntry,
    deleteTimeEntry,
    values,
    hasAllValues,
  };
};
