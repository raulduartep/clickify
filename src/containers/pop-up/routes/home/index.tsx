import { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { PopupHeader } from '@components/popup-header'
import { useStorage } from '@hooks/use-storage'

import { ListOfLastEntries } from './list-of-last-entries'
import { RunningEntryButton } from './running-entry-button'

export const PopupHomePage = () => {
  const { values, isLoaded } = useStorage()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoaded || values.isFirstTime === false) return
    navigate('/welcome')
  }, [isLoaded, values.isFirstTime, navigate])
  return (
    <Fragment>
      <PopupHeader withBackButton={false} />

      <main className="px-6 py-4 flex flex-col min-h-0 flex-grow">
        {!!values.runningEntry && <RunningEntryButton runningEntry={values.runningEntry} />}

        <ListOfLastEntries />
      </main>
    </Fragment>
  )
}
