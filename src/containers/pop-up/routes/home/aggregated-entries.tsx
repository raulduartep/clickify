import { memo } from 'react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'

import { AggregatedEntry } from './aggregated-entry'

type Props = {
  entries: TClockifyTimeEntry[]
  date: string
}

export const AggregatedEntries = memo(({ date, entries }: Props) => {
  const duration = entries.reduce((acc, entry) => {
    return acc + DateHelper.durationInSeconds(entry.timeInterval.end as string, entry.timeInterval.start)
  }, 0)
  const formattedDuration = DateHelper.formatDurationInSeconds(duration)

  return (
    <li>
      <div className="flex justify-between px-3 font-medium py-1.5 rounded-t text-sm bg-brand/50">
        <p>{date}</p>
        <p>{formattedDuration}</p>
      </div>

      <ul className="flex flex-col text-xs">
        {entries.map((entry, index) => (
          <AggregatedEntry
            key={entry.id}
            entry={entry}
            className={StyleHelper.mergeStyles({
              'rounded-b': index + 1 === entries.length,
            })}
          />
        ))}
      </ul>
    </li>
  )
})
