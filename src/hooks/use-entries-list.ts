import { useCallback } from 'react'
import { useInfiniteQuery } from 'react-query'

import { ClockifyService } from '@services/clockify'

import { useStorage } from './use-storage'

export const USE_ENTRIES_LIST_QUERY_KEY = 'entries-list'

export const useEntriesList = () => {
  const { getStorage } = useStorage()

  const list = useCallback(async (page = 1) => {
    const values = await getStorage()

    if (!values.apiKey || !values.user) throw new Error('Missing API key or user')

    const data = await ClockifyService.getEntries({
      apiKey: values.apiKey,
      workspaceId: values.user.activeWorkspace,
      userId: values.user.id,
      page
    })

    return {
      data,
      page
    }
  }, [getStorage])

  const query = useInfiniteQuery({
    queryKey: [USE_ENTRIES_LIST_QUERY_KEY],
    queryFn: ({ pageParam }) => list(pageParam),
    getNextPageParam: (lastPage) => lastPage.page + 1,
    refetchOnWindowFocus: false,
    staleTime: Infinity,

  })

  return query
}
