import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { StorageProvider } from '@contexts/storage'
import { EnvHelper } from '@helpers/env'
import { StyleHelper } from '@helpers/style'

import { PopupHomePage } from './routes/home'
import { PopupUpdateApiPage } from './routes/update-api'
import { PopupWelcomePage } from './routes/welcome'

import '../../assets/css/global.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
})
const router = createHashRouter([
  { path: '/', element: <PopupHomePage /> },
  { path: '/update-api', element: <PopupUpdateApiPage /> },
  { path: '/welcome', element: <PopupWelcomePage /> },
])

export const PopupContainer = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
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
              <RouterProvider router={router} />
            </div>
          </div>
        </StorageProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
