import { ClockifyHelper } from '@helpers/clockify'
import { DateUTCHelper } from '@helpers/date'
import { UtilsHelper } from '@helpers/utils'
import { ClockifyService } from '@services/clockify'

console.info('Clickify Extension Info: content script loaded')

let url = document.location.href
let appButtonsObserver: MutationObserver | null = null

const handleStartButtonClick = async () => {
  const { apiKey, user } = await chrome.storage.local.get(['apiKey', 'user', 'projects', 'tags'])

  if (apiKey === undefined || user === undefined) return

  // Waiting for the time entry to be created
  await UtilsHelper.sleep(100)

  const runningEntry = await ClockifyService.getLastTimeEntry({
    apiKey: apiKey,
    userId: user.id,
    workspaceId: user.activeWorkspace,
  })

  if (runningEntry.timeInterval.end || runningEntry.timeInterval.duration) throw new Error('Time entry already ended')

  await chrome.storage.local.set({
    runningEntry,
  })
}

const handleStopButtonClick = async () => {
  await chrome.storage.local.remove(['runningEntry'])
  return
}

const functionByButtonName: Record<string, () => Promise<void>> = {
  start: handleStartButtonClick,
  stop: handleStopButtonClick,
  discard: handleStopButtonClick,
}

const handleTimeChange = async (event: HTMLElementEventMap['change']) => {
  const { runningEntry } = await chrome.storage.local.get(['runningEntry'])
  if (!runningEntry) return

  const element = event.target as HTMLInputElement
  const [hour, minutes] = element.value.split(':')

  const start = DateUTCHelper.editTimeFromLocalAndFormatDateTime(
    runningEntry.timeInterval.start,
    Number(hour),
    Number(minutes),
    0
  )

  await chrome.storage.local.set({
    runningEntry: {
      ...runningEntry,
      timeInterval: {
        ...runningEntry.timeInterval,
        start,
      },
    },
  })
}

const handleDescriptionChange = async (event: HTMLElementEventMap['change']) => {
  const { runningEntry } = await chrome.storage.local.get(['runningEntry'])
  if (!runningEntry) return

  const element = event.target as HTMLInputElement

  await chrome.storage.local.set({
    runningEntry: {
      ...runningEntry,
      description: element.title ?? '',
    },
  })
}

const handleTimeButtonClick = async (event: HTMLElementEventMap['click']) => {
  const element = event.target as HTMLElement
  const buttonText = element.childNodes[0].textContent?.trim().toLowerCase()
  if (!buttonText) return

  const titleElement = document.querySelector('input.cl-input-timetracker-main') as HTMLInputElement | null
  if (!titleElement) return

  const func = functionByButtonName[buttonText]
  if (func) {
    await func()
    return
  }
}

const watchTimeTracker = async () => {
  appButtonsObserver = new MutationObserver(() => {
    const elements = document.querySelectorAll('app-button')
    const elementArray = Array.from(elements)
    const filteredElementArray = elementArray.reduce((acc, element) => {
      if (!element.parentElement || acc.some(accElement => accElement.parentElement === element.parentElement))
        return acc

      return [...acc, element]
    }, [] as Element[])
    filteredElementArray.forEach(element => {
      element.parentElement?.removeEventListener('click', handleTimeButtonClick, true)

      element.parentElement?.addEventListener('click', handleTimeButtonClick, true)
    })

    const dropdownMenu = document.querySelectorAll('.cl-dropdown-item')
    const dropdownMenuArray = Array.from(dropdownMenu) as HTMLElement[]
    dropdownMenuArray.forEach(element => {
      element.addEventListener('click', handleStartButtonClick, true)
    })

    const updateTimeInputElement = document.querySelector('.cl-stopwatch-dropdown-input input')
    if (updateTimeInputElement) {
      updateTimeInputElement.addEventListener('change', handleTimeChange, true)
    }
  })

  const observerElement = await UtilsHelper.waitForElement('time-tracker-recorder')

  appButtonsObserver.observe(observerElement, {
    subtree: true,
    childList: true,
  })

  const titleElement = document.querySelector('input.cl-input-timetracker-main')
  if (titleElement) {
    titleElement.addEventListener('change', handleDescriptionChange, true)
  }
}

const unwatchTimeTracker = async () => {
  appButtonsObserver?.disconnect()

  const appButtonElements = document.querySelectorAll('app-button')
  appButtonElements.forEach(element => {
    element.parentElement?.removeEventListener('click', handleTimeButtonClick, true)
  })

  const dropdownMenu = document.querySelectorAll('.cl-dropdown-item')
  const dropdownMenuArray = Array.from(dropdownMenu)

  dropdownMenuArray.forEach(element => {
    element.removeEventListener('click', () => {}, true)
  })

  const titleElement = document.querySelector('input.cl-input-timetracker-main')
  if (titleElement) {
    titleElement.removeEventListener('change', handleDescriptionChange, true)
  }

  const updateTimeInputElement = document.querySelector('.cl-stopwatch-dropdown-input input')
  if (updateTimeInputElement) {
    updateTimeInputElement.addEventListener('change', handleTimeChange, true)
  }
}

const init = async () => {
  if (ClockifyHelper.isClockifyTrackerUrl(url)) {
    watchTimeTracker()
  }

  const observer = new MutationObserver(() => {
    if (url === document.location.href) return
    url = document.location.href

    if (ClockifyHelper.isClockifyTrackerUrl(url)) {
      watchTimeTracker()
      return
    }

    unwatchTimeTracker()
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

init()
