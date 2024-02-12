import { useState } from 'react'
import { IconBook2, IconDotsVertical, IconTag } from '@tabler/icons-react'

import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Table } from '@components/table'
import { Tooltip } from '@components/tolltip'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useClockify } from '@hooks/use-clockify'
import { useStorage } from '@hooks/use-storage'
import { TClockifyTimeEntryResponse } from '@interfaces/services'

type Props = {
  entry: TClockifyTimeEntryResponse
}

export const TableRowOfEntry = ({ entry }: Props) => {
  const { values } = useStorage()
  const { deleteTimeEntry } = useClockify()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const project = entry.projectId ? values.projects?.find(project => project.id === entry.projectId) : undefined
  const tag = entry.tagId ? values.tags?.find(tag => tag.id === entry.tagId) : undefined
  const duration = DateHelper.formatDurationInSeconds(
    DateHelper.durationInSeconds(entry.timeInterval.start, entry.timeInterval.end)
  )

  const handleSelectDelete = (event: Event) => {
    event.preventDefault()
    setConfirmDelete(true)
  }

  const handleSelectDeleteConfirm = () => {
    deleteTimeEntry(entry.id)
  }

  const handleDropdownOpenChange = () => {
    setConfirmDelete(false)
  }

  return (
    <Table.Row key={entry.id}>
      <Table.Cell>
        <Tooltip content={entry.description} align="start">
          <p className="truncate">{entry.description}</p>
        </Tooltip>
      </Table.Cell>
      <Table.Cell className={StyleHelper.mergeStyles('w-[4.4rem]')}>{duration}</Table.Cell>
      <Table.Cell className="w-[3.5rem]">
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
        <DropdownMenu.Root onOpenChange={handleDropdownOpenChange}>
          <DropdownMenu.Trigger asChild>
            <IconButton icon={<IconDotsVertical />} colorScheme="gray" size="lg" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item>Edit</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              className={StyleHelper.mergeStyles('transition-none', {
                'text-red-500 focus:bg-red-500/10': !confirmDelete,
                'text-grey-100 bg-red-500 focus:bg-red-500/90': confirmDelete,
              })}
              onSelect={confirmDelete ? handleSelectDeleteConfirm : handleSelectDelete}
            >
              {confirmDelete ? 'Confirm ?' : 'Delete'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Table.Cell>
    </Table.Row>
  )
}
