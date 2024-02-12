import { IconBook2, IconEyeEdit, IconTag } from '@tabler/icons-react'

import { IconButton } from '@components/icon-button'
import { Table } from '@components/table'
import { Tooltip } from '@components/tolltip'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

type Props = {
  entry: TClockifyTimeEntryResponse
}

export const TableRowOfEntry = ({ entry }: Props) => {
  const { values } = useStorage()

  const project = entry.projectId ? values.projects?.find(project => project.id === entry.projectId) : undefined
  const tag = entry.tagId ? values.tags?.find(tag => tag.id === entry.tagId) : undefined
  const duration = DateHelper.formatDurationInSeconds(
    DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)
  )

  return (
    <Table.Row key={entry.id}>
      <Table.Cell>
        <Tooltip content={entry.description} align="start">
          <p className="truncate">{entry.description}</p>
        </Tooltip>
      </Table.Cell>
      <Table.Cell className={StyleHelper.mergeStyles('w-[4.4rem]')}>{duration}</Table.Cell>
      <Table.Cell className="w-[4.2rem]">
        <div className="flex gap-0.5">
          <Tooltip content={project?.name} delay={200}>
            <IconButton icon={<IconBook2 />} colorScheme="gray" size="lg" disabled={!project?.name} />
          </Tooltip>

          <Tooltip content={tag?.name} delay={200}>
            <IconButton icon={<IconTag />} colorScheme="gray" size="lg" disabled={!tag?.name} />
          </Tooltip>
        </div>
      </Table.Cell>
      <Table.Cell className="w-[2.5rem]">
        <div className="flex gap-0.5 justify-end">
          <IconButton icon={<IconEyeEdit />} colorScheme="gray" size="lg" />
        </div>
      </Table.Cell>
    </Table.Row>
  )
}
