import { useEffect, useState } from "react";
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

  useEffect(() => {
    const entryDate = dayjs.utc(runningEntry.timeInterval.start);
    const now = dayjs.utc();

    const diff = now.diff(entryDate, "seconds");
    setSeconds(diff);

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [runningEntry]);

  return <p className="text-xs !text-red-500">{formatted}</p>;
};
