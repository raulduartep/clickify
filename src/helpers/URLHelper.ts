export class URLHelper {
  static isClickupTaskUrl(url: string): boolean {
    return /^https:\/\/app.clickup.com\/t\/\w*$/.test(url);
  }

  static isClockifyTrackerUrl(url: string): boolean {
    return /^https:\/\/app.clockify.me\/tracker$/.test(url);
  }
}
