export class UtilsHelper {
  static async waitForElement(selector: string) {
    return new Promise<Element>((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const mutationElement = document.querySelector(selector);
        if (mutationElement) {
          resolve(mutationElement);
          observer.disconnect();
          return;
        }
      });

      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static extractFirstLetters(str: string) {
    return str
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }
}
