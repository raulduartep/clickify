import { useSearchParams } from 'react-router-dom'
import { IconPlus } from '@tabler/icons-react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Calendar } from '@components/calendar'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { LastEntriesSelect } from '@components/last-entries-select'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { TimeInput } from '@components/time-input'
import { DateHelper } from '@helpers/date'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'

type TFormData = {
  description: string
  projectId: string
  tagId: string
  start: Date
  end: Date
  date: Date
}

export const NewEntryFormManualMode = () => {
  const [searchParams] = useSearchParams()
  const { createTimeEntry } = useClockifyEntryService()

  const { actionData, setDataFromEventWrapper, setDataItemWrapper, setData, reset } = useActions<TFormData>({
    description: searchParams.get('description') ?? '',
    projectId: searchParams.get('projectId') ?? NO_PROJECT_VALUE,
    tagId: NO_TAG_VALUE,
    start: new Date(),
    date: new Date(),
    end: new Date(),
  })

  const handleSelectDate = (date?: Date) => {
    if (!date) return

    setData({
      date,
    })
  }

  const handleSelectEntry = (entry: TClockifyTimeEntry) => {
    setData({
      description: entry.description,
      projectId: entry.projectId ?? NO_PROJECT_VALUE,
      tagId: entry.tagId ?? NO_TAG_VALUE,
    })
  }

  const handleSave = async () => {
    await createTimeEntry({
      description: actionData.description,
      projectId: actionData.projectId,
      tagId: actionData.tagId,
      start: actionData.start,
      end: actionData.end,
    })
    reset()
  }

  return (
    <form className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex gap-1 items-center">
          <TimeInput
            name="start"
            placeholder="Start"
            value={actionData.start}
            onValueChange={setDataItemWrapper('start')}
            date={actionData.date}
            size="sm"
            className="w-12"
          />
          <span className="text-grey-500">-</span>
          <TimeInput
            name="end"
            placeholder="End"
            value={actionData.end}
            onValueChange={setDataItemWrapper('end')}
            date={actionData.date}
            size="sm"
            className="w-12"
          />
        </div>

        <Input
          name="duration"
          value={DateHelper.formatDurationInSeconds(DateHelper.durationInSeconds(actionData.end, actionData.start))}
          className="text-center border-dashed border-brand text-brand"
          size="sm"
          containerClassName="flex-grow"
          readOnly
        />

        <div className="flex gap-1 items-center">
          <Input
            name="date"
            value={actionData.date.toLocaleDateString()}
            className="text-center border-dashed border-brand text-brand"
            size="sm"
            containerClassName="flex-grow"
            readOnly
          />

          <Calendar mode="single" required initialFocus selected={actionData.date} onSelect={handleSelectDate} />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <LastEntriesSelect onEntrySelect={handleSelectEntry} value={actionData.description}>
          <Input
            name="description"
            placeholder="What are you working on?"
            value={actionData.description}
            onChange={setDataFromEventWrapper('description')}
            size="sm"
            containerClassName="flex-grow"
          />
        </LastEntriesSelect>

        <IconButton icon={<IconPlus />} onClick={handleSave} contained colorScheme="brand" type="button" size="sm" />
      </div>

      <div className="flex gap-2">
        <ProjectsSelect value={actionData.projectId} onChange={setDataItemWrapper('projectId')} />
        <TagsSelect value={actionData.tagId} onChange={setDataItemWrapper('tagId')} />
      </div>
    </form>
  )
}
