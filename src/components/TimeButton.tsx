import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IconClockPlay, IconClockStop } from "@tabler/icons-react";

import {
  TGetUserResponse,
  TTimeEntryResponse,
  createNewTimeEntry,
  getLastTimeEntry,
  stopRunningTimeEntry,
} from "../services/clockify";
import { Container } from "./Container";
import { StyleHelper } from "../helpers/StyleHelper";
import { TClockifyProjectWithClickupList } from "./Popup";

dayjs.extend(utc);

export const TimeButton = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const runningEntryRef = useRef<TTimeEntryResponse>();
  const storageApiKeyRef = useRef<string>();
  const storageUserRef = useRef<TGetUserResponse>();
  const storageProjectsRef = useRef<TClockifyProjectWithClickupList[]>();

  const generateTimeEntryDescription = useCallback(() => {
    const taskNameElement = document.querySelector("#task-name");
    if (!taskNameElement) {
      throw new Error("Task name element not found");
    }

    const taskName = taskNameElement.textContent ?? "";
    const [, , taskId] = document.location.pathname.split("/");

    return `#${taskId} - ${taskName}`;
  }, []);

  const getProject = () => {
    const storageProjects = storageProjectsRef.current;
    if (!storageProjects) return;

    const clickupListNames = Array.from(
      document.querySelectorAll("cu-task-list-name")
    )
      .map((element) => element.textContent?.replace(/^\s+|\s+$/g, ""))
      .filter((name): name is string => !!name);

    const foundProject = storageProjects.find((project) => {
      return (
        clickupListNames.includes(project.name) ||
        project.clickupListNames.some((name) => clickupListNames.includes(name))
      );
    });
    return foundProject;
  };

  async function handlePlay() {
    try {
      if (!storageApiKeyRef.current || !storageUserRef.current) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      const start = dayjs.utc().format("YYYY-MM-DDTHH:mm:ssZ");
      const description = generateTimeEntryDescription();
      const project = getProject();
      const createdTimeEntry = await createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          projectId: project?.id,
        },
        config: {
          apiKey: storageApiKeyRef.current,
          workspaceId: storageUserRef.current.activeWorkspace,
        },
      });

      setIsRunning(true);
      runningEntryRef.current = createdTimeEntry;
    } catch (error: any) {
      console.error("ClickClock Extension Error: " + error.message);
    }
  }

  async function handleStop() {
    try {
      if (!storageApiKeyRef.current || !storageUserRef.current) {
        throw new Error(
          "API Key or User not found. You need to open the extension popup and set your API Key."
        );
      }

      const formattedNow = dayjs.utc().format("YYYY-MM-DDTHH:mm:ssZ");

      try {
        await stopRunningTimeEntry({
          body: {
            end: formattedNow,
          },
          userId: storageUserRef.current.id,
          config: {
            apiKey: storageApiKeyRef.current,
            workspaceId: storageUserRef.current.activeWorkspace,
          },
        });
      } catch {
        /* empty */
      }

      setIsRunning(false);
    } catch (error: any) {
      console.error("ClickClock Extension Error: " + error.message);
    }
  }

  const init = useCallback(async () => {
    const { apiKey, user, projects } = await chrome.storage.local.get([
      "apiKey",
      "user",
      "projects",
    ]);

    if (apiKey === undefined || user === undefined || projects === undefined) {
      console.error(
        "ClickClock Extension Error: API Key, User or Projects not found. You need to open the extension popup and set your API Key."
      );
      return;
    }

    storageApiKeyRef.current = apiKey;
    storageUserRef.current = user;
    storageProjectsRef.current = projects;

    try {
      const lastTimeEntry = await getLastTimeEntry({
        apiKey,
        workspaceId: user.activeWorkspace,
        userId: user.id,
      });

      if (lastTimeEntry.timeInterval.end || lastTimeEntry.timeInterval.duration)
        return;

      const description = generateTimeEntryDescription();
      if (description !== lastTimeEntry.description) return;

      runningEntryRef.current = lastTimeEntry;
      setIsRunning(true);
    } finally {
      setIsStarted(true);
    }
  }, [generateTimeEntryDescription]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") return;

      if (changes.apiKey) storageApiKeyRef.current = changes.apiKey.newValue;
      if (changes.user) storageUserRef.current = changes.user.newValue;
      if (changes.projects)
        storageProjectsRef.current = changes.projects.newValue;
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  return (
    <Container>
      <button
        className={StyleHelper.mergeStyles(
          "rounded-full border  border-dashed w-7 h-7 p-1.5 mx-4 group  transition-colors",
          {
            "border-red-500": isRunning,
            "border-brand": !isRunning,
            "cursor-pointer hover:border-opacity-60": isStarted,
            "opacity-50 cursor-not-allowed": !isStarted,
          }
        )}
        disabled={!isStarted}
        onClick={isRunning ? handleStop : handlePlay}
      >
        {isRunning ? (
          <IconClockStop className="w-full h-full stroke-red-500 stroke-1 group-hover:stroke-red-500/60 transition-colors" />
        ) : (
          <IconClockPlay className="w-full h-full stroke-brand stroke-1 group-hover:stroke-brand/60 transition-colors" />
        )}
      </button>
    </Container>
  );
};
