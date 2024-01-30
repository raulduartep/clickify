import { useMemo } from 'react'

import { Loader } from '@components/loader'
import { DateHelper } from '@helpers/date'
import { useClockify } from '@hooks/use-clockify'
import { useCurrentEntriesList } from '@hooks/use-current-entries-list'

export const ClickupInjectTimeButtonTotalDuration = () => {
  const { runningSeconds } = useClockify()
  const { data, isLoading } = useCurrentEntriesList()

  const totalDurationInSeconds = useMemo(() => {
    let total = 0

    if (data) {
      total = data.reduce((acc, entry) => {
        if (!entry.timeInterval.end) return acc
        const duration = DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)
        return acc + duration
      }, 0)
    }

    return total
  }, [data])

  const durationPlusRunning = runningSeconds + totalDurationInSeconds
  const durationFormatted = DateHelper.formatDurationInSeconds(durationPlusRunning)

  return (
    <div className="flex h-3.5 w-12 bg-brand rounded-full justify-center items-center mr-1">
      {isLoading ? (
        <Loader className="w-2 h-2 text-grey-100/50" />
      ) : (
        <p className="text-3xs font-semibold text-grey-100">{durationFormatted}</p>
      )}
    </div>
  )
}
