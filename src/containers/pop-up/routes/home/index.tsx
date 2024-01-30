import Logo from '@assets/images/icon.svg?react'
import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'

import { ListOfEntries } from './list-of-entries'
import { UserAvatarButton } from './user-avatar-button'

export const PopupHome = () => {
  return (
    <div
      id="clickify-extension-root"
      className={StyleHelper.mergeStyles({
        'w-screen h-screen flex justify-center items-center bg-grey-900 text-gray-100': EnvHelper.DEV,
      })}
    >
      <div className="min-w-[400px] max-w-[400px] min-h-[600px] max-h-[600px] bg-grey-800 rounded-lg py-5 flex flex-col">
        <header className="flex justify-between px-6 pb-4 border-b-2 border-grey-600 items-center">
          <Logo />

          <div className="flex">
            <UserAvatarButton />
          </div>
        </header>

        <ListOfEntries />
      </div>
    </div>
  )
}
