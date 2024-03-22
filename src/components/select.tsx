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
      'flex h-5 gap-1 min-w-0 text-left items-center justify-between rounded-sm border border-grey-500/30 bg-transparent data-[state=open]:border-brand px-1.5 text-xs data-[placeholder]:text-grey-500 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
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
    <IconChevronUp className="min-h-[0.75rem] min-w-[0.75rem] h-[0.75rem] w-[0.75rem]" />
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
    <IconChevronDown className="min-h-[0.75rem] min-w-[0.75rem] h-[0.75rem] w-[0.75rem]" />
  </SelectPrimitive.ScrollDownButton>
))

const Content = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal container={document.getElementById('clickify-extension-root')}>
    <SelectPrimitive.Content
      ref={ref}
      className={StyleHelper.mergeStyles(
        'relative z-50 max-h-80 min-w-[4rem] overflow-hidden rounded-md border border-grey-600 bg-grey-900 text-grey-100 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
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
            'h-[var(--radix-select-trigger-height)] w-full max-w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]'
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
    className={StyleHelper.mergeStyles('px-1.5 py-1 text-xs font-semibold', className)}
    {...props}
  />
))

const Item = forwardRef<ElementRef<typeof SelectPrimitive.Item>, ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={StyleHelper.mergeStyles(
        'relative flex justify-between w-full min-w-0 gap-1 cursor-default select-none items-center rounded-sm py-0.5 px-1 text-xs outline-none focus:bg-grey-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>span]:truncate',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <IconCheck className="min-h-[0.75rem] min-w-[0.75rem] max-h-[0.75rem] max-w-[0.75rem]" />
      </SelectPrimitive.ItemIndicator>
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
