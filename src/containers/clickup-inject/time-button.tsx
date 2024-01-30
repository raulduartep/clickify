import { useState } from 'react'
import { IconPencil, IconPlayerPlay, IconPlayerStopFilled, IconPlus, IconTag } from '@tabler/icons-react'

import { IconButton } from '@components/icon-button'
import { Popover } from '@components/popover'
import { StyleHelper } from '@helpers/style'
import { useClockify } from '@hooks/use-clockify'
import { useStorage } from '@hooks/use-storage'
import { TClockifyGetTagResponse } from '@interfaces/services'

import { ClickupInjectTimeButtonCountUp } from './time-button-count-up'
import { ClickupInjectTimeButtonTotalDuration } from './time-button-total-duration'

export const ClickupInjectTimeButton = () => {
  const { isRunning, stopEntry, playEntry } = useClockify()
  const { values, hasAllValues } = useStorage()

  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (isRunning) {
      stopEntry()
      return
    }

    playEntry()
  }

  const handleTagClick = (tag: TClockifyGetTagResponse) => {
    setIsOpen(false)
    playEntry(tag)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        <ClickupInjectTimeButtonTotalDuration />

        <IconButton disabled={true} icon={<IconPlus />} />
        <IconButton disabled={true} icon={<IconPencil />} />
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-[0.125rem]">
          <IconButton
            className={StyleHelper.mergeStyles({
              'text-red-500 aria-[disabled=false]:hover:bg-red-500/20': isRunning,
            })}
            onClick={handleClick}
            disabled={!hasAllValues}
            icon={!isRunning ? <IconPlayerPlay /> : <IconPlayerStopFilled />}
          />

          <Popover
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            contentClassName="flex flex-col gap-1 px-6"
            trigger={<IconButton disabled={!hasAllValues || isRunning} icon={<IconTag />} />}
          >
            {values.tags &&
              values.tags.map(tag => (
                <button
                  key={tag.id}
                  className="py-1 text-center text-grey-100 font-bold hover:text-grey-100/50 text-2xs"
                  onClick={handleTagClick.bind(null, tag)}
                >
                  {tag.name}
                </button>
              ))}
          </Popover>
        </div>

        <ClickupInjectTimeButtonCountUp />
      </div>
    </div>
  )
}
