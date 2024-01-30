import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { StorageHelper } from '@helpers/storage'
import { TStorageContextData, TStorageContextValues, TStorageProviderProps } from '@interfaces/context'

export const StorageContext = createContext({} as TStorageContextData)

export const StorageProvider = ({ children }: TStorageProviderProps) => {
  const [values, setValues] = useState<TStorageContextValues>({
    tags: null,
    apiKey: null,
    projects: null,
    user: null,
    runningEntry: null,
  })

  const hasAllValues = useMemo(() => {
    return !!(values.apiKey && values.user && values.projects && values.tags)
  }, [values])

  const setStorage = useCallback(async (partialValues: Partial<TStorageContextValues>) => {
    await StorageHelper.set(partialValues)

    setValues(prev => ({
      ...prev,
      ...partialValues,
    }))
  }, [])

  const getStorage = useCallback((): Promise<TStorageContextValues> => {
    return StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'runningEntry'])
  }, [])

  useEffect(() => {
    StorageHelper.get(['apiKey', 'user', 'projects', 'tags', 'runningEntry']).then(storage => {
      setValues(prev => ({
        ...prev,
        ...storage,
      }))
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
    <StorageContext.Provider value={{ values, setStorage, getStorage, hasAllValues }}>
      {children}
    </StorageContext.Provider>
  )
}
