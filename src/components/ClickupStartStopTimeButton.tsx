import { useState } from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconClockPlay,
  IconClockStop,
} from "@tabler/icons-react";
import * as RadixPopover from "@radix-ui/react-popover";

import { Container } from "./Container";
import { StyleHelper } from "../helpers/StyleHelper";
import { ClickupCountUp } from "./ClickupCountUp";
import { TClockifyGetTagResponse } from "../@types/services";
import { TClickupVersion } from "../@types/clickup";
import { useClockify } from "../hooks/useClockify";
import { useCurrentIsRunning } from "../hooks/useCurrentIsRunning";

type TProps = {
  version: TClickupVersion;
};

export const ClickupStartStopTimeButton = ({ version }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playEntry, stopEntry, hasAllValues, values } = useClockify(version);
  const isRunning = useCurrentIsRunning();
  const selectIsDisabled = !hasAllValues || isRunning;

  const handleClick = () => {
    if (isRunning) {
      stopEntry();
      return;
    }

    playEntry();
  };

  const handleTagClick = (tag: TClockifyGetTagResponse) => {
    setIsOpen(false);
    playEntry(tag);
  };

  return (
    <Container>
      <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col relative">
          <div
            className={StyleHelper.mergeStyles(
              "rounded-md border border-dashed flex items-center",
              {
                "flex-col w-auto": version === "v3",
                "h-7 w-fit": version === "v2",
                "border-red-500": isRunning,
                "border-brand": !isRunning,
                "border-opacity-50": !hasAllValues,
              }
            )}
          >
            <button
              className={StyleHelper.mergeStyles("flex gap-1 items-center", {
                "cursor-pointer": hasAllValues,
                "hover:bg-brand/20": hasAllValues && !isRunning,
                "hover:bg-red-500/20": hasAllValues && isRunning,
                "opacity-50 cursor-not-allowed": !hasAllValues,
                "px-1": version === "v2",
                "p-1 flex-col": version === "v3",
              })}
              disabled={!hasAllValues}
              onClick={handleClick}
            >
              {isRunning ? (
                <IconClockStop className="w-6 h-6 !stroke-red-500 stroke-1" />
              ) : (
                <IconClockPlay className="w-6 h-6 !stroke-brand stroke-1" />
              )}
            </button>

            <div
              className={StyleHelper.mergeStyles(
                "border-dashed  border-brand",
                {
                  "h-full border-l ": version === "v2",
                  "w-full border-b": version === "v3",
                  "opacity-50": selectIsDisabled,
                }
              )}
            />

            <RadixPopover.Trigger asChild disabled={selectIsDisabled}>
              <button
                className={StyleHelper.mergeStyles("flex px-1 py-0.5", {
                  "h-full items-center": version === "v2",
                  "w-full justify-center": version === "v3",
                  "cursor-pointer hover:bg-brand/20": !selectIsDisabled,
                  "opacity-50 cursor-not-allowed": selectIsDisabled,
                })}
              >
                {version === "v2" ? (
                  <IconChevronDown className="w-3 h-3 stroke-brand" />
                ) : (
                  <IconChevronLeft className="w-3 h-3 stroke-brand" />
                )}
              </button>
            </RadixPopover.Trigger>
          </div>

          {values.runningEntry && isRunning && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full">
              <ClickupCountUp runningEntry={values.runningEntry} />
            </div>
          )}
        </div>

        <RadixPopover.Content
          side={version === "v2" ? "bottom" : "left"}
          align={version === "v2" ? "end" : "start"}
          sideOffset={5}
          className="bg-grey-800 rounded-md text-xs flex flex-col z-[1000] shadow-lg p-1 gap-1 min-w-[9rem]"
        >
          <RadixPopover.Arrow className="fill-grey-800" />

          {values.tags.map((tag) => (
            <button
              className="py-1 w-full px-4 text-center rounded-sm !text-grey-100 font-bold hover:bg-grey-100/10"
              onClick={handleTagClick.bind(null, tag)}
            >
              {tag.name}
            </button>
          ))}
        </RadixPopover.Content>
      </RadixPopover.Root>
    </Container>
  );
};
