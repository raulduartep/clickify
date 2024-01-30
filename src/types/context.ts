import { ReactNode } from 'react'

import { TClickupVersion } from './clickup'
import {
  TClockifyEditTimeEntryBodyParam,
  TClockifyGetTagResponse,
  TClockifyGetUserResponse,
  TClockifyProjectWithClickupList,
  TClockifyTimeEntryResponse,
} from './services'

export type TClockifyContextData = {
  isRunning: boolean
  runningSeconds: number
  playEntry: (tag?: TClockifyGetTagResponse) => Promise<void>
  stopEntry: () => Promise<void>
  addManualEntry: (start: string, end: string) => Promise<void>
  editTimeEntry: (id: string, body: TClockifyEditTimeEntryBodyParam) => Promise<void>
  deleteTimeEntry: (id: string) => Promise<void>
}

export type TClockifyProviderProps = {
  children: ReactNode
  version: TClickupVersion
}

export type TStorageContextValues = {
  tags: TClockifyGetTagResponse[] | null
  runningEntry: TClockifyTimeEntryResponse | null
  apiKey: string | null
  user: TClockifyGetUserResponse | null
  projects: TClockifyProjectWithClickupList[] | null
}

export type TStorageContextData = {
  values: TStorageContextValues
  hasAllValues: boolean
  setStorage: (partialValues: Partial<TStorageContextValues>) => Promise<void>
  getStorage: () => Promise<TStorageContextValues>
}

export type TStorageProviderProps = {
  children: ReactNode
}
