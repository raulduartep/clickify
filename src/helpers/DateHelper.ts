import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

export class DateHelper {
  static formattedDuration(start: string, end: string) {
    const [startHour, startMinutes] = start.split(":");
    const [endHour, endMinutes] = end.split(":");

    const startDate = dayjs
      .utc()
      .set("hours", Number(startHour ?? 0))
      .set("minutes", Number(startMinutes ?? 0))
      .set("seconds", 0);

    const endDate = dayjs
      .utc()
      .set("hours", Number(endHour ?? 0))
      .set("minutes", Number(endMinutes ?? 0))
      .set("seconds", 0);

    const diff = dayjs.duration(endDate.diff(startDate));
    const diffFormatted = diff.format("HH:mm:ss");

    return {
      diffFormatted,
      diffInSeconds: diff.asSeconds(),
    };
  }

  static formatDurationInSeconds(durationInSeconds: number) {
    return dayjs.duration(durationInSeconds, "seconds").format("HH:mm:ss");
  }

  static autoCompleteTime(time: string) {
    const splitTime = time.split(":");
    const hours = splitTime[0] ?? "";
    const minutes = splitTime[1] ?? "";

    let formattedHours = hours.padEnd(2, "0");
    let formattedMinutes = minutes.padEnd(2, "0");

    const MAX_HOUR = 23;
    const MAX_MINUTE = 59;

    if (Number(formattedHours) > MAX_HOUR) {
      formattedHours = MAX_HOUR.toString();
    }

    if (Number(formattedMinutes) > MAX_MINUTE) {
      formattedMinutes = MAX_MINUTE.toString();
    }

    return `${formattedHours}:${formattedMinutes}`;
  }
}

export class DateUTCHelper {
  static formattedNowDateTime() {
    return dayjs.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  }

  static editTimeFromLocalAndFormatDateTime(
    from: string,
    newHour: number,
    newMinutes: number,
    newSeconds: number
  ) {
    return dayjs
      .utc(from)
      .local()
      .set("hours", newHour)
      .set("minutes", newMinutes)
      .set("seconds", newSeconds)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
  }

  static formatLocalDateTimeToUTC(date: string | Date, time: string) {
    const splitTime = time.split(":");
    const hours = splitTime[0] ?? "";
    const minutes = splitTime[1] ?? "";

    return dayjs(date)
      .set("hours", Number(hours))
      .set("minutes", Number(minutes))
      .set("seconds", 0)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
  }
}

export class DateLocalHelper {
  static formattedNowTime() {
    return dayjs().local().format("HH:mm");
  }

  static formatDate(date: string | Date) {
    return dayjs(date).toDate().toLocaleDateString().replace(/\//g, "-");
  }

  static formatUtcDateTimeToLocalFormattedTime(date: string | Date) {
    return dayjs.utc(date).local().format("HH:mm");
  }

  static formatUtcDateTimeToLocalFormattedDate(date: string | Date) {
    return dayjs.utc(date).toDate().toLocaleDateString().replace(/\//g, "-");
  }

  static formatUtcDateTimeToLocalDate(date: string | Date) {
    return dayjs.utc(date).toDate();
  }
}
