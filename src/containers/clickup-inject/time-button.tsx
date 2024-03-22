import { Fragment, useMemo } from 'react'
import { IconPlayerPlay, IconPlayerStopFilled, IconPlus, IconTag } from '@tabler/icons-react'
import { TClockifyTag } from 'src/schemas/clockify'

import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Loader } from '@components/loader'
import { ClickupHelper } from '@helpers/clickup'
import { DateHelper } from '@helpers/date'
import { useClockifyEntryService } from '@hooks/use-clockify-entry-service'
import { useEntriesList } from '@hooks/use-entries-list'
import { useEntryCountUp } from '@hooks/use-entry-countup'
import { useStorage } from '@hooks/use-storage'
import { TClickupVersion } from '@interfaces/clickup'

import { ClickupInjectTimeButtonCountUp } from './time-button-count-up'
import { ClickupInjectTimeButtonTotalDuration } from './time-button-total-duration'

type TProps = {
  version: TClickupVersion
}

export const ClickupInjectTimeButton = ({ version }: TProps) => {
  const { values } = useStorage()
  const { createTimeEntry, stopEntry } = useClockifyEntryService()

  const currentTaskId = useMemo(() => ClickupHelper.getCurrentTaskId(), [])

  const query = useEntriesList(currentTaskId)

  const inProgressEntry = useMemo(() => {
    if (!query.data) return
    const firstEntry = query.data.pages[0].data[0]

    if (firstEntry?.timeInterval.end) return

    return firstEntry
  }, [query.data])

  const completedDuration = useMemo(() => {
    let total = 0

    if (query.data) {
      total = query.data.pages[0].data.reduce((acc, entry) => {
        if (!entry.timeInterval.end) return acc

        const duration = DateHelper.durationInSeconds(entry.timeInterval.end as string, entry.timeInterval.start)

        return acc + duration
      }, 0)
    }

    return total
  }, [query.data])

  const runningSeconds = useEntryCountUp(inProgressEntry?.timeInterval.start)

  const handlePlay = async (tag?: TClockifyTag) => {
    if (!values.projects) throw new Error('Projects not found')

    const project = ClickupHelper.getCurrentProject(values.projects, version)
    const description = ClickupHelper.getCurrentTimeEntryDescription(version)

    await createTimeEntry({
      tagId: tag?.id,
      projectId: project?.id,
      description,
      start: new Date(),
    })
  }

  const handleClick = async () => {
    if (inProgressEntry) {
      await stopEntry()
      return
    }

    await handlePlay()
  }

  const handleAddManual = () => {
    if (!values.projects) throw new Error('Projects not found')
    if (!chrome.runtime)
      throw new Error('Chrome is not defined. You need to run this as a Chrome extension to use this feature.')

    const project = ClickupHelper.getCurrentProject(values.projects, version)
    const description = ClickupHelper.getCurrentTimeEntryDescription(version)

    chrome.runtime.sendMessage({ type: 'OPEN_POPUP', payload: { projectId: project?.id, description } })
  }

  return (
    <div className="flex flex-col gap-1">
      {query.isLoading ? (
        <Loader className="text-brand" />
      ) : (
        <Fragment>
          <div className="flex items-center">
            <ClickupInjectTimeButtonTotalDuration duration={completedDuration + runningSeconds} />
            <IconButton
              disabled={!!inProgressEntry}
              icon={<IconPlus />}
              colorScheme="brand"
              onClick={handleAddManual}
            />
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-[0.125rem]">
              <IconButton
                onClick={handleClick}
                colorScheme={inProgressEntry ? 'red' : 'brand'}
                icon={!inProgressEntry ? <IconPlayerPlay /> : <IconPlayerStopFilled />}
              />

              {!inProgressEntry && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <IconButton icon={<IconTag />} />
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
              )}
            </div>

            <ClickupInjectTimeButtonCountUp isRunning={!!inProgressEntry} runningSeconds={runningSeconds} />
          </div>
        </Fragment>
      )}
    </div>
  )
}
