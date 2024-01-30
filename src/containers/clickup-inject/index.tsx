import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ClockifyProvider } from '@contexts/clockify'
import { StorageProvider } from '@contexts/storage'
import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'
import { TClickupVersion } from '@interfaces/clickup'

import { ClickupInjectTimeButton } from './time-button'

import '../../assets/css/global.scss'

type TProps = {
  version: TClickupVersion
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
})

export const ClickupInjectContainer = ({ version }: TProps) => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <ClockifyProvider version={version}>
            <div
              className={StyleHelper.mergeStyles({
                'w-screen h-screen bg-grey-800 flex justify-center items-center': EnvHelper.DEV,
              })}
            >
              <div
                className={StyleHelper.mergeStyles('flex gap-2 mx-4', {
                  'my-2': version === 'v3',
                })}
              >
                <ClickupInjectTimeButton />
              </div>
            </div>
          </ClockifyProvider>
        </StorageProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
