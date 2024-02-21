import { useEffect, useState } from 'react'

import { DateHelper } from '@helpers/date'

export const useEntryCountUp = (date?: string) => {
  const [runningSeconds, setRunningSeconds] = useState(0)

  useEffect(() => {
    if (!date) {
      setRunningSeconds(0)
      return
    }

    const calculateSeconds = () => {
      const duration = DateHelper.durationInSeconds(new Date(), date)
      setRunningSeconds(duration)
    }

    calculateSeconds()
    window.addEventListener('focus', calculateSeconds)

    const interval = setInterval(calculateSeconds, 1000)

    return () => {
      window.removeEventListener('focus', calculateSeconds)
      clearInterval(interval)
    }
  }, [date])

  return runningSeconds
}
