import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { TClockifyTimeEntryResponse } from "../@types/services";

dayjs.extend(duration);
dayjs.extend(utc);

type TProps = {
  runningEntry: TClockifyTimeEntryResponse;
};

export const ClickupCountUp = ({ runningEntry }: TProps) => {
  const [seconds, setSeconds] = useState(0);

  const formatted = dayjs.duration(seconds, "seconds").format("HH:mm:ss");

  const calculateSeconds = useCallback(() => {
    const entryDate = dayjs.utc(runningEntry.timeInterval.start);
    const now = dayjs.utc();

    const diff = now.diff(entryDate, "seconds");
    setSeconds(diff);
  }, [runningEntry]);

  useEffect(() => {
    calculateSeconds();

    window.addEventListener("focus", calculateSeconds);

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.removeEventListener("focus", calculateSeconds);
      clearInterval(interval);
    };
  }, [calculateSeconds]);

  return <p className="text-2xs text-center !text-red-500">{formatted}</p>;
};
