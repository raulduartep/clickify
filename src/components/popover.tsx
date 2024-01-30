import { ReactNode } from 'react'
import * as RadixPopover from '@radix-ui/react-popover'

import { StyleHelper } from '@helpers/style'

type TProps = {
  children: ReactNode
  trigger: JSX.Element
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  contentClassName?: string
} & Pick<RadixPopover.PopoverContentProps, 'side' | 'align'>

export const Popover = ({
  children,
  trigger,
  isOpen,
  onOpenChange,
  contentClassName,
  align = 'center',
  side = 'bottom',
}: TProps) => {
  return (
    <RadixPopover.Root open={isOpen} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild className="data-[state=open]:bg-grey-900">
        {trigger}
      </RadixPopover.Trigger>

      <RadixPopover.Content
        side={side}
        align={align}
        sideOffset={5}
        className={StyleHelper.mergeStyles(
          'bg-grey-900 p-3 rounded-md text-grey-100 shadow-xl z-[1001]',
          contentClassName
        )}
      >
        <RadixPopover.Arrow className="fill-grey-900" />

        {children}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}
