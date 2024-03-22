import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { StorageHelper } from '@helpers/storage'
import { TStorageContextData, TStorageContextValues, TStorageProviderProps } from '@interfaces/context'

export const StorageContext = createContext({} as TStorageContextData)

export const StorageProvider = ({ children }: TStorageProviderProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [values, setValues] = useState<TStorageContextValues>({
    tags: undefined,
    apiKey: undefined,
    projects: undefined,
    user: undefined,
    isFirstTime: undefined,
  })

  const hasAllValues = useMemo(() => {
    return !!(values.apiKey && values.user && values.projects && values.tags && values.isFirstTime !== null)
  }, [values])

  const removeStorage = useCallback(async (keys: keyof TStorageContextValues | (keyof TStorageContextValues)[]) => {
    await StorageHelper.remove(keys)

    setValues(prev => {
      const allKeys = Array.isArray(keys) ? keys : [keys]
      allKeys.forEach(key => {
        prev[key] = undefined
      })

      return prev
    })
  }, [])

  const setStorage = useCallback(async (partialValues: Partial<TStorageContextValues>) => {
    await StorageHelper.set(partialValues)

    setValues(prev => ({
      ...prev,
      ...partialValues,
    }))
  }, [])

  const getStorage = useCallback((): Promise<TStorageContextValues> => {
    return StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'isFirstTime'])
  }, [])

  useEffect(() => {
    StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'isFirstTime']).then(storage => {
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
    <StorageContext.Provider value={{ values, setStorage, getStorage, hasAllValues, isLoaded, removeStorage }}>
      {children}
    </StorageContext.Provider>
  )
}
