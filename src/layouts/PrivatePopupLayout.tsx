import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Loader } from '@components/loader'
import { useStorage } from '@hooks/use-storage'

import { MainPopupLayout } from './MainPopupLayout'

type TProps = {
  children: ReactNode
}

export const PrivatePopupLayout = ({ children }: TProps) => {
  const { values, isLoaded } = useStorage()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoaded || values.isFirstTime === false) return
    navigate('/welcome')
  }, [isLoaded, values.isFirstTime, navigate])

  return (
    <MainPopupLayout>
      {!isLoaded ? (
        <div className="flex items-center justify-center flex-grow">
          <Loader className="w-10 h-10" />
        </div>
      ) : (
        children
      )}
    </MainPopupLayout>
  )
}
