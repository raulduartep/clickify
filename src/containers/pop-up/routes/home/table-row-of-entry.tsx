import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBook2, IconDotsVertical, IconTag } from '@tabler/icons-react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Table } from '@components/table'
import { Tooltip } from '@components/tolltip'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useStorage } from '@hooks/use-storage'

type Props = {
  entry: TClockifyTimeEntry
}

export const TableRowOfEntry = ({ entry }: Props) => {
  const { values } = useStorage()
  const { deleteTimeEntry } = useClockifyEntryService()
  const navigate = useNavigate()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const project = entry.projectId ? values.projects?.find(project => project.id === entry.projectId) : undefined
  const tag = entry.tagId ? values.tags?.find(tag => tag.id === entry.tagId) : undefined
  const duration = DateHelper.formatDurationInSeconds(
    DateHelper.durationInSeconds(entry.timeInterval.end as string, entry.timeInterval.start)
  )

  const handleSelectDelete = (event: Event) => {
    event.preventDefault()
    setConfirmDelete(true)
  }

  const handleSelectDeleteConfirm = () => {
    deleteTimeEntry(entry)
  }

  const handleDropdownOpenChange = () => {
    setConfirmDelete(false)
  }

  const handleEdit = () => {
    navigate(`/edit/?${new URLSearchParams({ entry: JSON.stringify(entry) }).toString()}`)
  }

  return (
    <Table.Row key={entry.id}>
      <Table.Cell>
        <div className="flex gap-1 text-brand font-bold">
          <p>{DateHelper.format(entry.timeInterval.start, 'HH:mm')}</p>
          <span className="text-grey-500">-</span>
          <p>{DateHelper.format(entry.timeInterval.end!, 'HH:mm')}</p>
          <span className="text-grey-500">|</span>
          <p>{duration}</p>
        </div>

        <Tooltip content={entry.description} align="start">
          <p className="truncate">{entry.description}</p>
        </Tooltip>
      </Table.Cell>

      <Table.Cell className="w-[4rem]">
        <div className="flex gap-0.5">
          <Tooltip content={project?.name} delay={200}>
            <IconButton icon={<IconBook2 />} colorScheme="gray" size="lg" disabled={!project?.name} />
          </Tooltip>

          <Tooltip content={tag?.name} delay={200}>
            <IconButton icon={<IconTag />} colorScheme="gray" size="lg" disabled={!tag?.name} />
          </Tooltip>
        </div>
      </Table.Cell>

      <Table.Cell className="w-[3rem]">
        <DropdownMenu.Root onOpenChange={handleDropdownOpenChange}>
          <DropdownMenu.Trigger asChild>
            <IconButton icon={<IconDotsVertical />} colorScheme="gray" size="lg" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onSelect={handleEdit}>Edit</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              className={StyleHelper.mergeStyles('transition-none', {
                'text-red-500 focus:bg-red-500/10': !confirmDelete,
                'text-grey-100 bg-red-500 focus:bg-red-500/90': confirmDelete,
              })}
              onSelect={confirmDelete ? handleSelectDeleteConfirm : handleSelectDelete}
            >
              {confirmDelete ? ' Are you sure ?' : 'Delete'}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Table.Cell>
    </Table.Row>
  )
}
