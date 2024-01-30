import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'

import { ClickupHelper } from '@helpers/clickup'
import { ClockifyService } from '@services/clockify'

import { useStorage } from './use-storage'

export const USE_CURRENT_ENTRIES_LIST_QUERY_KEY = 'current-entries-list'

export const useCurrentEntriesList = () => {
  const { getStorage } = useStorage()
  const currentTaskId = useMemo(() => ClickupHelper.getCurrentTaskId(), [])

  const list = useCallback(async () => {
    const values = await getStorage()

    if (!values.apiKey || !values.user) throw new Error('Missing API key or user')

    return ClockifyService.getEntries({
      apiKey: values.apiKey,
      workspaceId: values.user.activeWorkspace,
      description: currentTaskId,
      userId: values.user.id,
    })
  }, [getStorage, currentTaskId])

  const query = useQuery([USE_CURRENT_ENTRIES_LIST_QUERY_KEY, currentTaskId], list)

  return query
}
