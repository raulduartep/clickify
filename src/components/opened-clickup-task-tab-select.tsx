import { useEffect, useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { TClockifyProject } from 'src/schemas/clockify'

import { IconButton } from './icon-button'
import { Popover } from './popover'

export type TOpenedClickupTaskTab = {
  description: string
  project?: TClockifyProject
}

type TProps = {
  onEntrySelect?: (entry: TOpenedClickupTaskTab) => void
}

export const OpenedClickupTaskTabSelect = ({ onEntrySelect }: TProps) => {
  const [openedClickupTaskTab, setOpenedClickupTaskTab] = useState<TOpenedClickupTaskTab[]>([])
  const [popoverIsOpen, setPopoverIsOpen] = useState(false)

  const handleSelect = (entry: TOpenedClickupTaskTab) => {
    onEntrySelect?.(entry)
    setPopoverIsOpen(false)
  }

  useEffect(() => {
    const handle = async () => {
      if (!chrome.tabs) return

      const tabs = await chrome.tabs.query({ url: 'https://app.clickup.com/t/*' })

      const entries: TOpenedClickupTaskTab[] = []
      for (const tab of tabs) {
        if (!tab.id) continue

        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_TASK',
        })
        if (!response) continue

        entries.push(response)
      }

      setOpenedClickupTaskTab(entries)
    }

    handle()
  }, [])

  return openedClickupTaskTab.length > 0 ? (
    <Popover.Root open={popoverIsOpen} onOpenChange={setPopoverIsOpen}>
      <Popover.Trigger asChild>
        <IconButton icon={<IconAlertTriangle />} className="animate-pulse" colorScheme="red" size="lg" />
      </Popover.Trigger>

      <Popover.Content className="w-[16rem] p-1 max-h-[10rem] overflow-auto rounded" align="start">
        {openedClickupTaskTab.map((entry, index) => (
          <button
            className="grid grid-cols-4 items-center rounded-sm py-1.5 px-2 gap-2 text-xs outline-none hover:bg-grey-800 min-w-0 w-full text-grey-100"
            onClick={handleSelect?.bind(null, entry)}
            key={`opened-clickup-task-tab-select-${index}`}
          >
            <p className="truncate col-span-3 min-w-0 text-left">{entry.description}</p>
            {entry.project && (
              <p className="truncate text-center font-medium bg-brand/75 py-0.5 px-1 rounded">{entry.project.name}</p>
            )}
          </button>
        ))}
      </Popover.Content>
    </Popover.Root>
  ) : (
    <></>
  )
}
