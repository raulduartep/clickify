import { ChangeEvent, FormEvent, MouseEvent, useCallback, useRef, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'

import { KeysMatching, TActionData, TActionErrors, TActionState } from '@interfaces/use-actions'

const initialState = {
  isValid: false,
  isActing: false,
  errors: {} as any,
  changed: {} as any,
}

export const useActions = <T extends TActionData>(initialData: T) => {
  const [actionData, setPrivateActionData] = useState<T>(initialData)
  const [actionState, setPrivateActionState] = useState<TActionState<T>>(initialState)

  const actionDataRef = useRef<T>(initialData)
  const actionStateRef = useRef<TActionState<T>>(initialState)

  const setState = useCallback(
    (values: Partial<TActionState<T>> | ((prev: TActionState<T>) => Partial<TActionState<T>>)) => {
      let newValues: Partial<TActionState<T>>

      if (typeof values === 'function') {
        newValues = values(actionStateRef.current)
      } else {
        newValues = values
      }

      setPrivateActionState(prev => ({ ...prev, ...newValues }))
      actionStateRef.current = { ...actionStateRef.current, ...newValues }
    },
    []
  )

  const checkIfHasError = useCallback(() => {
    const hasSomeError = Object.keys(actionStateRef.current.errors).length > 0
    if (hasSomeError) {
      setState({ isValid: false })
      return
    }

    setState({ isValid: true })
  }, [setState])

  const setError = useCallback(
    (errors: Partial<Record<keyof T, string>>) => {
      setState(prev => ({ errors: { ...prev.errors, ...errors } }))

      checkIfHasError()
    },
    [checkIfHasError, setState]
  )

  const clearErrors = useCallback(
    (key?: keyof T | (keyof T)[]) => {
      let newErrors = {} as TActionErrors<T>
      const keys = key ? (Array.isArray(key) ? key : [key]) : undefined

      if (keys) {
        newErrors = cloneDeep(actionStateRef.current.errors)
        keys.forEach(k => {
          delete newErrors[k]
        })
      }

      setState({ errors: newErrors })
      checkIfHasError()
    },
    [setState, checkIfHasError]
  )

  const setData = useCallback(
    (values: Partial<T> | ((prev: T) => Partial<T>)) => {
      let newValues: Partial<T>

      if (typeof values === 'function') {
        newValues = values(actionDataRef.current)
      } else {
        newValues = values
      }

      setPrivateActionData({ ...actionDataRef.current, ...newValues })
      actionDataRef.current = { ...actionDataRef.current, ...newValues }

      clearErrors(Object.keys(newValues) as (keyof T)[])
    },
    [clearErrors]
  )

  const setDataFromEventWrapper = useCallback(
    (key: KeysMatching<T, string>) => {
      return (event: ChangeEvent) => {
        if (typeof (event.target as any).value !== 'string') throw new Error('Invalid event')
        setData({ [key]: (event.target as any).value } as Partial<T>)
      }
    },
    [setData]
  )

  const setDataItemWrapper = useCallback(
    <K extends keyof T>(key: K) => {
      return (value: T[K]) => {
        setData({ [key]: value } as unknown as Partial<T>)
      }
    },
    [setData]
  )

  const handleAct = useCallback((callback: () => void | Promise<void>) => {
    return async (event: FormEvent | MouseEvent) => {
      event.preventDefault()

      try {
        setPrivateActionState(prev => ({ ...prev, isActing: true }))
        await callback()
      } finally {
        setPrivateActionState(prev => ({ ...prev, isActing: false }))
      }
    }
  }, [])

  const reset = useCallback(() => {
    setPrivateActionData(initialData)
    setPrivateActionState(initialState)
    actionDataRef.current = initialData
    actionStateRef.current = initialState
  }, [initialData])

  return {
    actionData,
    setData,
    setDataFromEventWrapper,
    setDataItemWrapper,
    setError,
    clearErrors,
    actionState,
    handleAct,
    reset,
  }
}
