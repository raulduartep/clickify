import { TClockifyProject } from 'src/schemas/clockify'

import { TClickupVersion } from '@interfaces/clickup'

import { EnvHelper } from './env'
import { UtilsHelper } from './utils'

class ClickupV2Helper {
  static getCurrentTaskName(): string {
    const taskNameElement = document.querySelector('#task-name')
    if (!taskNameElement) {
      throw new Error('Task name element not found')
    }

    return taskNameElement.textContent ?? ''
  }

  static getProjectsElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('cu-task-breadcrumbs cu-task-list-name')
  }
}

class ClickupV3Helper {
  static getCurrentTaskName(): string {
    console.log('aaaaaaa')
    const taskNameElement = document.querySelector('.cu-task-title__overlay')
    console.log({ taskNameElement })
    if (!taskNameElement) {
      throw new Error('Task name element not found')
    }

    return taskNameElement.textContent ?? ''
  }

  static getProjectsElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll('.cu-task-view-breadcrumbs__text')
  }
}

export class ClickupHelper {
  private static helperByVersion: Record<TClickupVersion, typeof ClickupV2Helper> = {
    v2: ClickupV2Helper,
    v3: ClickupV3Helper,
  }

  static isClickupTaskUrl(url: string): boolean {
    return /^https:\/\/app.clickup.com\/t\/\w*$/.test(url)
  }

  static async getClickupVersion(): Promise<TClickupVersion> {
    const htmlElement = await UtilsHelper.waitForElement('.cu-v2, .cu-v3')
    const version = htmlElement.className.includes('cu-v2') ? 'v2' : 'v3'
    return version
  }

  static getClickupIdFromText(text: string): string | undefined {
    const regexCU = /CU-([a-z]+|\d+)+\b/g
    const matchesCU = text.match(regexCU)

    if (matchesCU && matchesCU.length > 0) {
      return matchesCU[0].replace('CU-', '')
    }

    const regexSharp = /#([a-z]+|\d+)+\b/g
    const matchesSharp = text.match(regexSharp)

    if (matchesSharp && matchesSharp.length > 0) {
      return matchesSharp[0].replace('#', '')
    }

    let textRefined = text
    let matchesPure
    let attempts = 0
    do {
      const regexPure = /\b([a-z]+|\d+){7,}\b/g
      matchesPure = textRefined.match(regexPure)
      if (matchesPure && matchesPure.length) {
        const foundMatch = matchesPure[0].match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/g)
        if (foundMatch) {
          return foundMatch[0]
        }

        textRefined = textRefined.replace(matchesPure[0], '')
      }
      attempts++
    } while (matchesPure && attempts < 4)

    return undefined
  }

  static getCurrentTaskName(version: TClickupVersion): string {
    if (EnvHelper.DEV) {
      return EnvHelper.VITE_TEST_CLICKUP_TASK_NAME
    }

    return this.helperByVersion[version].getCurrentTaskName()
  }

  static getCurrentTaskId() {
    if (EnvHelper.DEV) {
      return EnvHelper.VITE_TEST_CLICKUP_TASK_ID
    }

    const [, , taskId] = document.location.pathname.split('/')
    return taskId
  }

  static getCurrentTimeEntryDescription(version: TClickupVersion) {
    return `#${this.getCurrentTaskId()} - ${this.getCurrentTaskName(version)}`
  }

  static getCurrentProject(allProjects: TClockifyProject[], version: TClickupVersion) {
    let clickupListNames: string[]

    if (EnvHelper.DEV) {
      clickupListNames = [EnvHelper.VITE_TEST_CLICKUP_TASK_PROJECT_NAME]
    } else {
      clickupListNames = Array.from(this.helperByVersion[version].getProjectsElements())
        .map(element => element.textContent?.replace(/^\s+|\s+$/g, '').toLowerCase())
        .filter((name): name is string => !!name)
    }

    const foundProject = allProjects.find(project => {
      return (
        clickupListNames.includes(project.name.toLowerCase()) ||
        project.listNames.some(name => clickupListNames.includes(name.toLowerCase()))
      )
    })
    return foundProject
  }
}
