import { useLayoutEffect, useState } from "react";
import { Button } from "../Button";
import { ClickupDatePicker } from "../ClickupDatePicker";
import { ClickupTimeInput } from "../ClickupTimeInput";
import { Input } from "../Input";
import {
  DateHelper,
  DateLocalHelper,
  DateUTCHelper,
} from "../../helpers/DateHelper";
import { useClockify } from "../../hooks/useClockify";
import { TClickupVersion } from "../../@types/clickup";
import { IconButton } from "../IconButton";
import { IconChevronLeft } from "@tabler/icons-react";
import { Separator } from "../Separator";
import { TClockifyTimeEntryResponse } from "../../@types/services";

type Props = {
  onClose(): void;
  onBack(): void;
  version: TClickupVersion;
  entryToEdit?: TClockifyTimeEntryResponse;
};

export const ClickupEditOrCreateContent = ({
  onClose,
  version,
  onBack,
  entryToEdit,
}: Props) => {
  const { addManualEntry, editTimeEntry } = useClockify(version);

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

      if (entryToEdit) {
        await editTimeEntry(entryToEdit.id, {
          start,
          end,
          customFields: entryToEdit.customFieldValues,
          description: entryToEdit.description,
          projectId: entryToEdit.projectId,
          tagIds: entryToEdit.tagIds,
          taskId: entryToEdit.taskId,
        });
        return;
      }

      await addManualEntry(start, end);
    } finally {
      setIsAdding(false);
      onClose();
    }
  };

  useLayoutEffect(() => {
    const duration = DateHelper.formattedDuration(startTime, endTime);

    setDuration(duration.diffFormatted);
    setDisabled(duration.diffInSeconds <= 0);
  }, [startTime, endTime]);

  useLayoutEffect(() => {
    if (!entryToEdit) {
      const nowTime = DateLocalHelper.formattedNowTime();
      setStartTime(nowTime);
      setEndTime(nowTime);
      setDate(new Date());
      return;
    }

    const startTime = DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
      entryToEdit.timeInterval.start
    );
    const endTime = DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
      entryToEdit.timeInterval.end
    );
    const date = DateLocalHelper.formatUtcDateTimeToLocalDate(
      entryToEdit.timeInterval.start
    );

    setStartTime(startTime);
    setEndTime(endTime);
    setDate(date);
  }, [entryToEdit]);

  return (
    <div className="flex flex-col w-full gap-2">
      <IconButton icon={<IconChevronLeft />} onClick={onBack} />

      <div className="flex flex-col gap-3 w-full">
        <div className="flex gap-2 w-full">
          <div className="flex gap-1 w-full">
            <ClickupTimeInput onChangeValue={setStartTime} value={startTime} />
            <span className="text-base !text-grey-600">-</span>
            <ClickupTimeInput onChangeValue={setEndTime} value={endTime} />
          </div>

          <ClickupDatePicker onChangeValue={setDate} value={date} />
        </div>

        <Separator />

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
      </div>
    </div>
  );
};
