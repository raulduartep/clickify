import { useInfiniteQuery } from '@tanstack/react-query'

import { useClockifyEntryService } from './use-clockify-entry-service'

export const USE_COMPLETED_ENTRIES_LIST_QUERY_KEY = 'completed-entries-list'

export const useCompletedEntriesList = (taskId?: string) => {
  const { getEntries } = useClockifyEntryService()

  const query = useInfiniteQuery({
    queryKey: taskId ? [USE_COMPLETED_ENTRIES_LIST_QUERY_KEY, taskId] : [USE_COMPLETED_ENTRIES_LIST_QUERY_KEY],
    queryFn: ({ pageParam }) =>
      getEntries({
        inProgress: false,
        description: taskId,
        page: pageParam,
      }),
    getNextPageParam: lastPage => lastPage.page + 1,
    initialPageParam: 1,
  })

  return query
}
