export class UtilsHelper {
  static async waitForElement(selector: string) {
    return new Promise<Element>(resolve => {
      const element = document.querySelector(selector)
      if (element) {
        return resolve(element)
      }

      const observer = new MutationObserver(() => {
        const mutationElement = document.querySelector(selector)
        if (mutationElement) {
          resolve(mutationElement)
          observer.disconnect()
          return
        }
      })

      observer.observe(document.body, {
        subtree: true,
        childList: true,
      })
    })
  }

  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static extractFirstLetters(str: string) {
    return str
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  static wrapAsyncFunction(listener: (message: any, sender: chrome.runtime.MessageSender) => Promise<any>) {
    return (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      // the listener(...) might return a non-promise result (not an async function), so we wrap it with Promise.resolve()
      Promise.resolve(listener(message, sender)).then(sendResponse)
      return true // return true to indicate you want to send a response asynchronously
    }
  }
}
