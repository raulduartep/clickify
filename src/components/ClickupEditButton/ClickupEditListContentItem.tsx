import { IconEdit, IconTrash } from "@tabler/icons-react";
import { TClockifyTimeEntryResponse } from "../../@types/services";
import { DateHelper, DateLocalHelper } from "../../helpers/DateHelper";
import { IconButton } from "../IconButton";
import * as RadixPopover from "@radix-ui/react-popover";
import { Button } from "../Button";

type TProps = {
  entry: TClockifyTimeEntryResponse;
  onEdit(entry: TClockifyTimeEntryResponse): void;
  onDelete(entry: TClockifyTimeEntryResponse): void;
};

export const ClickupEditListContentItem = ({
  entry,
  onEdit,
  onDelete,
}: TProps) => {
  const formattedStart = DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
    entry.timeInterval.start
  );

  const formattedEnd = DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
    entry.timeInterval.end
  );

  const formattedDate = DateLocalHelper.formatUtcDateTimeToLocalFormattedDate(
    entry.timeInterval.start
  );

  const formattedDuration = DateHelper.formattedDuration(
    formattedStart,
    formattedEnd
  ).diffFormatted;

  const handleEdit = () => {
    onEdit(entry);
  };

  const handleDeleteClick = () => {
    onDelete(entry);
  };

  return (
    <li className="flex items-center justify-between gap-1">
      <div className="flex gap-1">
        <span>{formattedStart}</span>
        <span className="!text-gray-600">-</span>
        <span>{formattedEnd}</span>
        <span className="!text-gray-600">-</span>
        <span>{formattedDate}</span>
        <span className="!text-gray-600">|</span>
        <span>{formattedDuration}</span>
      </div>

      <IconButton icon={<IconEdit />} onClick={handleEdit} />

      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <IconButton
            icon={<IconTrash />}
            className="bg-transparent border-2 border-red-800 hover:bg-red-800/10 !text-red-800"
          />
        </RadixPopover.Trigger>

        <RadixPopover.Content className="bg-grey-900 rounded-md text-xs z-[1001] shadow-lg py-3 px-4">
          <RadixPopover.Arrow className="fill-grey-900" />

          <Button
            label="Confirm"
            className="bg-red-800"
            onClick={handleDeleteClick}
          />
        </RadixPopover.Content>
      </RadixPopover.Root>
    </li>
  );
};
