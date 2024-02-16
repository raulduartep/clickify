import { TClockifyTimeEntry } from 'src/schemas/clockify'

export type TStartEntryParams = {
  tagId?: string
  projectId?: string
  description?: string
}

export type TEditEntryParams = {
  id: string
  end?: Date
  start: Date
  description: string
  projectId?: string
  tagId?: string
}

export type TAddTimeEntryParams = {
  description: string
  start: Date
  end: Date
  projectId?: string
  tagId?: string
}

export type TGetTimeEntriesParams = {
  description?: string
  page?: number
  inProgress?: boolean
}

export type TGetTimeEntriesResponse = {
  data: TClockifyTimeEntry[]
  page: number
}
