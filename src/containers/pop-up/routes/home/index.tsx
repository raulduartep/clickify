import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IconClockCog, IconRefresh } from '@tabler/icons-react'
import { TClockifyTimeEntry } from 'src/schemas/clockify'

import { DropdownMenu } from '@components/dropdown-menu'
import { IconButton } from '@components/icon-button'
import { Loader } from '@components/loader'
import { PopupHeader } from '@components/popup-header'
import { DateHelper } from '@helpers/date'
import { StyleHelper } from '@helpers/style'
import { useEntriesList } from '@hooks/use-entries-list'

import { EntriesList } from './entries-list'
import { NewEntryFormManualMode } from './new-entry-form-manual-mode'
import { NewEntryFormTimerMode } from './new-entry-form-timer-mode'

type TClockMode = 'manual' | 'timer'

export const PopupHomePage = () => {
  const [searchParams] = useSearchParams()
  const query = useEntriesList()

  const [mode, setMode] = useState<TClockMode>('timer')

  const inProgressEntry = useMemo(() => {
    if (!query.data) return
    const firstEntry = query.data.pages[0].data[0]

    if (firstEntry.timeInterval.end) return

    return firstEntry
  }, [query.data])

  const completedEntries = useMemo(() => {
    if (!query.data) return

    return query.data.pages
      .flatMap(page => page.data)
      .reduce((acc, entry) => {
        if (!entry.timeInterval.end) return acc

        const date = DateHelper.parse(entry.timeInterval.start).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'numeric',
        })

        return acc.set(date, [...(acc.get(date) ?? []), entry])
      }, new Map<string, TClockifyTimeEntry[]>())
  }, [query.data])

  const handleRefreshClick = () => {
    query.refetch()
  }

  useLayoutEffect(() => {
    if (searchParams.get('description')) {
      setMode('manual')
    }
  }, [searchParams])

  return (
    <Fragment>
      <PopupHeader
        className={StyleHelper.mergeStyles('bg-brand/5', {
          'bg-red-500/5': inProgressEntry,
        })}
        withBackButton={false}
        actions={
          <Fragment>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton icon={<IconClockCog />} colorScheme="gray" size="lg" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item
                  onClick={() => setMode('timer')}
                  className={StyleHelper.mergeStyles({
                    'bg-brand focus:bg-brand/75': mode === 'timer',
                  })}
                >
                  Timer
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => setMode('manual')}
                  className={StyleHelper.mergeStyles('mt-1', {
                    'bg-brand focus:bg-brand/75': mode === 'manual',
                  })}
                >
                  Manual
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <IconButton
              icon={
                <IconRefresh
                  className={StyleHelper.mergeStyles({
                    'animate-spin': query.isRefetching,
                  })}
                />
              }
              colorScheme="gray"
              size="lg"
              onClick={handleRefreshClick}
            />
          </Fragment>
        }
      />

      {query.isLoading ? (
        <div className="flex justify-center mt-4">
          <Loader className="w-6 h-6" />
        </div>
      ) : (
        <main className="flex flex-col min-h-0 flex-grow">
          <div
            className={StyleHelper.mergeStyles('py-5 px-6 border-b-2 border-grey-600 bg-brand/5 shadow-lg', {
              'bg-red-500/5': inProgressEntry,
            })}
          >
            {mode === 'timer' ? (
              <NewEntryFormTimerMode inProgressEntry={inProgressEntry} />
            ) : (
              <NewEntryFormManualMode />
            )}
          </div>

          <EntriesList
            data={completedEntries}
            isFetchingNextPage={query.isFetchingNextPage}
            onNextPage={query.fetchNextPage}
          />
        </main>
      )}
    </Fragment>
  )
}
