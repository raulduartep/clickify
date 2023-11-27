import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  IconChevronDown,
  IconClockPlay,
  IconClockStop,
} from "@tabler/icons-react";
import * as RadixPopover from "@radix-ui/react-popover";

import {
  TGetTagResponse,
  TGetUserResponse,
  TTimeEntryResponse,
  createNewTimeEntry,
  stopRunningTimeEntry,
} from "../services/clockify";
import { Container } from "./Container";
import { StyleHelper } from "../helpers/StyleHelper";
import { TClockifyProjectWithClickupList } from "./Popup";
import { UtilsHelper } from "../helpers/UtilsHelper";

dayjs.extend(utc);

const getTaskName = () => {
  const taskNameElement = document.querySelector("#task-name");
  if (!taskNameElement) {
    throw new Error("Task name element not found");
  }

  return taskNameElement.textContent ?? "";
};

const getTaskId = () => {
  const [, , taskId] = document.location.pathname.split("/");
  return taskId;
};

const generateTimeEntryDescription = () => {
  return `#${getTaskId()} - ${getTaskName()}`;
};

export const TimeButton = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(true);

  const [allTags, setAllTags] = useState<TGetTagResponse[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const runningEntryRef = useRef<TTimeEntryResponse>();
  const storageApiKeyRef = useRef<string>();
  const storageUserRef = useRef<TGetUserResponse>();
  const storageProjectsRef = useRef<TClockifyProjectWithClickupList[]>();

  const selectIsDisabled = !isStarted || isRunning || !allTags;

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

  async function handlePlay(tag?: TGetTagResponse) {
    try {
      setIsOpen(false);

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
          tagIds: tag ? [tag.id] : [],
        },
        config: {
          apiKey: storageApiKeyRef.current,
          workspaceId: storageUserRef.current.activeWorkspace,
        },
      });
      runningEntryRef.current = createdTimeEntry;
      await chrome.storage.local.set({ runningEntry: createdTimeEntry });
      setIsRunning(true);
    } catch (error: any) {
      console.error("Clickify Extension Error: " + error.message);
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
        await chrome.storage.local.remove(["runningEntry"]);
      } catch {
        /* empty */
      }

      setIsRunning(false);
    } catch (error: any) {
      console.error("Clickify Extension Error: " + error.message);
    }
  }

  const checkRunningStorageEntry = useCallback(
    async (runningEntry?: TTimeEntryResponse) => {
      if (!runningEntry) {
        setIsRunning(false);
        return;
      }

      const currentClickupTaskId = getTaskId();
      const clickupIdFromText = UtilsHelper.getClickupIdFromText(
        runningEntry.description
      );
      console.log({ clickupIdFromText, currentClickupTaskId });
      if (!clickupIdFromText || clickupIdFromText !== currentClickupTaskId) {
        setIsRunning(false);
        return;
      }

      runningEntryRef.current = runningEntry;
      setIsRunning(true);
    },
    []
  );

  const init = useCallback(async () => {
    try {
      const { apiKey, user, projects, tags, runningEntry } =
        await chrome.storage.local.get([
          "apiKey",
          "user",
          "projects",
          "tags",
          "runningEntry",
        ]);

      if (
        apiKey === undefined ||
        user === undefined ||
        projects === undefined ||
        tags === undefined
      )
        throw new Error(
          "API Key, User or Projects not found. You need to open the extension popup and set your API Key."
        );

      storageApiKeyRef.current = apiKey;
      storageUserRef.current = user;
      storageProjectsRef.current = projects;
      setAllTags(tags);
      setIsStarted(true);

      checkRunningStorageEntry(runningEntry);
    } catch (error: any) {
      console.error("Clickify Extension Error: " + error.message);
    }
  }, [checkRunningStorageEntry]);

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
      if (changes.tags) setAllTags(changes.tags.newValue);

      if (changes.runningEntry) {
        checkRunningStorageEntry(changes.runningEntry.newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [checkRunningStorageEntry]);

  return (
    <Container>
      <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={StyleHelper.mergeStyles(
            "rounded-md border border-dashed w-fit h-7 transition-colors flex items-center mx-4",
            {
              "border-red-500": isRunning,
              "border-brand": !isRunning,
            }
          )}
        >
          <button
            className={StyleHelper.mergeStyles("px-1", {
              "cursor-pointer hover:bg-brand/20": isStarted,
              "opacity-50 cursor-not-allowed": !isStarted,
            })}
            disabled={!isStarted}
            onClick={() => (isRunning ? handleStop() : handlePlay())}
          >
            {isRunning ? (
              <IconClockStop className="w-full h-full stroke-red-500 stroke-1" />
            ) : (
              <IconClockPlay className="w-full h-full stroke-brand stroke-1" />
            )}
          </button>

          <div
            className={StyleHelper.mergeStyles(
              "border-l border-dashed  h-full border-brand",
              {
                "opacity-50": selectIsDisabled,
              }
            )}
          />

          <RadixPopover.Trigger asChild disabled={selectIsDisabled}>
            <button
              className={StyleHelper.mergeStyles(
                "flex items-center px-1 py-0.5 h-full",
                {
                  "cursor-pointer hover:bg-brand/20": !selectIsDisabled,
                  "opacity-50 cursor-not-allowed": selectIsDisabled,
                }
              )}
            >
              <IconChevronDown className="w-3 h-3 stroke-brand" />
            </button>
          </RadixPopover.Trigger>
        </div>

        <RadixPopover.Content
          side="bottom"
          align="end"
          sideOffset={5}
          className=" bg-brand rounded-md text-xs flex flex-col z-50 overflow-hidden p-1 gap-1"
        >
          <RadixPopover.Arrow className="fill-brand" />
          {allTags.map((tag) => (
            <button
              className="py-1 w-full px-4 text-center rounded-sm !text-gray-800 font-bold hover:bg-gray-800/20"
              onClick={() => handlePlay(tag)}
            >
              {tag.name}
            </button>
          ))}
        </RadixPopover.Content>
      </RadixPopover.Root>
    </Container>
  );
};
