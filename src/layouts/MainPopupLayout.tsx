import { ReactNode } from 'react'

import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'

type TProps = {
  children: ReactNode
}

export const MainPopupLayout = ({ children }: TProps) => {
  return (
    <div
      id="clickify-extension-root"
      className={StyleHelper.mergeStyles('text-grey-100', {
        'w-screen h-screen flex justify-center items-center bg-grey-900 text-gray-100': EnvHelper.DEV,
      })}
    >
      <div
        className={StyleHelper.mergeStyles(
          'min-w-[25rem] max-w-[25rem] min-h-[37.5rem] max-h-[37.5rem] bg-grey-800  py-5 flex flex-col',
          {
            'rounded-lg': EnvHelper.DEV,
          }
        )}
      >
        {children}
      </div>
    </div>
  )
}
