import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconCalendar } from '@tabler/icons-react'
import { PrivatePopupLayout } from 'src/layouts/PrivatePopupLayout'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Button } from '@components/button'
import { Calendar } from '@components/calendar'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { Popover } from '@components/popover'
import { PopupHeader } from '@components/popup-header'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { Textarea } from '@components/textarea'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useEntryCountUp } from '@hooks/use-entry-countup'
import { useStorage } from '@hooks/use-storage'

type TFormData = {
  description: string
  projectId: string
  tagId: string
  date?: Date
  startTime: string
  endTime: string
  duration: string
}

export const PopupEditPage = () => {
  const { setStorage } = useStorage()
  const { state } = useLocation()
  const entry = state?.entry as TClockifyTimeEntry | undefined
  const isRunning = entry && !entry?.timeInterval.end

  const navigate = useNavigate()
  const seconds = useEntryCountUp(isRunning ? entry : undefined)
  const { editTimeEntry, addTimeEntry } = useClockifyEntryService()

  const { actionData, actionState, setDataFromEventWrapper, setError, setDataItemWrapper, setData, handleAct } =
    useActions<TFormData>({
      description: '',
      projectId: NO_PROJECT_VALUE,
      tagId: NO_TAG_VALUE,
      date: new Date(),
      startTime: '',
      endTime: '',
      duration: '',
    })

  const handleCalculateDuration = () => {
    if (!actionData.startTime || !actionData.endTime || !actionData.date) return

    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
    if (!regex.test(actionData.startTime) || !regex.test(actionData.endTime)) return

    const durationInSeconds = DateHelper.durationInSeconds(
      DateHelper.editDateTime(actionData.date, actionData.endTime),
      DateHelper.editDateTime(actionData.date, actionData.startTime)
    )

    setData({
      duration: DateHelper.formatDurationInSeconds(durationInSeconds),
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

  const handleSubmitAdd = async () => {
    if (!actionData.date || entry || !validateFields()) return

    const startDate = DateHelper.editDateTime(actionData.date, actionData.startTime)
    const endDate = DateHelper.editDateTime(actionData.date, actionData.endTime)

    await addTimeEntry({
      description: actionData.description,
      end: endDate,
      start: startDate,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })
    navigate(-1)
  }

  const handleSubmitEdit = async () => {
    if (!actionData.date || !entry || !validateFields()) return

    const startDate = DateHelper.editDateTime(actionData.date, actionData.startTime)
    const endDate = !isRunning ? DateHelper.editDateTime(actionData.date, actionData.endTime) : undefined
    const editedTimeEntry = await editTimeEntry({
      id: entry.id,
      description: actionData.description,
      end: endDate,
      start: startDate,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })

    if (isRunning) {
      await setStorage({
        runningEntry: editedTimeEntry,
      })
    }

    navigate(-1)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  useEffect(() => {
    let data: Partial<TFormData>

    if (!entry) {
      const now = new Date()
      const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
      data = {
        date: now,
        startTime: time,
        endTime: time,
      }
    } else {
      const startDate = DateHelper.parse(entry.timeInterval.start)
      const endDate = entry.timeInterval.end ? DateHelper.parse(entry.timeInterval.end) : undefined
      data = {
        description: entry.description,
        projectId: entry.projectId ?? NO_PROJECT_VALUE,
        tagId: entry.tagId ?? NO_TAG_VALUE,
        date: startDate,
        startTime: startDate.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        endTime: endDate
          ? endDate.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : undefined,
        duration: endDate
          ? DateHelper.formatDurationInSeconds(DateHelper.durationInSeconds(endDate, entry.timeInterval.start))
          : undefined,
      }
    }

    setData(data)
  }, [entry, setData])

  return (
    <PrivatePopupLayout>
      <PopupHeader withBackButton={true} />

      <div className="flex px-6 py-4  justify-between items-center">
        <p className="font-bold text-sm text-grey-500 uppercase">EDIT ENTRY</p>
      </div>

      <form
        className="px-6 grid gap-x-3 gap-y-2 grid-cols-3"
        onSubmit={handleAct(entry ? handleSubmitEdit : handleSubmitAdd)}
      >
        <Input
          className="text-center"
          mask="99:99"
          value={actionData.startTime}
          onChange={setDataFromEventWrapper('startTime')}
          label="Start time"
          name="startTime"
          onBlur={handleCalculateDuration}
        />
        <Input
          className={StyleHelper.mergeStyles('text-center', {
            'border-dashed text-brand': isRunning,
          })}
          mask="99:99"
          value={
            isRunning
              ? DateHelper.addSecondsToTime(actionData.startTime, seconds).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : actionData.endTime
          }
          onChange={setDataFromEventWrapper('endTime')}
          label="End time"
          name="endTime"
          onBlur={handleCalculateDuration}
          readOnly={isRunning}
        />

        <Input
          className="border-dashed text-center text-brand"
          name="duration"
          label="Duration"
          readOnly
          value={isRunning ? DateHelper.formatDurationInSeconds(seconds) : actionData.duration}
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
            <Calendar
              mode="single"
              required
              initialFocus
              selected={actionData.date}
              onSelect={setDataItemWrapper('date')}
            />
          </Popover.Content>
        </Popover.Root>

        <Textarea
          containerClassName="col-span-3"
          className="resize-none"
          value={actionData.description}
          onChange={setDataFromEventWrapper('description')}
          rows={3}
          name="description"
          label="What are you working on?"
        />

        <div className="flex col-span-3 gap-3">
          <ProjectsSelect
            value={actionData.projectId}
            onChange={setDataItemWrapper('projectId')}
            label="Select a project"
          />
          <TagsSelect value={actionData.tagId} onChange={setDataItemWrapper('tagId')} label="Select a tag" />
        </div>

        <Button className="col-span-3 mt-4" colorSchema="red" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>

        <Button className="col-span-3" type="submit" loading={actionState.isActing} disabled={!actionState.isValid}>
          Save
        </Button>
      </form>
    </PrivatePopupLayout>
  )
}
