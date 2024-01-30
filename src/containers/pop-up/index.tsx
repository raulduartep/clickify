import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { StorageProvider } from '@contexts/storage'

import { PopupHome } from './routes/home'

import '../../assets/css/global.scss'

const queryClient = new QueryClient()

const router = createHashRouter([{ path: '/', element: <PopupHome /> }])

export const PopupContainer = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <RouterProvider router={router} />
        </StorageProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
