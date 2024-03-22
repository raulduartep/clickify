import { Fragment, useLayoutEffect, useMemo } from 'react'
import { IconCheck, IconPlayerStop, IconTrash, IconX } from '@tabler/icons-react'
import { IconPlayerPlay } from '@tabler/icons-react'
import isEqual from 'lodash.isequal'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { LastEntriesSelect } from '@components/last-entries-select'
import { Popover } from '@components/popover'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { TimeInput } from '@components/time-input'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useEntryCountUp } from '@hooks/use-entry-countup'

type TFormData = {
  description: string
  projectId: string
  tagId: string
  start: Date
}

type TProps = {
  inProgressEntry?: TClockifyTimeEntry | null | undefined
}

export const NewEntryFormTimerMode = ({ inProgressEntry }: TProps) => {
  const { createTimeEntry, editTimeEntry, deleteTimeEntry, stopEntry } = useClockifyEntryService()

  const initialActionData = useMemo<TFormData>(
    () => ({
      description: inProgressEntry?.description ?? '',
      projectId: inProgressEntry?.projectId ?? NO_PROJECT_VALUE,
      tagId: inProgressEntry?.tagId ?? NO_TAG_VALUE,
      start: inProgressEntry ? DateHelper.parse(inProgressEntry.timeInterval.start) : new Date(),
    }),
    [inProgressEntry]
  )

  const { actionData, setDataFromEventWrapper, setDataItemWrapper, reset, setData } =
    useActions<TFormData>(initialActionData)

  const hasDiff = useMemo(() => !isEqual(initialActionData, actionData), [actionData, initialActionData])

  const runningSeconds = useEntryCountUp(inProgressEntry?.timeInterval.start)

  const handleSelectEntry = (entry: TClockifyTimeEntry) => {
    setData({
      description: entry.description,
      projectId: entry.projectId ?? NO_PROJECT_VALUE,
      tagId: entry.tagId ?? NO_TAG_VALUE,
    })
  }

  const handlePlay = async () => {
    await createTimeEntry({
      description: actionData.description,
      projectId: actionData.projectId,
      tagId: actionData.tagId,
      start: new Date(),
    })
  }

  const handleStop = async () => {
    if (!inProgressEntry) return
    await stopEntry()
  }

  const handleSave = async () => {
    if (!inProgressEntry) return

    await editTimeEntry({
      description: actionData.description,
      projectId: actionData.projectId,
      tagId: actionData.tagId,

      start: actionData.start,
      id: inProgressEntry.id,
    })
  }

  const handleDiscard = async () => {
    if (!inProgressEntry) return

    await deleteTimeEntry(inProgressEntry)
  }

  useLayoutEffect(() => {
    setData(initialActionData)
  }, [initialActionData, setData])

  return (
    <form className="flex flex-col gap-2">
      <div className="flex gap-2">
        <LastEntriesSelect
          onEntrySelect={handleSelectEntry}
          value={actionData.description}
          disabled={!!inProgressEntry}
        >
          <Input
            name="description"
            placeholder="What are you working on?"
            value={actionData.description}
            onChange={setDataFromEventWrapper('description')}
            size="sm"
            containerClassName="flex-grow"
          />
        </LastEntriesSelect>

        <Popover.Root>
          <Popover.Trigger disabled={!inProgressEntry}>
            <Input
              name="duration"
              value={DateHelper.formatDurationInSeconds(runningSeconds)}
              className={StyleHelper.mergeStyles('text-center border-dashed w-20', {
                'cursor-pointer hover:bg-red-500/25 border-red-500 text-red-500': inProgressEntry,
              })}
              size="sm"
              readOnly
            />
          </Popover.Trigger>
          <Popover.Content align="end" className="px-2.5">
            <TimeInput
              name="start"
              placeholder="Start"
              value={actionData.start}
              onValueChange={setDataItemWrapper('start')}
              date={actionData.start}
              size="sm"
              label="START"
              className="w-28"
            />
          </Popover.Content>
        </Popover.Root>

        {!inProgressEntry ? (
          <IconButton
            icon={<IconPlayerPlay />}
            onClick={handlePlay}
            contained
            colorScheme="brand"
            type="button"
            size="sm"
          />
        ) : hasDiff ? (
          <Fragment>
            <IconButton icon={<IconX />} onClick={reset} contained colorScheme="red" type="button" size="sm" />
            <IconButton
              icon={<IconCheck />}
              onClick={handleSave}
              contained
              colorScheme="brand"
              type="button"
              size="sm"
            />
          </Fragment>
        ) : (
          <Fragment>
            <IconButton
              icon={<IconTrash />}
              onClick={handleDiscard}
              contained
              colorScheme="red"
              type="button"
              size="sm"
            />
            <IconButton
              icon={<IconPlayerStop />}
              onClick={handleStop}
              contained
              colorScheme="red"
              type="button"
              size="sm"
            />
          </Fragment>
        )}
      </div>

      <div className="flex gap-2">
        <ProjectsSelect value={actionData.projectId} onChange={setDataItemWrapper('projectId')} />
        <TagsSelect value={actionData.tagId} onChange={setDataItemWrapper('tagId')} />
      </div>
    </form>
  )
}
