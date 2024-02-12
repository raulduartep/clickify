import { ChangeEvent, useEffect, useState } from 'react'
import { IconEyeEdit, IconTrash } from '@tabler/icons-react'

import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
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
  const { playEntry, stopEntry, deleteTimeEntry } = useClockify()
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
      projectId: projectId === NO_PROJECT_VALUE ? undefined : projectId,
      tagId: tagId === NO_TAG_VALUE ? undefined : tagId,
    })
  }

  const handleStop = () => {
    stopEntry()
    setDescription('')
    setProjectId(NO_PROJECT_VALUE)
    setTagId(NO_TAG_VALUE)
  }

  const handleDiscard = () => {
    if (!values.runningEntry) return

    deleteTimeEntry(values.runningEntry.id)
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
        <p className="font-bold text-sm text-grey-500 uppercase ">
          {values.runningEntry ? 'RUNNING ENTRY' : 'START A NEW ENTRY'}
        </p>

        {values.runningEntry && (
          <div className="flex gap-2">
            <IconButton icon={<IconEyeEdit />} colorScheme="gray" size="lg" />

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton icon={<IconTrash />} colorScheme="red" size="lg" onClick={handleDiscard} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item className="text-red-500 focus:bg-red-500/10" onClick={handleDiscard}>
                  Are you sure ?
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        )}
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
          onMouseEnter={setIsHovering.bind(null, true)}
          onMouseLeave={setIsHovering.bind(null, false)}
          colorSchema={values.runningEntry ? 'red' : 'brand'}
          onClick={values.runningEntry ? handleStop : handleStart}
        >
          {values.runningEntry ? (isHovering ? 'Stop' : DateHelper.formatDurationInSeconds(seconds)) : 'Start'}
        </Button>
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
