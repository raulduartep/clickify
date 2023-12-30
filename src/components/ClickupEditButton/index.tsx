import { useEffect, useState } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { IconClockEdit } from "@tabler/icons-react";
import { StyleHelper } from "../../helpers/StyleHelper";

import { TClickupVersion } from "../../@types/clickup";
import { ClickupEditOrCreateContent } from "./ClickupEditOrCreateContent";
import { useStorage } from "../../hooks/useStorage";
import { ClickupEditListContent } from "./ClickupEditListContent";
import { TClockifyTimeEntryResponse } from "../../@types/services";
import { useCurrentIsRunning } from "../../hooks/useCurrentIsRunning";

type TProps = {
  version: TClickupVersion;
};

type TStepRoute = {
  route: "list" | "createOrEdit";
  state?: any;
};

export const ClickupEditButton = ({ version }: TProps) => {
  const { hasAllValues } = useStorage();
  const isRunning = useCurrentIsRunning();

  const disabled = !hasAllValues || isRunning;

  const [isOpen, setIsOpen] = useState(false);

  const [stepRoute, setStepRoute] = useState<TStepRoute>({
    route: "list",
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBack = () => {
    setStepRoute({
      route: "list",
    });
  };

  const handleNewEntryClick = () => {
    setStepRoute({
      route: "createOrEdit",
    });
  };

  const handleEdit = (entry: TClockifyTimeEntryResponse) => {
    setStepRoute({
      route: "createOrEdit",
      state: {
        entry,
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setStepRoute({
        route: "list",
      });
    }
  }, [isOpen]);

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger asChild>
        <button
          className={StyleHelper.mergeStyles(
            "px-1 gap-1 hover:bg-brand/20 cursor-pointer rounded-md border border-dashed w-fit h-7 flex items-center border-brand",
            {
              "opacity-50 cursor-not-allowed": disabled,
            }
          )}
          disabled={disabled}
        >
          <IconClockEdit className="w-6 h-6 !stroke-brand stroke-1" />
        </button>
      </RadixPopover.Trigger>

      <RadixPopover.Content
        side={version === "v2" ? "bottom" : "left"}
        align={version === "v2" ? "center" : "start"}
        sideOffset={5}
        className=" bg-grey-800 rounded-md text-xs flex flex-col z-[1000] shadow-lg py-3 px-4 items-center w-[20rem]"
      >
        <RadixPopover.Arrow className="fill-grey-800" />

        {stepRoute.route === "list" ? (
          <ClickupEditListContent
            onNewEntryClick={handleNewEntryClick}
            onEdit={handleEdit}
            version={version}
          />
        ) : (
          <ClickupEditOrCreateContent
            version={version}
            onClose={handleClose}
            onBack={handleBack}
            entryToEdit={stepRoute.state?.entry}
          />
        )}
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};
