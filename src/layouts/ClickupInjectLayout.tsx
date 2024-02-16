import { Fragment } from 'react'

import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'
import { TClickupVersion } from '@interfaces/clickup'

type TProps = {
  version: TClickupVersion
  children: React.ReactNode
}

export const ClickupInjectLayout = ({ version, children }: TProps) => {
  const { hasAllValues } = useStorage()
  return (
    <div
      id="clickify-extension-root"
      className={StyleHelper.mergeStyles({
        'w-screen h-screen bg-grey-800 flex justify-center items-center': EnvHelper.DEV,
      })}
    >
      <div
        className={StyleHelper.mergeStyles('flex gap-2 mx-4', {
          'my-2': version === 'v3',
        })}
      >
        {hasAllValues ? children : <Fragment />}
      </div>
    </div>
  )
}
