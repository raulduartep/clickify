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

  static getClickupIdFromText(text: string): string | undefined {
    const regexCU = /CU-([a-z]+|\d+)+\b/g;
    const matchesCU = text.match(regexCU);

    if (matchesCU && matchesCU.length > 0) {
      return matchesCU[0].replace("CU-", "");
    }

    const regexSharp = /#([a-z]+|\d+)+\b/g;
    const matchesSharp = text.match(regexSharp);

    if (matchesSharp && matchesSharp.length > 0) {
      return matchesSharp[0].replace("#", "");
    }

    let textRefined = text;
    let matchesPure;
    let attempts = 0;
    do {
      const regexPure = /\b([a-z]+|\d+){7,}\b/g;
      matchesPure = textRefined.match(regexPure);
      if (matchesPure && matchesPure.length) {
        const foundMatch = matchesPure[0].match(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/g
        );
        if (foundMatch) {
          return foundMatch[0];
        }

        textRefined = textRefined.replace(matchesPure[0], "");
      }
      attempts++;
    } while (matchesPure && attempts < 4);

    return undefined;
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
