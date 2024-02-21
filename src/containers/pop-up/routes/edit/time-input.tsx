import { FocusEvent, useCallback, useEffect, useState } from 'react'

import { Input, TInputProps } from '@components/input'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'

type TProps = Omit<TInputProps, 'value' | 'min'> & {
  onValueChange: (value: Date) => void
  min?: Date
  value: Date
  date: Date
}

const formatDate = (date: Date) => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export const TimeInput = ({ onValueChange, value, className, min, date, ...props }: TProps) => {
  const [inputValue, setInputValue] = useState<string>(formatDate(value))

  const handleMin = useCallback(
    (againstValue: string) => {
      try {
        if (min) {
          const againstDate = DateHelper.editDateTime(date, againstValue)

          if (DateHelper.isBefore(againstDate, min)) {
            return formatDate(min)
          }
        }
      } catch {
        /* empty */
      }

      return againstValue
    },
    [min, date]
  )

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const blurValue = event.target.value
    if (!blurValue) {
      const stringBlurValue = value?.toString() ?? ''
      setInputValue(stringBlurValue)
      onValueChange(DateHelper.editDateTime(date, stringBlurValue))
      return
    }

    const [hours, minutes] = blurValue.split(':')

    let hoursNumber = Number(hours ?? 0)
    let minutesNumber = Number(minutes ?? 0)

    if (hoursNumber > 23) {
      hoursNumber = 23
    }

    if (minutesNumber > 59) {
      minutesNumber = 59
    }

    let hoursComplete = `${hoursNumber.toString().padStart(2, '0')}:${minutesNumber.toString().padStart(2, '0')}`

    hoursComplete = handleMin(hoursComplete)

    onValueChange(DateHelper.editDateTime(date, hoursComplete))
    setInputValue(hoursComplete)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    setInputValue(prev => handleMin(prev))
  }, [handleMin])

  useEffect(() => {
    setInputValue(formatDate(value))
  }, [value])

  return (
    <Input
      className={StyleHelper.mergeStyles('text-center', className)}
      mask="00:00"
      onBlur={handleBlur}
      value={inputValue}
      onChange={handleChange}
      {...props}
    />
  )
}
