import { StrictMode } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { StorageProvider } from '@contexts/storage'

import { PopupEditPage } from './routes/edit'
import { PopupHomePage } from './routes/home'
import { PopupUpdateApiPage } from './routes/update-api'
import { PopupWelcomePage } from './routes/welcome'

import '../../assets/css/global.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
})
const router = createHashRouter([
  { path: '/', element: <PopupHomePage /> },
  { path: '/update-api', element: <PopupUpdateApiPage /> },
  { path: '/welcome', element: <PopupWelcomePage /> },
  { path: '/edit', element: <PopupEditPage /> },
])

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
