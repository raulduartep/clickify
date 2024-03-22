import { useMemo, useState } from 'react'
import { IconCheck, IconTrash, IconX } from '@tabler/icons-react'
import isEqual from 'lodash.isequal'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Calendar } from '@components/calendar'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { TimeInput } from '@components/time-input'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'

type Props = {
  entry: TClockifyTimeEntry
  className?: string
}

type TFormData = {
  description: string
  projectId: string
  tagId: string
  date: Date
  start: Date
  end: Date
}

export const AggregatedEntry = ({ entry, className }: Props) => {
  const { editTimeEntry, deleteTimeEntry } = useClockifyEntryService()

  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false)

  const initialFormData = useMemo(() => {
    const endDate = entry.timeInterval?.end ? DateHelper.parse(entry.timeInterval.end) : new Date()
    const startDate = DateHelper.parse(entry.timeInterval.start)

    return {
      description: entry.description,
      projectId: entry.projectId ?? NO_PROJECT_VALUE,
      tagId: entry.tagId ?? NO_TAG_VALUE,
      date: startDate,
      start: startDate,
      end: endDate,
    }
  }, [entry])

  const { actionData, setDataFromEventWrapper, setDataItemWrapper, setData, reset, setError } =
    useActions<TFormData>(initialFormData)

  const hasDiff = useMemo(() => !isEqual(initialFormData, actionData), [actionData, initialFormData])

  const handleSelectDate = (date?: Date) => {
    if (!date) return
    setData({
      date,
    })
  }

  const handleSave = async () => {
    const startTimeError = !DateHelper.isValidTime(actionData.start) ? 'Invalid start time' : undefined
    const endTimeError = !DateHelper.isValidTime(actionData.end) ? 'Invalid end time' : undefined
    if (startTimeError || endTimeError) {
      setError({ start: startTimeError, end: endTimeError })
      return
    }

    await editTimeEntry({
      id: entry.id,
      description: actionData.description,
      end: actionData.end,
      start: actionData.start,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })
  }

  return (
    <li
      className={StyleHelper.mergeStyles(
        'flex flex-col gap-2 py-3 pl-2 pr-4 border hover:bg-brand/5 group border-grey-600 border-t-0 transition-colors relative',
        className
      )}
    >
      <div className="flex gap-2">
        <div className="flex gap-1">
          <TimeInput
            name="start"
            value={actionData.start}
            onValueChange={setDataItemWrapper('start')}
            date={actionData.date}
            size="sm"
            className="w-12"
          />
          <TimeInput
            name="end"
            value={actionData.end}
            onValueChange={setDataItemWrapper('end')}
            min={actionData.start}
            date={actionData.date}
            size="sm"
            className="w-12"
          />

          <Calendar mode="single" required initialFocus selected={actionData.date} onSelect={handleSelectDate} />
        </div>

        <Input
          name="duration"
          value={DateHelper.formatDurationInSeconds(DateHelper.durationInSeconds(actionData.end, actionData.start))}
          className="text-center border-dashed border-brand text-brand"
          containerClassName="flex-grow"
          size="sm"
          readOnly
        />

        <TagsSelect
          triggerClassName="min-w-[6rem] w-[6rem]"
          value={actionData.tagId}
          onChange={setDataItemWrapper('tagId')}
        />
      </div>

      <div className="flex gap-2">
        <Input
          name="description"
          size="sm"
          containerClassName="flex-grow"
          value={actionData.description}
          onChange={setDataFromEventWrapper('description')}
        />

        <ProjectsSelect
          triggerClassName="min-w-[6rem] w-[6rem]"
          value={actionData.projectId}
          onChange={setDataItemWrapper('projectId')}
        />
      </div>

      <div
        className={StyleHelper.mergeStyles(
          'flex flex-col absolute -right-2.5 gap-1.5 top-1/2 -translate-y-1/2 transition-all',
          {
            'opacity-100 visible': hasDiff,
            'opacity-0 invisible': !hasDiff,
          }
        )}
      >
        <IconButton icon={<IconCheck />} onClick={handleSave} contained colorScheme="brand" size="sm" />
        <IconButton icon={<IconX />} onClick={reset} contained colorScheme="red" size="sm" />
      </div>

      <div
        className={StyleHelper.mergeStyles(
          'flex flex-col absolute -right-2.5 gap-1.5 top-1/2 -translate-y-1/2 transition-all opacity-0 invisible ',
          {
            'group-hover:opacity-100 group-hover:visible': !hasDiff,
            'visible opacity-100': dropdownMenuOpen,
          }
        )}
      >
        <DropdownMenu.Root open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <IconButton icon={<IconTrash />} contained colorScheme="red" size="sm" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Item
              className="text-red-500 focus:bg-red-500/10 text-xs py-1 px-1.5"
              onClick={deleteTimeEntry.bind(null, entry)}
            >
              Are you sure ?
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </li>
  )
}
