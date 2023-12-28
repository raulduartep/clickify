import { KeyboardEvent, useEffect, useLayoutEffect, useState } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { IconClockEdit } from "@tabler/icons-react";
import { StyleHelper } from "../helpers/StyleHelper";
import { Input } from "./Input";
import { Button } from "./Button";
import { ClickupDatePicker } from "./ClickupDatePicker";
import {
  DateHelper,
  DateLocalHelper,
  DateUTCHelper,
} from "../helpers/DateHelper";
import { TClickupVersion } from "../@types/clickup";

type TTimeInputProps = {
  onChangeValue: (value: string) => void;
};

type TProps = {
  onAdd: (start: string, end: string) => Promise<void> | void;
  version: TClickupVersion;
};

const TimeInput = ({ onChangeValue }: TTimeInputProps) => {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleBlur();
    }
  };

  const handleBlur = () => {
    const formattedValue = DateHelper.autoCompleteTime(value);
    setValue(formattedValue);
    onChangeValue(formattedValue);
  };

  useLayoutEffect(() => {
    const now = DateLocalHelper.formattedNowTime();
    setValue(now);
    onChangeValue(now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      value={value}
      flat
      className="text-center"
      mask="99:99"
    />
  );
};

export const ClickupInputTimeButton = ({ onAdd, version }: TProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState(new Date());

  const [duration, setDuration] = useState("00:00:00");
  const [disabled, setDisabled] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = async () => {
    try {
      setIsAdding(true);

      const start = DateUTCHelper.formatLocalDateTimeToUTC(date, startTime);
      const end = DateUTCHelper.formatLocalDateTimeToUTC(date, endTime);
      await onAdd(start, end);
    } finally {
      setIsAdding(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const duration = DateHelper.formattedDuration(startTime, endTime);

    setDuration(duration.diffFormatted);
    setDisabled(duration.diffInSeconds <= 0);
  }, [startTime, endTime]);

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger asChild>
        <button
          className={StyleHelper.mergeStyles(
            "px-1 gap-1 hover:bg-brand/20 cursor-pointer rounded-md border border-dashed w-fit h-7 flex items-center border-brand"
          )}
        >
          <IconClockEdit className="w-6 h-6 !stroke-brand stroke-1" />
        </button>
      </RadixPopover.Trigger>

      <RadixPopover.Content
        side={version === "v2" ? "bottom" : "left"}
        align={version === "v2" ? "end" : "start"}
        sideOffset={5}
        className=" bg-grey-800 rounded-md text-xs flex flex-col z-[1000] shadow-lg py-2 px-4 gap-4 items-center w-56"
      >
        <RadixPopover.Arrow className="fill-grey-800" />

        <div className="flex gap-2 w-full">
          <div className="flex gap-1 w-full">
            <TimeInput onChangeValue={setStartTime} />
            <span className="text-base !text-grey-600">-</span>
            <TimeInput onChangeValue={setEndTime} />
          </div>

          <ClickupDatePicker onChangeValue={setDate} value={date} />
        </div>

        <div className="w-4/5 h-px bg-grey-600" />

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 w-full items-center">
            <Input
              className="w-full text-center"
              readOnly
              flat
              value={duration}
            />
            <span className="text-base !text-grey-600">-</span>
            <span className="text-xs !text-grey-100 whitespace-nowrap">
              {DateLocalHelper.formatDate(date)}
            </span>
          </div>
          <Button
            label="Add"
            flat
            disabled={disabled}
            onClick={handleAddClick}
            loading={isAdding}
          />
        </div>
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};
