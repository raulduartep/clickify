import { IconEyeEdit } from '@tabler/icons-react'

import { IconButton } from '@components/icon-button'
import { Table, TableBody, TableCell, TableRow } from '@components/Table'
import { DateHelper, DateUTCHelper } from '@helpers/date'
import { useStorage } from '@hooks/use-storage'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

type Props = {
  entries: TClockifyTimeEntryResponse[]
  date: string
  duration: number
}

export const ItemOfListOfEntries = ({ date, duration, entries }: Props) => {
  const { values } = useStorage()

  const formattedDuration = DateHelper.formatDurationInSeconds(duration)
  const formattedDate = DateUTCHelper.toLocalFormattedDate(date).slice(0, -5)

  const getProjectName = (projectId: string) => {
    const project = values.projects?.find(project => project.id === projectId)
    return project?.name || 'No project'
  }

  const getDuration = (entry: TClockifyTimeEntryResponse) => {
    const duration = DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)
    return DateHelper.formatDurationInSeconds(duration)
  }

  return (
    <li className="border border-grey-600 rounded-md text-sm">
      <div className="flex justify-between px-3 font-medium py-1.5 bg-brand/10">
        <p>{formattedDate}</p>
        <p>{formattedDuration}</p>
      </div>

      <Table className="table-fixed">
        <TableBody>
          {entries.map(entry => (
            <TableRow key={entry.id}>
              <TableCell className="truncate">{entry.description}</TableCell>
              <TableCell className="truncate">{getProjectName(entry.projectId)}</TableCell>
              <TableCell className="w-[5rem]">{getDuration(entry)}</TableCell>
              <TableCell className="w-[3rem]">
                <IconButton icon={<IconEyeEdit />} colorScheme="gray" size="lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </li>
  )
}
