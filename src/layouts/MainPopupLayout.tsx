import { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'

type TProps = {
  children: ReactNode
}

export const MainPopupLayout = ({ children }: TProps) => {
  const [searchParams] = useSearchParams()
  const fromInjection = searchParams.get('fromInjection') === 'true'

  return (
    <div
      className={StyleHelper.mergeStyles('flex w-full h-full justify-center items-center bg-grey-900 text-gray-100', {
        'w-screen h-screen': fromInjection || EnvHelper.DEV,
      })}
    >
      <div
        className={StyleHelper.mergeStyles(
          'min-w-[25rem] min-h-[37.5rem] max-w-[25rem] max-h-[37.5rem] bg-grey-800  flex flex-col',
          { 'rounded-lg': fromInjection || EnvHelper.DEV }
        )}
      >
        {children}
      </div>
    </div>
  )
}
