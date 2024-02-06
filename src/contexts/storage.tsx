import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { StorageHelper } from '@helpers/storage'
import { TStorageContextData, TStorageContextValues, TStorageProviderProps } from '@interfaces/context'

export const StorageContext = createContext({} as TStorageContextData)

export const StorageProvider = ({ children }: TStorageProviderProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [values, setValues] = useState<TStorageContextValues>({
    tags: null,
    apiKey: null,
    projects: null,
    user: null,
    runningEntry: null,
    isFirstTime: null,
  })

  const hasAllValues = useMemo(() => {
    return !!(values.apiKey && values.user && values.projects && values.tags && values.isFirstTime !== null)
  }, [values])

  const setStorage = useCallback(async (partialValues: Partial<TStorageContextValues>) => {
    await StorageHelper.set(partialValues)

    setValues(prev => ({
      ...prev,
      ...partialValues,
    }))
  }, [])

  const getStorage = useCallback((): Promise<TStorageContextValues> => {
    return StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'runningEntry', 'isFirstTime'])
  }, [])

  useEffect(() => {
    StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'runningEntry', 'isFirstTime']).then(storage => {
      setValues(prev => ({
        ...prev,
        ...storage,
      }))
      setIsLoaded(true)
    })
  }, [])

  useEffect(() => {
    const removeListener = StorageHelper.listen(newValues => {
      setValues(prev => ({
        ...prev,
        ...newValues,
      }))
    })

    return removeListener
  }, [])

  return (
    <StorageContext.Provider value={{ values, setStorage, getStorage, hasAllValues, isLoaded }}>
      {children}
    </StorageContext.Provider>
  )
}
