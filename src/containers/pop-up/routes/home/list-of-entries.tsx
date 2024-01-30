import { useMemo } from 'react'
import { IconRefresh } from '@tabler/icons-react'

import { Button } from '@components/button'
import { IconButton } from '@components/icon-button'
import { Loader } from '@components/loader'
import { DateHelper, DateUTCHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useEntriesList } from '@hooks/use-entries-list'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

import { ItemOfListOfEntries } from './item-of-list-of-entries'

type TAggregatedDataByDate = Record<
  string,
  {
    entries: TClockifyTimeEntryResponse[]
    duration: number
  }
>

export const ListOfEntries = () => {
  const { data, isLoading, refetch, isRefetching, fetchNextPage, isFetchingNextPage } = useEntriesList()

  const aggregatedData = useMemo(() => {
    if (!data) return

    const flattenData = data.pages.flatMap(page => page.data)
    const aggregateDataByDate = flattenData.reduce((acc, entry) => {
      const date = DateUTCHelper.editTimeFromLocalAndFormatDateTime(entry.timeInterval.start, 0, 0, 0)
      const duration = DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)

      if (!acc[date]) {
        acc[date] = {
          entries: [entry],
          duration: duration,
        }
        return acc
      }

      acc[date].entries.push(entry)
      acc[date].duration += duration

      return acc
    }, {} as TAggregatedDataByDate)

    const sortedDates = Object.keys(aggregateDataByDate).sort((a, b) => {
      return DateUTCHelper.isBefore(a, b) ? 1 : -1
    })

    return {
      aggregateDataByDate,
      sortedDates,
    }
  }, [data])

  const handleRefresh = () => {
    refetch()
  }

  const handleNextPage = () => {
    fetchNextPage()
  }

  return (
    <main className="px-6 py-4 flex flex-col min-h-0  flex-grow">
      <div className="flex justify-between">
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
        <div className="flex justify-center mt-6">
          <Loader className="w-6 h-6" />
        </div>
      ) : !aggregatedData ? (
        <div className="flex justify-center mt-6 text-grey-500">
          <p>No Entries</p>
        </div>
      ) : (
        <ul className="flex-grow overflow-y-scroll flex flex-col min-h-0 gap-2 mt-2">
          {aggregatedData.sortedDates.map(date => (
            <ItemOfListOfEntries key={date} date={date} {...aggregatedData.aggregateDataByDate[date]} />
          ))}

          <Button label="Load more" className="mt-2" onClick={handleNextPage} loading={isFetchingNextPage} />
        </ul>
      )}
    </main>
  )
}
