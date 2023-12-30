import * as RadixPopover from "@radix-ui/react-popover";
import { IconCalendar } from "@tabler/icons-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { IconButton } from "./IconButton";

type TProps = {
  onChangeValue?(value: Date): void;
  value?: Date;
};

export const ClickupDatePicker = ({ onChangeValue, value }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date?: Date) => {
    setIsOpen(false);

    if (!date) return;
    onChangeValue?.(date);
  };

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger asChild>
        <IconButton icon={<IconCalendar />} />
      </RadixPopover.Trigger>

      <RadixPopover.Content
        side="bottom"
        sideOffset={5}
        className="bg-grey-900 p-3 rounded-sm text-grey-100 shadow-xl z-[1001]"
      >
        <RadixPopover.Arrow className="fill-grey-900" />

        <DayPicker
          mode="single"
          initialFocus
          showOutsideDays={true}
          selected={value}
          onSelect={handleSelect}
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-grey-100/70 rounded-md w-8 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day: "h-7 w-7 p-0 m-0.5 font-normal aria-selected:opacity-100",
            day_range_start: "day-range-start",
            day_range_end: "day-range-end",
            day_selected: "text-grey-100 bg-brand rounded-sm",
            day_today: "bg-grey-600 text-grey-100/70 rounded-sm",
            day_outside:
              "day-outside text-grey-100/30 opacity-50  aria-selected:bg-grey-600/50 aria-selected:text-grey-100/30 aria-selected:opacity-30",
            day_disabled: "text-grey-100/30 opacity-50",
            day_range_middle:
              "aria-selected:bg-grey-600 aria-selected:text-grey-100/70",
            day_hidden: "invisible",
          }}
        />
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};
