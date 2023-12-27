import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export class ClockifyHelper {
  static isClockifyTrackerUrl(url: string): boolean {
    return /^https:\/\/app.clockify.me\/tracker$/.test(url);
  }

  static generateFormattedNow() {
    return dayjs.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  }

  static generateFormattedDateTime(from: string, newHour: number, newMinutes: number, newSeconds: number) {
    return dayjs
      .utc(from)
      .local()
      .set("hours", newHour)
      .set("minutes", newMinutes)
      .set("seconds", newSeconds)
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss[Z]");
  }
}
