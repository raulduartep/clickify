import { DayPicker } from 'react-day-picker'
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

import { StyleHelper } from '@helpers/style'

import { IconButton } from './icon-button'
import { Popover } from './popover'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton icon={<IconCalendar />} colorScheme="gray" size="sm" />
      </Popover.Trigger>

      <Popover.Content className="p-0" align="end">
        <DayPicker
          showOutsideDays={showOutsideDays}
          className={StyleHelper.mergeStyles('p-3', className)}
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: StyleHelper.mergeStyles(
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-grey-600 text-grey-100 rounded flex items-center justify-center'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-grey-500 rounded-md w-8 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: StyleHelper.mergeStyles(
              'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-brand [&:has([aria-selected].day-outside)]:bg-brand/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
              props.mode === 'range'
                ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                : '[&:has([aria-selected])]:rounded-md'
            ),
            day: StyleHelper.mergeStyles('h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded hover:bg-grey-600'),
            day_range_start: 'day-range-start',
            day_range_end: 'day-range-end',
            day_selected: 'bg-brand text-grey-100 hover:bg-brand/90 focus:bg-brand',
            day_today: 'text-brand',
            day_outside:
              'day-outside text-grey-600 opacity-50  aria-selected:bg-brand/50 aria-selected:text-grey-100 aria-selected:opacity-30',
            day_disabled: 'text-grey-500 opacity-50',
            day_range_middle: 'aria-selected:bg-brand aria-selected:text-grey-100',
            day_hidden: 'invisible',
            ...classNames,
          }}
          components={{
            IconLeft: () => <IconChevronLeft className="h-4 w-4" />,
            IconRight: () => <IconChevronRight className="h-4 w-4" />,
          }}
          {...props}
        />
      </Popover.Content>
    </Popover.Root>
  )
}

export { Calendar }
