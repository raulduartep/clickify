import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import { TTimeEntryResponse } from "../services/clockify";

dayjs.extend(duration);
dayjs.extend(utc);

type TProps = {
  runningEntry: TTimeEntryResponse;
};

export const CountUp = ({ runningEntry }: TProps) => {
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

    return () => clearInterval(interval);
  }, [calculateSeconds]);

  return (
    <p className="text-xs !text-red-500 min-w-[3.5rem] max-w-[3.5rem]">
      {formatted}
    </p>
  );
};
