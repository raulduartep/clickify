import { useEffect, useState } from 'react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { DateHelper } from '@helpers/date'

export const useEntryCountUp = (entry?: TClockifyTimeEntry) => {
  const [runningSeconds, setRunningSeconds] = useState(0)

  useEffect(() => {
    if (!entry) return

    const calculateSeconds = () => {
      const duration = DateHelper.durationInSeconds(new Date(), entry.timeInterval.start)
      setRunningSeconds(duration)
    }

    calculateSeconds()
    window.addEventListener('focus', calculateSeconds)

    return () => {
      window.removeEventListener('focus', calculateSeconds)
    }
  }, [entry])

  useEffect(() => {
    if (!entry) {
      setRunningSeconds(0)
      return
    }

    const interval = setInterval(() => {
      setRunningSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [entry])

  return runningSeconds
}
