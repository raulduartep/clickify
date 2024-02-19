import { FocusEvent, useCallback, useEffect, useState } from 'react'

import { Input, TInputProps } from '@components/input'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'

type TProps = Omit<TInputProps, 'value'> & {
  onValueChange: (value: string) => void
  min?: string
  value: string
}

export const TimeInput = ({ onValueChange, value, className, min, ...props }: TProps) => {
  const [inputValue, setInputValue] = useState<string>(value as string)

  const handleMin = useCallback(
    (time: string) => {
      try {
        if (min) {
          const minDate = DateHelper.editDateTime(new Date(), min)
          const date = DateHelper.editDateTime(new Date(), time)

          if (DateHelper.isBefore(date, minDate)) {
            return min
          }
        }
      } catch {
        /* empty */
      }

      return time
    },
    [min]
  )

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const blurValue = event.target.value
    if (!blurValue) {
      const stringBlurValue = value?.toString() ?? ''
      setInputValue(stringBlurValue)
      onValueChange(stringBlurValue)
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

    let hoursComplete = `${hoursNumber.toString().padEnd(2, '0')}:${minutesNumber.toString().padEnd(2, '0')}`

    hoursComplete = handleMin(hoursComplete)

    onValueChange(hoursComplete)
    setInputValue(hoursComplete)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    setInputValue(prev => handleMin(prev))
  }, [handleMin])

  useEffect(() => {
    setInputValue(value)
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
