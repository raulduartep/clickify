import { memo } from 'react'

import { Table } from '@components/table'
import { DateHelper, DateUTCHelper } from '@helpers/date'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

import { TableRowOfEntry } from './table-row-of-entry'

type Props = {
  entries: TClockifyTimeEntryResponse[]
  date: string
}

export const TableOfEntries = memo(({ date, entries }: Props) => {
  console.log(entries[0])
  const duration = entries.reduce((acc, entry) => {
    return acc + DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)
  }, 0)
  const formattedDuration = DateHelper.formatDurationInSeconds(duration)
  const formattedDate = DateUTCHelper.toLocalFormattedDate(date).slice(0, -5)

  return (
    <li className="border border-grey-600 rounded-md text-sm">
      <div className="flex justify-between px-3 font-medium py-1.5 bg-brand/10">
        <p>{formattedDate}</p>
        <p>{formattedDuration}</p>
      </div>

      <Table.Root className="table-fixed">
        <Table.Body>
          {entries.map(entry => (
            <TableRowOfEntry key={entry.id} entry={entry} />
          ))}
        </Table.Body>
      </Table.Root>
    </li>
  )
})
