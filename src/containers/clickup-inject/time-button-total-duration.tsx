import { useMemo } from 'react'

import { Loader } from '@components/loader'
import { DateHelper } from '@helpers/date'
import { useCompletedEntriesList } from '@hooks/use-completed-entries-list'

type TProps = {
  runningSeconds: number
  currentTaskId: string
}

export const ClickupInjectTimeButtonTotalDuration = ({ currentTaskId, runningSeconds }: TProps) => {
  const { data, isLoading } = useCompletedEntriesList(currentTaskId)

  const duration = useMemo(() => {
    let total = 0

    if (data) {
      total = data.pages[0].data.reduce((acc, entry) => {
        const duration = DateHelper.durationInSeconds(entry.timeInterval.end as string, entry.timeInterval.start)
        return acc + duration
      }, 0)
    }

    return total
  }, [data])

  const totalDuration = DateHelper.formatDurationInSeconds(duration + runningSeconds)

  return (
    <div className="flex h-3.5 w-12 bg-brand rounded-full justify-center items-center mr-1">
      {isLoading ? (
        <Loader className="w-2 h-2 text-grey-100/50" />
      ) : (
        <p className="text-3xs font-semibold text-grey-100">{totalDuration}</p>
      )}
    </div>
  )
}
