import { ChangeEvent, useEffect, useState } from 'react'
import { IconEyeEdit } from '@tabler/icons-react'

import { Button } from '@components/button'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { DateHelper } from '@helpers/date'
import { useClockify } from '@hooks/use-clockify'
import { useEntryCountUp } from '@hooks/use-entry-countup'
import { useStorage } from '@hooks/use-storage'

export const CurrentEntryForm = () => {
  const { values } = useStorage()
  const { playEntry, stopEntry } = useClockify()
  const seconds = useEntryCountUp(values.runningEntry)

  const [isHovering, setIsHovering] = useState(false)

  const [projectId, setProjectId] = useState<string>(NO_PROJECT_VALUE)
  const [tagId, setTagId] = useState<string>(NO_TAG_VALUE)
  const [description, setDescription] = useState<string>('')

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const handleStart = () => {
    playEntry({
      description,
      projectId,
      tagId,
    })
  }

  const handleStop = () => {
    stopEntry()
    setDescription('')
    setProjectId(NO_PROJECT_VALUE)
    setTagId(NO_TAG_VALUE)
  }

  useEffect(() => {
    if (!values.runningEntry) return

    setProjectId(values.runningEntry.projectId ?? NO_PROJECT_VALUE)
    setTagId(values.runningEntry.tagId ?? NO_TAG_VALUE)
    setDescription(values.runningEntry.description)
  }, [values.runningEntry])

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-sm text-grey-500 ">CURRENT ENTRY</p>

        <IconButton icon={<IconEyeEdit />} colorScheme="gray" size="lg" disabled={!values.runningEntry} />
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-2">
        <Input
          value={description}
          onChange={handleDescriptionChange}
          containerClassName="col-span-3"
          readOnly={!!values.runningEntry}
        />

        <Button
          className="col-span-1 row"
          label={values.runningEntry ? (isHovering ? 'Stop' : DateHelper.formatDurationInSeconds(seconds)) : 'Start'}
          onMouseEnter={setIsHovering.bind(null, true)}
          onMouseLeave={setIsHovering.bind(null, false)}
          colorSchema={values.runningEntry ? 'red' : 'brand'}
          onClick={values.runningEntry ? handleStop : handleStart}
        />
        <ProjectsSelect
          triggerClassName="col-span-2"
          readOnly={!!values.runningEntry}
          value={projectId}
          onChange={setProjectId}
        />
        <TagsSelect triggerClassName="col-span-2" readOnly={!!values.runningEntry} value={tagId} onChange={setTagId} />
      </div>
    </div>
  )
}
