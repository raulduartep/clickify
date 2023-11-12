export class URLHelper {
  static isClickupUrl(url: string): boolean {
    return /^https:\/\/app.clickup.com/.test(url)
  }

  static isClickupTaskUrl(url: string): boolean {
    return /^https:\/\/app.clickup.com\/t\/\w*$/.test(url)
  }
}