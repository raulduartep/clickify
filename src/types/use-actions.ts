export type TActionData = Record<string, any>

export type TActionErrors<T> = Record<keyof T, string | undefined>

export type TActionState<T> = {
  isValid: boolean
  isActing: boolean
  errors: TActionErrors<T>
}

export type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];