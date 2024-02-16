import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconClockEdit, IconClockPlus, IconTrash } from '@tabler/icons-react'

import { Button } from '@components/button'
import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Input } from '@components/input'
import { NO_PROJECT_VALUE, ProjectsSelect } from '@components/projects-select'
import { NO_TAG_VALUE, TagsSelect } from '@components/tags-select'
import { Tooltip } from '@components/tolltip'
import { DateHelper } from '@helpers/date'
import { useActions } from '@hooks/use-actions'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useEntryCountUp } from '@hooks/use-entry-countup'
import { useStorage } from '@hooks/use-storage'

type TFormData = {
  description: string
  projectId: string
  tagId: string
}

export const CurrentEntryForm = () => {
  const { values } = useStorage()
  const { playEntry, stopEntry, deleteTimeEntry } = useClockifyEntryService()
  const navigate = useNavigate()
  const seconds = useEntryCountUp(values.runningEntry)

  const { actionData, setDataItemWrapper, setData, setDataFromEventWrapper, reset } = useActions<TFormData>({
    description: '',
    projectId: NO_PROJECT_VALUE,
    tagId: NO_TAG_VALUE,
  })

  const [isHovering, setIsHovering] = useState(false)

  const handleStart = () => {
    playEntry({
      description: actionData.description,
      projectId: actionData.projectId === NO_PROJECT_VALUE ? undefined : actionData.projectId,
      tagId: actionData.tagId === NO_TAG_VALUE ? undefined : actionData.tagId,
    })
  }

  const handleStop = () => {
    stopEntry()
    reset()
  }

  const handleDiscard = () => {
    if (!values.runningEntry) return
    deleteTimeEntry(values.runningEntry)
    reset()
  }

  const handleEdit = () => {
    navigate('/edit/', { state: { entry: values.runningEntry } })
  }

  const handleAddManual = () => {
    navigate('/edit')
  }

  useEffect(() => {
    if (!values.runningEntry) return

    setData({
      description: values.runningEntry.description,
      projectId: values.runningEntry.projectId ?? NO_PROJECT_VALUE,
      tagId: values.runningEntry.tagId ?? NO_TAG_VALUE,
    })
  }, [values.runningEntry, setData])

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-sm text-grey-500 uppercase ">
          {values.runningEntry ? 'RUNNING ENTRY' : 'START A NEW ENTRY'}
        </p>

        {values.runningEntry ? (
          <div className="flex gap-2">
            <Tooltip content="Edit" align="end">
              <IconButton icon={<IconClockEdit />} colorScheme="gray" size="lg" onClick={handleEdit} />
            </Tooltip>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton icon={<IconTrash />} colorScheme="red" size="lg" />
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end">
                <DropdownMenu.Item className="text-red-500 focus:bg-red-500/10" onClick={handleDiscard}>
                  Are you sure ?
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        ) : (
          <Tooltip content="Add manual" align="end">
            <IconButton icon={<IconClockPlus />} colorScheme="gray" size="lg" onClick={handleAddManual} />
          </Tooltip>
        )}
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-2">
        <Input
          value={actionData.description}
          placeholder="What are you working on?"
          onChange={setDataFromEventWrapper('description')}
          containerClassName="col-span-3"
          readOnly={!!values.runningEntry}
        />

        <Button
          className="col-span-1"
          onMouseEnter={setIsHovering.bind(null, true)}
          onMouseLeave={setIsHovering.bind(null, false)}
          colorSchema={values.runningEntry ? 'red' : 'brand'}
          onClick={values.runningEntry ? handleStop : handleStart}
        >
          {values.runningEntry ? (isHovering ? 'Stop' : DateHelper.formatDurationInSeconds(seconds)) : 'Start'}
        </Button>

        <ProjectsSelect
          className="col-span-2"
          readOnly={!!values.runningEntry}
          value={actionData.projectId}
          onChange={setDataItemWrapper('projectId')}
        />
        <TagsSelect
          className="col-span-2"
          readOnly={!!values.runningEntry}
          value={actionData.tagId}
          onChange={setDataItemWrapper('tagId')}
        />
      </div>
    </div>
  )
}