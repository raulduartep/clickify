import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { IconArrowsMoveVertical, IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react'

import { StyleHelper } from '@helpers/style'

const Root = SelectPrimitive.Root

const Group = SelectPrimitive.Group

const Value = SelectPrimitive.Value

const Trigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={StyleHelper.mergeStyles(
      'flex h-7 gap-2 min-w-0 text-left items-center justify-between rounded border border-grey-600 bg-transparent px-3 py-2 text-sm shadow-sm data-[placeholder]:text-grey-500 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <IconArrowsMoveVertical className="min-h-[0.75rem] min-w-[0.75rem] h-[0.75rem] w-[0.75rem] opacity-50 text-grey-100" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))

const ScrollUpButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={StyleHelper.mergeStyles('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <IconChevronUp className="min-h-[1rem] min-w-[1rem] h-[1rem] w-[1rem]" />
  </SelectPrimitive.ScrollUpButton>
))

const ScrollDownButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={StyleHelper.mergeStyles('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <IconChevronDown className="min-h-[1rem] min-w-[1rem] h-[1rem] w-[1rem]" />
  </SelectPrimitive.ScrollDownButton>
))

const Content = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={StyleHelper.mergeStyles(
        'relative z-50 max-h-80 min-w-[4rem] overflow-hidden rounded-md border border-grey-600 bg-grey-800 text-grey-100 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <ScrollUpButton />
      <SelectPrimitive.Viewport
        className={StyleHelper.mergeStyles(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <ScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))

const Label = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={StyleHelper.mergeStyles('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))

const Item = forwardRef<ElementRef<typeof SelectPrimitive.Item>, ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={StyleHelper.mergeStyles(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 text-sm outline-none focus:bg-grey-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>span]:max-w-[calc(var(--radix-popper-anchor-width)-2.5rem)] [&>span]:truncate',
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <IconCheck className="min-h-[0.75rem] min-w-[0.75rem] h-[0.75rem] w-[0.75rem]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
)

const Separator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={StyleHelper.mergeStyles('-mx-1 my-1 h-px bg-grey-600', className)}
    {...props}
  />
))

export const Select = {
  Root,
  Content,
  Group,
  Item,
  Label,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
  Trigger,
  Value,
}
