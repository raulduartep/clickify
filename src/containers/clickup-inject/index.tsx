import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClickupInjectLayout } from 'src/layouts/ClickupInjectLayout'

import { StorageProvider } from '@contexts/storage'
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
      gcTime: Infinity,
    },
  },
})

export const ClickupInjectContainer = ({ version }: TProps) => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <ClickupInjectLayout version={version}>
            <ClickupInjectTimeButton version={version} />
          </ClickupInjectLayout>
        </StorageProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
