import { useCallback, useEffect, useState } from "react";

import { Container } from "./Container";
import { ClickupTimeButton } from "./ClickupTimeButton";
import {
  TClockifyGetTagResponse,
  TClockifyGetUserResponse,
  TClockifyProjectWithClickupList,
  TClockifyTimeEntryResponse,
} from "../@types/services";
import { ClickupHelper } from "../helpers/ClickupHelper";
import { ClockifyService } from "../services/ClockifyService";
import { ClockifyHelper } from "../helpers/ClockifyHelper";
import { TClickupVersion } from "../@types/clickup";

type TProps = {
  version: TClickupVersion;
};

export const ClickupContainer = ({ version }: TProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [tags, setTags] = useState<TClockifyGetTagResponse[]>([]);
  const [runningEntry, setRunningEntry] =
    useState<TClockifyTimeEntryResponse>();
  const [apiKey, setApiKey] = useState<string>();
  const [user, setUser] = useState<TClockifyGetUserResponse>();
  const [projects, setProjects] = useState<TClockifyProjectWithClickupList[]>(
    []
  );

  const disabled = !apiKey || !user || !projects || !tags;

  async function handlePlay(tag?: TClockifyGetTagResponse) {
    try {
      if (!apiKey || !user || !projects) {
        throw new Error(
          "API Key, User or Projects not found. You need to open the extension popup and set your API Key."
        );
      }

      const start = ClockifyHelper.generateFormattedNow();
      const description = ClickupHelper.getCurrentTimeEntryDescription(version);
      const project = ClickupHelper.getCurrentProject(projects, version);

      const createdTimeEntry = await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          projectId: project?.id,
          tagIds: tag ? [tag.id] : [],
        },
        config: {
          apiKey: apiKey,
          workspaceId: user.activeWorkspace,
        },
      });
      setRunningEntry(createdTimeEntry);
      await chrome.storage.local.set({ runningEntry: createdTimeEntry });
      setIsRunning(true);
    } catch (error: any) {
      console.error("Clickify Extension Error: " + error.message);
    }
  }

  async function handleStop() {
    try {
      if (!apiKey || !user) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      const end = ClockifyHelper.generateFormattedNow();
      await ClockifyService.stopRunningTimeEntry({
        body: {
          end,
        },
        userId: user.id,
        config: {
          apiKey: apiKey,
          workspaceId: user.activeWorkspace,
        },
      });
      await chrome.storage.local.remove(["runningEntry"]);
    } catch (error: any) {
      console.error("Clickify Extension Error: " + error.message);
    } finally {
      setIsRunning(false);
      setRunningEntry(undefined);
    }
  }

  const checkRunningStorageEntry = useCallback(
    async (runningEntry?: TClockifyTimeEntryResponse) => {
      try {
        if (!runningEntry) {
          throw new Error();
        }

        const currentClickupTaskId = ClickupHelper.getCurrentTaskId();
        const clickupIdFromText = ClickupHelper.getClickupIdFromText(
          runningEntry.description
        );

        if (!clickupIdFromText || clickupIdFromText !== currentClickupTaskId) {
          throw new Error();
        }

        setRunningEntry(runningEntry);
        setIsRunning(true);
      } catch {
        setIsRunning(false);
        setRunningEntry(undefined);
        return;
      }
    },
    []
  );

  useEffect(() => {
    chrome.storage.local
      .get(["apiKey", "user", "projects", "tags", "runningEntry"])
      .then((storage) => {
        if (storage.apiKey) setApiKey(storage.apiKey);
        if (storage.user) setUser(storage.user);
        if (storage.projects) setProjects(storage.projects);
        if (storage.tags) setTags(storage.tags);
        checkRunningStorageEntry(storage.runningEntry);
      });
  }, [checkRunningStorageEntry]);

  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") return;

      if (changes.apiKey) setApiKey(changes.apiKey.newValue);
      if (changes.user) setUser(changes.user.newValue);
      if (changes.projects) setProjects(changes.projects.newValue);
      if (changes.tags) setTags(changes.tags.newValue);
      if (changes.runningEntry)
        checkRunningStorageEntry(changes.runningEntry.newValue);
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [checkRunningStorageEntry]);

  return (
    <Container>
      <ClickupTimeButton
        tags={tags}
        isRunning={isRunning}
        disabled={disabled}
        onPlay={handlePlay}
        onStop={handleStop}
        runningEntry={runningEntry}
        version={version}
      />
    </Container>
  );
};
