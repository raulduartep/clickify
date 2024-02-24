import { DateHelper } from '@helpers/date'
import { useCompletedEntriesList } from '@hooks/use-completed-entries-list'

export const LastThreeEntriesList = () => {
  const { data } = useCompletedEntriesList()

  const entries = data?.pages.flatMap(page => page.data)?.slice(0, 3)

  return (
    <div className="mx-6 text-grey-500 border border-grey-600 rounded-md mt-4 text-xs">
      <div className="flex justify-between px-3 font-medium py-2 bg-brand/10">
        <p className="font-bold text-grey-500 uppercase ">LAST 3 ENTRIES</p>
      </div>

      <ul>
        {entries?.map(entry => (
          <li className="px-2 py-1 border-b border-grey-600">
            <div className="flex gap-1 text-brand font-bold">
              <p>{DateHelper.format(entry.timeInterval.start, 'HH:mm')}</p>
              <span className="text-grey-500">-</span>
              <p>{DateHelper.format(entry.timeInterval.end!, 'HH:mm')}</p>
              <span className="text-grey-500">|</span>
              <p>
                {DateHelper.formatDurationInSeconds(
                  DateHelper.durationInSeconds(entry.timeInterval.end!, entry.timeInterval.start)
                )}
              </p>
              <span className="text-grey-500">|</span>
              <p>
                {DateHelper.parse(entry.timeInterval.start).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'numeric',
                })}
              </p>
            </div>

            <p className="truncate">{entry.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
