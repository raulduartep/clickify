import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useClockify } from '@hooks/use-clockify'

export const ClickupInjectTimeButtonCountUp = () => {
  const { isRunning, runningSeconds } = useClockify()
  const formatted = DateHelper.formatDurationInSeconds(runningSeconds)

  return (
    <p
      className={StyleHelper.mergeStyles('text-2xs w-11 flex justify-center', {
        'text-red-500': isRunning,
        'text-grey-100/25': !isRunning,
      })}
    >
      {formatted}
    </p>
  )
}
