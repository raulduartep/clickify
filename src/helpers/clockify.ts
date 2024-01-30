export class ClockifyHelper {
  static isClockifyTrackerUrl(url: string): boolean {
    return /^https:\/\/app.clockify.me\/tracker$/.test(url);
  }
}
