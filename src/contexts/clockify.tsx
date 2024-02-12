import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'

import { ClickupHelper } from '@helpers/clickup'
import { DateHelper, DateUTCHelper } from '@helpers/date'
import { USE_CURRENT_ENTRIES_LIST_QUERY_KEY } from '@hooks/use-current-entries-list'
import { useStorage } from '@hooks/use-storage'
import { TClockifyContextData, TClockifyProviderProps } from '@interfaces/context'
import { TClockifyEditTimeEntryBodyParam, TClockifyGetTagResponse } from '@interfaces/services'
import { ClockifyService } from '@services/clockify'

export const ClockifyContext = createContext({} as TClockifyContextData)

export const ClockifyProvider = ({ children, version }: TClockifyProviderProps) => {
  const { values, setStorage, removeStorage } = useStorage()
  const queryClient = useQueryClient()

  const [runningSeconds, setRunningSeconds] = useState(0)

  const isRunning = useMemo(() => {
    if (!values.runningEntry) {
      return false
    }

    const currentClickupTaskId = ClickupHelper.getCurrentTaskId()
    const clickupIdFromText = ClickupHelper.getClickupIdFromText(values.runningEntry.description)

    if (!clickupIdFromText || clickupIdFromText !== currentClickupTaskId) {
      return false
    }

    return true
  }, [values.runningEntry])

  const playEntry = useCallback(
    async (tag?: TClockifyGetTagResponse) => {
      if (!values.apiKey || !values.user || !values.projects) {
        throw new Error(
          'API Key, User or Projects not found. You need to open the extension popup and set your API Key.'
        )
      }

      const start = DateUTCHelper.formattedNowDateTime()
      const description = ClickupHelper.getCurrentTimeEntryDescription(version)
      const project = ClickupHelper.getCurrentProject(values.projects, version)

      const createdTimeEntry = await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          projectId: project?.id,
          tagIds: tag ? [tag.id] : [],
        },
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })

      setStorage({ runningEntry: createdTimeEntry })
    },
    [setStorage, values.apiKey, values.user, values.projects, version]
  )

  const stopEntry = useCallback(async () => {
    try {
      if (!values.apiKey || !values.user) {
        throw new Error('API Key or User not found. You need to open the extension popup and set your API Key.')
      }

      const end = DateUTCHelper.formattedNowDateTime()
      await ClockifyService.stopRunningTimeEntry({
        body: {
          end,
        },
        userId: values.user.id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })
    } finally {
      removeStorage('runningEntry')
    }
  }, [values.apiKey, values.user, removeStorage])

  const addManualEntry = useCallback(
    async (start: string, end: string) => {
      if (!values.apiKey || !values.user || !values.projects) {
        throw new Error(
          'API Key, User or Projects not found. You need to open the extension popup and set your API Key.'
        )
      }

      const description = ClickupHelper.getCurrentTimeEntryDescription(version)
      const project = ClickupHelper.getCurrentProject(values.projects, version)

      await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description,
          start,
          end,
          projectId: project?.id,
        },
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })
    },
    [version, values.apiKey, values.user, values.projects]
  )

  const editTimeEntry = useCallback(
    async (id: string, body: TClockifyEditTimeEntryBodyParam) => {
      if (!values.apiKey || !values.user) {
        throw new Error('API Key or User not found. You need to open the extension popup and set your API Key.')
      }

      await ClockifyService.editTimeEntry({
        body,
        id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })
    },
    [values.apiKey, values.user]
  )

  const deleteTimeEntry = useCallback(
    async (id: string) => {
      if (!values.apiKey || !values.user) {
        throw new Error('API Key or User not found. You need to open the extension popup and set your API Key.')
      }

      await ClockifyService.deleteTimeEntry({
        id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })
    },
    [values.apiKey, values.user]
  )

  useEffect(() => {
    const runningEntry = values.runningEntry
    if (!isRunning || !runningEntry) return

    const calculateSeconds = () => {
      const duration = DateHelper.durationInSeconds(runningEntry.timeInterval.start)
      setRunningSeconds(duration)
    }

    calculateSeconds()
    window.addEventListener('focus', calculateSeconds)

    return () => {
      window.removeEventListener('focus', calculateSeconds)
    }
  }, [values.runningEntry, isRunning])

  useEffect(() => {
    if (!isRunning) {
      setRunningSeconds(0)
      return
    }

    const interval = setInterval(() => {
      setRunningSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [USE_CURRENT_ENTRIES_LIST_QUERY_KEY] })
  }, [values.runningEntry, queryClient])

  return (
    <ClockifyContext.Provider
      value={{
        isRunning,
        playEntry,
        stopEntry,
        addManualEntry,
        editTimeEntry,
        deleteTimeEntry,
        runningSeconds,
      }}
    >
      {children}
    </ClockifyContext.Provider>
  )
}
