import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'

type TProps = {
  runningSeconds: number
  isRunning: boolean
}

export const ClickupInjectTimeButtonCountUp = ({ runningSeconds, isRunning }: TProps) => {
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
