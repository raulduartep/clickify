import { StrictMode } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainPopupLayout } from 'src/layouts/MainPopupLayout'
import { PrivatePopupLayout } from 'src/layouts/PrivatePopupLayout'

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
  {
    path: '/',
    element: (
      <PrivatePopupLayout>
        <PopupHomePage />
      </PrivatePopupLayout>
    ),
  },
  {
    path: '/update-api',
    element: (
      <PrivatePopupLayout>
        <PopupUpdateApiPage />
      </PrivatePopupLayout>
    ),
  },
  {
    path: '/edit',
    element: (
      <PrivatePopupLayout>
        <PopupEditPage />
      </PrivatePopupLayout>
    ),
  },
  {
    path: '/welcome',
    element: (
      <MainPopupLayout>
        <PopupWelcomePage />
      </MainPopupLayout>
    ),
  },
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
