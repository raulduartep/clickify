import { ReactNode } from 'react'
import { TClockifyProject, TClockifyTag, TClockifyTimeEntry, TClockifyUser } from 'src/schemas/clockify'

export type TStorageContextValues = {
  tags?: TClockifyTag[]
  runningEntry?: TClockifyTimeEntry
  apiKey?: string
  user?: TClockifyUser
  projects?: TClockifyProject[]
  isFirstTime?: boolean
}

export type TStorageContextData = {
  values: TStorageContextValues
  hasAllValues: boolean
  isLoaded: boolean
  setStorage: (partialValues: Partial<TStorageContextValues>) => Promise<void>
  getStorage: () => Promise<TStorageContextValues>
  removeStorage: (keys: keyof TStorageContextValues | (keyof TStorageContextValues)[]) => Promise<void>
}

export type TStorageProviderProps = {
  children: ReactNode
}
