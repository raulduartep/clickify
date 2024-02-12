import { useState } from 'react'

import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'

import { Select } from './select'

type Props = {
  triggerClassName?: string
  value?: string
  readOnly?: boolean
  onChange?: (value: string) => void
}

export const NO_TAG_VALUE = 'no-tag'

export const TagsSelect = ({ triggerClassName, value, readOnly, onChange }: Props) => {
  const { values } = useStorage()

  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (readOnly) return

    setOpen(value)
  }

  return (
    <Select.Root
      disabled={!values.tags}
      value={value}
      open={open}
      onOpenChange={handleOpenChange}
      onValueChange={onChange}
    >
      <Select.Trigger
        className={StyleHelper.mergeStyles(triggerClassName, {
          'cursor-default': readOnly,
        })}
      >
        <Select.Value placeholder="Tags" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value={NO_TAG_VALUE}>No tag</Select.Item>
        {values.tags?.map(tag => (
          <Select.Item key={tag.id} value={tag.id}>
            {tag.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
