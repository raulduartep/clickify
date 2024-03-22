import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { Button } from '@components/button'

import { AggregatedEntries } from './aggregated-entries'

type TProps = {
  data?: Map<string, TClockifyTimeEntry[]>
  onNextPage: () => void
  isFetchingNextPage: boolean
}

export const EntriesList = ({ onNextPage, data, isFetchingNextPage }: TProps) => {
  return (
    <div className="flex flex-col min-h-0 my-1">
      {!data ? (
        <div className="flex justify-center text-grey-500">
          <p>No Entries</p>
        </div>
      ) : (
        <ul className="flex-grow overflow-y-scroll flex flex-col min-h-0 gap-4 pl-6 pr-3 py-2">
          {Array.from(data).map(([date, entries]) => (
            <AggregatedEntries key={date} date={date} entries={entries} />
          ))}

          <Button className="mt-2" onClick={onNextPage} loading={isFetchingNextPage}>
            Load more
          </Button>
        </ul>
      )}
    </div>
  )
}
