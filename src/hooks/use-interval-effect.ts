import { useEffect } from 'react'

export const useIntervalEffect = (callback: () => void, delay: number, enable = true) => {
  useEffect(() => {
    if (!enable) return

    const runCallback = () => {
      callback()
    }

    const interval = setInterval(runCallback, delay)
    window.addEventListener('focus', runCallback)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', runCallback)
    }
  }, [delay, callback, enable])
}
