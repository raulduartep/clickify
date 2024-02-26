import { Fragment, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IconCalendar } from '@tabler/icons-react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Button } from '@components/button'
import { Calendar } from '@components/calendar'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { LastEntriesSelect } from '@components/last-entries-select'
import { OpenedClickupTaskTabSelect, TOpenedClickupTaskTab } from '@components/opened-clickup-task-tab-select'
import { Popover } from '@components/popover'
import { PopupHeader } from '@components/popup-header'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useIntervalEffect } from '@hooks/use-interval-effect'
import { useStorage } from '@hooks/use-storage'

import { LastThreeEntriesList } from './last-three-entries-list'
import { TimeInput } from './time-input'

type TFormData = {
  description: string
  projectId: string
  tagId: string
  date: Date
  startTime: Date
  endTime: Date
}

const getInitialFormData = (searchParams: URLSearchParams, entry?: TClockifyTimeEntry): TFormData => {
  if (entry) {
    const endDate = entry.timeInterval?.end ? DateHelper.parse(entry.timeInterval.end) : new Date()
    const startDate = DateHelper.parse(entry.timeInterval.start)
    return {
      description: entry.description,
      projectId: entry.projectId ?? NO_PROJECT_VALUE,
      tagId: entry.tagId ?? NO_TAG_VALUE,
      date: startDate,
      startTime: startDate,
      endTime: endDate,
    }
  }
  const now = new Date()
  const nowWithoutSeconds = DateHelper.editDateTime(now, DateHelper.format(now, 'HH:mm'))

  return {
    description: searchParams.get('description') ?? '',
    projectId: searchParams.get('projectId') ?? NO_PROJECT_VALUE,
    tagId: NO_TAG_VALUE,
    date: nowWithoutSeconds,
    startTime: nowWithoutSeconds,
    endTime: nowWithoutSeconds,
  }
}

export const PopupEditPage = () => {
  const { setStorage } = useStorage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { editTimeEntry, addTimeEntry } = useClockifyEntryService()

  const entry = useMemo(() => {
    const searchParamEntry = searchParams.get('entry')
    if (!searchParamEntry) return

    return JSON.parse(searchParamEntry) as TClockifyTimeEntry
  }, [searchParams])

  const isRunning = !!entry && !entry?.timeInterval.end
  const fromInjection = searchParams.get('fromInjection') === 'true'

  const { actionData, actionState, setDataFromEventWrapper, setError, setDataItemWrapper, setData, handleAct } =
    useActions<TFormData>(getInitialFormData(searchParams, entry))

  const handleSelectDate = (date?: Date) => {
    if (!date) return
    setData({
      date,
    })
  }

  const validateFields = () => {
    const startTimeError = !DateHelper.isValidTime(actionData.startTime) ? 'Invalid start time' : undefined
    const endTimeError = !isRunning && !DateHelper.isValidTime(actionData.endTime) ? 'Invalid end time' : undefined
    if (startTimeError || endTimeError) {
      setError({ startTime: startTimeError, endTime: endTimeError })
      return false
    }

    return true
  }

  const goBack = () => {
    if (fromInjection) {
      window.close()
    } else {
      navigate('/')
    }
  }

  const handleSubmitAdd = async () => {
    if (entry || !validateFields()) return

    await addTimeEntry({
      description: actionData.description,
      end: actionData.endTime,
      start: actionData.startTime,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })

    goBack()
  }

  const handleSubmitEdit = async () => {
    if (!entry || !validateFields()) return

    const editedTimeEntry = await editTimeEntry({
      id: entry.id,
      description: actionData.description,
      end: isRunning ? undefined : actionData.endTime,
      start: actionData.startTime,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })

    if (isRunning) {
      await setStorage({
        runningEntry: editedTimeEntry,
      })
    }

    goBack()
  }

  const handleSelectEntry = (entry: TClockifyTimeEntry) => {
    setData({
      description: entry.description,
      projectId: entry.projectId ?? NO_PROJECT_VALUE,
      tagId: entry.tagId ?? NO_TAG_VALUE,
    })
  }

  const handleFillFromClickupTask = (value: TOpenedClickupTaskTab) => {
    setData({
      description: value.description,
      projectId: value.project?.id,
    })
  }

  useIntervalEffect(
    () => {
      setData({
        endTime: new Date(),
      })
    },
    1000,
    isRunning
  )

  console.log({
    actionData,
  })

  return (
    <Fragment>
      <PopupHeader withBackButton={true} />

      <div className="flex px-6 pt-4 pb-1 gap-1 items-center">
        <p className="font-bold text-sm text-grey-500 uppercase">EDIT ENTRY</p>

        <OpenedClickupTaskTabSelect onEntrySelect={handleFillFromClickupTask} />
      </div>

      <form
        className="px-6 grid gap-x-3 gap-y-2 grid-cols-3"
        onSubmit={handleAct(entry ? handleSubmitEdit : handleSubmitAdd)}
      >
        <TimeInput
          value={actionData.startTime}
          onValueChange={setDataItemWrapper('startTime')}
          label="Start time"
          name="startTime"
          date={actionData.date}
        />
        <TimeInput
          className={StyleHelper.mergeStyles({
            'border-dashed text-brand': isRunning,
          })}
          value={actionData.endTime}
          onValueChange={setDataItemWrapper('endTime')}
          label="End time"
          name="endTime"
          readOnly={isRunning}
          min={actionData.startTime}
          date={actionData.date}
        />

        <Input
          className="border-dashed text-center text-brand"
          name="duration"
          label="Duration"
          readOnly
          value={DateHelper.formatDurationInSeconds(
            DateHelper.durationInSeconds(actionData.endTime, actionData.startTime)
          )}
        />

        <Input
          label="Pick a date"
          className="border-dashed text-center text-brand"
          readOnly
          name="date"
          value={actionData.date?.toLocaleDateString()}
        />

        <Popover.Root>
          <Popover.Trigger asChild>
            <IconButton icon={<IconCalendar />} className="self-end -mx-1" colorScheme="gray" size="lg" />
          </Popover.Trigger>

          <Popover.Content className="p-0" align="end">
            <Calendar mode="single" required initialFocus selected={actionData.date} onSelect={handleSelectDate} />
          </Popover.Content>
        </Popover.Root>

        <LastEntriesSelect onEntrySelect={handleSelectEntry} value={actionData.description}>
          <Input
            containerClassName="col-span-3"
            value={actionData.description}
            onChange={setDataFromEventWrapper('description')}
            name="description"
            label="What are you working on?"
          />
        </LastEntriesSelect>

        <div className="flex col-span-3 gap-3">
          <ProjectsSelect
            value={actionData.projectId}
            onChange={setDataItemWrapper('projectId')}
            label="Select a project"
          />
          <TagsSelect value={actionData.tagId} onChange={setDataItemWrapper('tagId')} label="Select a tag" />
        </div>

        <div className="flex gap-2 col-span-3 mt-2">
          <Button type="button" className="w-full" colorSchema="red" variant="outlined" onClick={goBack}>
            Cancel
          </Button>

          <Button type="submit" className="w-full" loading={actionState.isActing} disabled={!actionState.isValid}>
            Save
          </Button>
        </div>
      </form>

      <LastThreeEntriesList />
    </Fragment>
  )
}
