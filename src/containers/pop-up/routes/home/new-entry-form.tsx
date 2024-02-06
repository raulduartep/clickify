import { IconPlayerPlay } from '@tabler/icons-react'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { Select } from '@components/select'
import { useStorage } from '@hooks/use-storage'

export const NewEntryForm = () => {
  const { values } = useStorage()

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="font-bold text-sm text-grey-500">NEW ENTRY</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Input placeholder="What are you doing ?" />
          <Button label="Start" leftIcon={<IconPlayerPlay />} />
        </div>

        <div className="flex gap-2">
          <Select.Root>
            <Select.Trigger className="w-full">
              <Select.Value placeholder="Select a project" />
            </Select.Trigger>
            <Select.Content>
              {values.projects?.map(project => <Select.Item value={project.id}>{project.name}</Select.Item>)}
            </Select.Content>
          </Select.Root>

          <Select.Root>
            <Select.Trigger className="w-full">
              <Select.Value placeholder="Select a tag" />
            </Select.Trigger>
            <Select.Content>
              {values.tags?.map(tags => <Select.Item value={tags.id}>{tags.name}</Select.Item>)}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  )
}
