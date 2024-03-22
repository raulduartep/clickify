import { useState } from 'react'

import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'

import { Select } from './select'

type Props = {
  triggerClassName?: string
  value?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
}

export const NO_PROJECT_VALUE = 'no-project'

export const ProjectsSelect = ({ triggerClassName, value, readOnly, onChange, disabled }: Props) => {
  const { values } = useStorage()

  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (readOnly) return

    setOpen(value)
  }

  return (
    <Select.Root
      disabled={!values.projects || disabled}
      value={value}
      open={open}
      onOpenChange={handleOpenChange}
      onValueChange={onChange}
      name="projects"
    >
      <Select.Trigger
        className={StyleHelper.mergeStyles('w-full', triggerClassName, {
          'cursor-default': readOnly,
        })}
      >
        <Select.Value placeholder="Projects" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value={NO_PROJECT_VALUE}>No Project</Select.Item>
        {values.projects?.map(project => (
          <Select.Item key={project.id} value={project.id}>
            {project.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
