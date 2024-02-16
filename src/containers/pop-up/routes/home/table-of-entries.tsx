import { memo } from 'react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Table } from '@components/table'
import { DateHelper } from '@helpers/date'

import { TableRowOfEntry } from './table-row-of-entry'

type Props = {
  entries: TClockifyTimeEntry[]
  date: string
}

export const TableOfEntries = memo(({ date, entries }: Props) => {
  const duration = entries.reduce((acc, entry) => {
    return acc + DateHelper.durationInSeconds(entry.timeInterval.end as string, entry.timeInterval.start)
  }, 0)
  const formattedDuration = DateHelper.formatDurationInSeconds(duration)

  return (
    <li className="border border-grey-600 rounded-md text-sm">
      <div className="flex justify-between px-3 font-medium py-1.5 bg-brand/10">
        <p>{date}</p>
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
