import { cloneElement, useMemo, useState } from 'react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Popover } from '@components/popover'
import { useEntriesList } from '@hooks/use-entries-list'
import { useStorage } from '@hooks/use-storage'

type TProps = {
  onEntrySelect?: (entry: TClockifyTimeEntry) => void
  value: string
  children: JSX.Element
  disabled?: boolean
}

export const LastEntriesSelect = ({ onEntrySelect, children, value, disabled }: TProps) => {
  const { data } = useEntriesList()
  const { values } = useStorage()

  const [popoverIsOpen, setPopoverIsOpen] = useState(false)

  const filteredEntries = useMemo(() => {
    if (!data) return []

    return data.pages
      .flatMap(page => page.data)
      .filter((entry, index, array) => {
        const foundIndex = array.findIndex(item => item.description === entry.description)
        return foundIndex === index && entry.description.toLowerCase().includes(value.toLowerCase())
      })
      .slice(0, 15)
  }, [data, value])

  const handleFocus = () => {
    if (disabled) return

    setPopoverIsOpen(true)
  }

  const handleBlur = () => {
    setPopoverIsOpen(false)
  }

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault()
  }

  return (
    <Popover.Root open={popoverIsOpen && filteredEntries.length !== 0}>
      <Popover.Anchor asChild>{cloneElement(children, { onFocus: handleFocus, onBlur: handleBlur })}</Popover.Anchor>

      <Popover.Content
        onOpenAutoFocus={handleOpenAutoFocus}
        className="w-[23rem] p-1 max-h-[10rem] overflow-auto rounded"
        align="start"
      >
        {filteredEntries.map(entry => {
          const project = values.projects?.find(project => project.id === entry.projectId)
          const tag = values.tags?.find(tag => tag.id === entry.tagId)

          return (
            <button
              className="grid grid-cols-4 rounded-sm h-5 items-center px-2 gap-2 text-2xs outline-none hover:bg-grey-800 min-w-0 w-full text-grey-100"
              onClick={onEntrySelect?.bind(null, entry)}
              key={`last-entries-select-${entry.id}`}
            >
              <p className="truncate col-span-2 min-w-0 text-xs text-left">{entry.description}</p>
              {project && <p className="truncate text-center font-medium p-0.5 bg-brand/75 rounded">{project.name}</p>}
              {tag && <p className="truncate text-center font-medium bg-orange/75 p-0.5 rounded">{tag.name}</p>}
            </button>
          )
        })}
      </Popover.Content>
    </Popover.Root>
  )
}
