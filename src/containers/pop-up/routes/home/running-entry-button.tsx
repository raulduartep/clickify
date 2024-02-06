import { Table } from '@components/table'
import { DateHelper } from '@helpers/date'
import { useEntryCountUp } from '@hooks/use-entry-countup'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

import { TableRowOfEntry } from './table-row-of-entry'

type TProps = {
  runningEntry: TClockifyTimeEntryResponse
}

const RunningSeconds = ({ runningEntry }: TProps) => {
  const seconds = useEntryCountUp(runningEntry)

  return <p>{DateHelper.formatDurationInSeconds(seconds)}</p>
}

export const RunningEntryButton = ({ runningEntry }: TProps) => {
  return (
    <div>
      <p className="font-bold text-sm text-grey-500 mb-2">RUNNING ENTRY</p>

      <div className="border-2 border-red-500/50 rounded-md bg-red-500/20">
        <Table.Root className="table-fixed">
          <Table.Body>
            <TableRowOfEntry
              isRunning
              entry={runningEntry}
              customDuration={<RunningSeconds runningEntry={runningEntry} />}
            />
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  )
}
