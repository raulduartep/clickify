import { DateHelper } from '@helpers/date'

type TProps = {
  duration: number
}

export const ClickupInjectTimeButtonTotalDuration = ({ duration }: TProps) => {
  console.log({ duration })
  const totalDuration = DateHelper.formatDurationInSeconds(duration)

  return (
    <div className="flex h-3.5 w-12 bg-brand rounded-full justify-center items-center mr-1">
      <p className="text-3xs font-semibold text-grey-100">{totalDuration}</p>
    </div>
  )
}
