import { useCallback, useMemo, useState } from 'react'
import { IconPencil, IconPlayerPlay, IconPlayerStopFilled, IconPlus, IconTag } from '@tabler/icons-react'
import { TClockifyTag } from 'src/schemas/clockify'

import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { ClickupHelper } from '@helpers/clickup'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useIntervalEffect } from '@hooks/use-interval-effect'
import { useStorage } from '@hooks/use-storage'
import { TClickupVersion } from '@interfaces/clickup'

import { ClickupInjectTimeButtonCountUp } from './time-button-count-up'
import { ClickupInjectTimeButtonTotalDuration } from './time-button-total-duration'

type TProps = {
  version: TClickupVersion
}

export const ClickupInjectTimeButton = ({ version }: TProps) => {
  const { values } = useStorage()
  const { playEntry, stopEntry } = useClockifyEntryService()

  const [runningSeconds, setRunningSeconds] = useState(0)

  const currentTaskId = useMemo(() => ClickupHelper.getCurrentTaskId(), [])

  const isRunning = useMemo(() => {
    if (!values.runningEntry) {
      return false
    }

    const idFromText = ClickupHelper.getClickupIdFromText(values.runningEntry.description)

    if (!idFromText || idFromText !== currentTaskId) {
      return false
    }

    return true
  }, [values.runningEntry, currentTaskId])

  const handlePlay = async (tag?: TClockifyTag) => {
    if (!values.projects) throw new Error('Projects not found')

    const project = ClickupHelper.getCurrentProject(values.projects, version)
    const description = ClickupHelper.getCurrentTimeEntryDescription(version)

    await playEntry({
      tagId: tag?.id,
      projectId: project?.id,
      description,
    })
  }

  const handleClick = () => {
    if (isRunning) {
      stopEntry()
      return
    }

    handlePlay()
  }

  const handleAddManual = () => {
    if (!values.projects) throw new Error('Projects not found')
    if (!chrome.runtime)
      throw new Error('Chrome is not defined. You need to run this as a Chrome extension to use this feature.')

    const project = ClickupHelper.getCurrentProject(values.projects, version)
    const description = ClickupHelper.getCurrentTimeEntryDescription(version)

    chrome.runtime.sendMessage({ type: 'openPopup', payload: { projectId: project?.id, description } })
  }

  const handleEdit = () => {
    if (!values.runningEntry) throw new Error('Running entry not found')
    if (!chrome.runtime)
      throw new Error('Chrome is not defined. You need to run this as a Chrome extension to use this feature.')
    chrome.runtime.sendMessage({ type: 'openPopup', payload: { entry: JSON.stringify(values.runningEntry) } })
  }

  const handleIntervalEffect = useCallback(() => {
    if (!values.runningEntry) {
      setRunningSeconds(0)
      return
    }

    setRunningSeconds(DateHelper.durationInSeconds(new Date(), values.runningEntry.timeInterval.start))
  }, [values.runningEntry])

  useIntervalEffect(handleIntervalEffect, 1000, isRunning)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <ClickupInjectTimeButtonTotalDuration currentTaskId={currentTaskId} runningSeconds={runningSeconds} />

        <IconButton disabled={isRunning} icon={<IconPlus />} onClick={handleAddManual} />
        <IconButton disabled={!isRunning} icon={<IconPencil />} onClick={handleEdit} />
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-[0.125rem]">
          <IconButton
            className={StyleHelper.mergeStyles({
              'text-red-500 aria-[disabled=false]:hover:bg-red-500/20': isRunning,
            })}
            onClick={handleClick}
            icon={!isRunning ? <IconPlayerPlay /> : <IconPlayerStopFilled />}
          />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton disabled={isRunning} icon={<IconTag />} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {values.tags &&
                values.tags.map(tag => (
                  <DropdownMenu.Item
                    key={tag.id}
                    className="justify-center text-2xs"
                    onClick={handlePlay.bind(null, tag)}
                  >
                    {tag.name}
                  </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <ClickupInjectTimeButtonCountUp isRunning={isRunning} runningSeconds={runningSeconds} />
      </div>
    </div>
  )
}
