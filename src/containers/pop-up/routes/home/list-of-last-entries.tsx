import { IconRefresh } from '@tabler/icons-react'

import { Button } from '@components/button'
import { IconButton } from '@components/icon-button'
import { Loader } from '@components/loader'
import { DateUTCHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useCompletedEntriesList } from '@hooks/use-completed-entries-list'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

import { TableOfEntries } from './table-of-entries'

export const ListOfLastEntries = () => {
  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useCompletedEntriesList()

  const aggregatedData = data?.pages
    .flatMap(page => page.data)
    .reduce((acc, entry) => {
      const date = DateUTCHelper.editTimeFromLocalAndFormatDateTime(entry.timeInterval.start, 0, 0, 0)
      const last = acc.get(date) ?? []
      acc.set(date, [...last, entry])
      return acc
    }, new Map<string, TClockifyTimeEntryResponse[]>())

  const handleRefresh = () => {
    refetch()
  }

  const handleNextPage = () => {
    fetchNextPage()
  }

  return (
    <div className="flex flex-col min-h-0 mt-4">
      <div className="flex justify-between mb-2">
        <p className="font-bold text-sm text-grey-500">LAST ENTRIES</p>

        <IconButton
          icon={
            <IconRefresh
              className={StyleHelper.mergeStyles({
                'animate-spin': isRefetching,
              })}
            />
          }
          colorScheme="gray"
          size="lg"
          onClick={handleRefresh}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-4">
          <Loader className="w-6 h-6" />
        </div>
      ) : !aggregatedData ? (
        <div className="flex justify-center mt-4 text-grey-500">
          <p>No Entries</p>
        </div>
      ) : (
        <ul className="flex-grow overflow-y-scroll flex flex-col min-h-0 gap-2 -mr-4">
          {Array.from(aggregatedData).map(([date, entries]) => (
            <TableOfEntries key={date} date={date} entries={entries} />
          ))}

          <Button className="mt-2" onClick={handleNextPage} loading={isFetchingNextPage}>
            Load more
          </Button>
        </ul>
      )}
    </div>
  )
}
