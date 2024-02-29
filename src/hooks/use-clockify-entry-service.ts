import { useCallback, useEffect, useRef } from 'react'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { clockifyTimeEntrySchema, TClockifyTimeEntry } from 'src/schemas/clockify'

import { ClickupHelper } from '@helpers/clickup'
import {
  TAddTimeEntryParams,
  TEditEntryParams,
  TGetTimeEntriesParams,
  TGetTimeEntriesResponse,
  TStartEntryParams,
} from '@interfaces/use-clockify'
import { createClockifyAxios } from '@services/clockify'

import { USE_COMPLETED_ENTRIES_LIST_QUERY_KEY } from './use-completed-entries-list'
import { useStorage } from './use-storage'

export const useClockifyEntryService = () => {
  const { values, setStorage, removeStorage } = useStorage()
  const queryClient = useQueryClient()

  const clockifyAxiosRef = useRef(createClockifyAxios())

  const getEntries = useCallback(
    async ({ description, inProgress, page }: TGetTimeEntriesParams): Promise<TGetTimeEntriesResponse> => {
      const { data } = await clockifyAxiosRef.current.get(`user/${values.user?.id}/time-entries`, {
        params: {
          page,
          description,
          'in-progress': inProgress,
        },
      })

      const parsedData = clockifyTimeEntrySchema.array().parse(data)

      return {
        data: parsedData,
        page: page ?? 1,
      }
    },
    [values.user]
  )

  const playEntry = useCallback(
    async ({ description, projectId, tagId }: TStartEntryParams) => {
      const start = new Date().toISOString()

      const { data } = await clockifyAxiosRef.current.post('time-entries', {
        start,
        description,
        projectId,
        tagIds: tagId ? [tagId] : undefined,
      })

      const parsedData = clockifyTimeEntrySchema.parse(data)
      await setStorage({ runningEntry: parsedData })

      return parsedData
    },
    [setStorage]
  )

  const stopEntry = useCallback(async () => {
    try {
      const end = new Date().toISOString()
      const { data } = await clockifyAxiosRef.current.patch(`user/${values.user?.id}/time-entries`, {
        end,
      })

      const stoppedTimeEntry = clockifyTimeEntrySchema.parse(data)

      const updater = (data: InfiniteData<TGetTimeEntriesResponse, unknown> | undefined) => {
        if (!data) return

        return {
          ...data,
          pages: [
            {
              ...data.pages[0],
              data: [stoppedTimeEntry, ...data.pages[0].data],
            },
            ...data.pages.slice(1),
          ],
        }
      }

      queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], updater)

      const taskId = ClickupHelper.getClickupIdFromText(stoppedTimeEntry.description)
      if (taskId) queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY, taskId], updater)

      return stoppedTimeEntry
    } finally {
      removeStorage('runningEntry')
    }
  }, [values.user, removeStorage, queryClient])

  const deleteTimeEntry = useCallback(
    async (entry: TClockifyTimeEntry) => {
      try {
        await clockifyAxiosRef.current.delete(`time-entries/${entry.id}`)
      } finally {
        if (values.runningEntry?.id === entry.id) {
          removeStorage('runningEntry')
        }

        const updater = (data: InfiniteData<TGetTimeEntriesResponse, unknown> | undefined) => {
          if (!data) return

          return {
            ...data,
            pages: data.pages.map(page => ({
              ...page,
              data: page.data.filter(item => item.id !== entry.id),
            })),
          }
        }

        queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], updater)

        const taskId = ClickupHelper.getClickupIdFromText(entry.description)
        queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY, taskId], updater)
      }
    },
    [queryClient, removeStorage, values.runningEntry]
  )

  const editTimeEntry = useCallback(
    async ({ description, end, id, start, projectId, tagId }: TEditEntryParams) => {
      const utcStart = start.toISOString()
      const utcEnd = end?.toISOString()

      const { data } = await clockifyAxiosRef.current.put(`time-entries/${id}`, {
        end: utcEnd,
        start: utcStart,
        description,
        projectId,
        tagIds: tagId ? [tagId] : undefined,
      })

      const editedEntry = clockifyTimeEntrySchema.parse(data)

      const updater = (data: InfiniteData<TGetTimeEntriesResponse, unknown> | undefined) => {
        if (!data) return

        return {
          ...data,
          pages: data.pages.map((page: any) => ({
            ...page,
            data: page.data.map((entry: any) => (entry.id === id ? editedEntry : entry)),
          })),
        }
      }

      queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], updater)

      const taskId = ClickupHelper.getClickupIdFromText(editedEntry.description)
      if (taskId) queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY, taskId], updater)

      return editedEntry
    },
    [queryClient]
  )

  const addTimeEntry = useCallback(
    async ({ description, end, start, projectId, tagId }: TAddTimeEntryParams) => {
      const utcStart = start.toISOString()
      const utcEnd = end.toISOString()

      const { data } = await clockifyAxiosRef.current.post('time-entries', {
        start: utcStart,
        end: utcEnd,
        description,
        projectId,
        tagIds: tagId ? [tagId] : undefined,
      })

      const createdEntry = clockifyTimeEntrySchema.parse(data)

      const updater = (data: InfiniteData<TGetTimeEntriesResponse, unknown> | undefined) => {
        if (!data) return

        return {
          ...data,
          pages: [
            {
              ...data.pages[0],
              data: [createdEntry, ...data.pages[0].data],
            },
            ...data.pages.slice(1),
          ],
        }
      }

      queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], updater)

      const taskId = ClickupHelper.getClickupIdFromText(createdEntry.description)
      if (taskId) queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY, taskId], updater)

      return createdEntry
    },
    [queryClient]
  )

  useEffect(() => {
    clockifyAxiosRef.current = createClockifyAxios(values.apiKey, `/workspaces/${values.user?.activeWorkspace}`)
  }, [values.apiKey, values.user])

  return {
    playEntry,
    stopEntry,
    deleteTimeEntry,
    editTimeEntry,
    addTimeEntry,
    getEntries,
  }
}
