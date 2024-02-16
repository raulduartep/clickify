import { PrivatePopupLayout } from 'src/layouts/PrivatePopupLayout'

import { PopupHeader } from '@components/popup-header'

import { CurrentEntryForm } from './current-entry-form'
import { ListOfLastEntries } from './list-of-last-entries'

export const PopupHomePage = () => {
  return (
    <PrivatePopupLayout>
      <PopupHeader withBackButton={false} />

      <main className="px-6 py-4 flex flex-col min-h-0 flex-grow">
        <CurrentEntryForm />

        <ListOfLastEntries />
      </main>
    </PrivatePopupLayout>
  )
}
