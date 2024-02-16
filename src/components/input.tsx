import { cloneElement, ComponentProps } from 'react'
import InputMask from 'react-input-mask'

import { StyleHelper } from '@helpers/style'

export type TInputProps = {
  leftIcon?: JSX.Element
  hasError?: boolean
  mask?: string
  label?: string
  containerClassName?: string
  error?: string
} & ComponentProps<'input'>

export const Input = ({
  leftIcon,
  className,
  mask,
  label,
  readOnly,
  containerClassName,
  error,
  ...props
}: TInputProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

  const Component = mask ? <InputMask mask={mask} maskChar={null} /> : <input />

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={props.name} className="text-grey-500 text-xs">
          {label}
        </label>
      )}

      <div className="w-full relative group outline-none">
        {leftIcon &&
          cloneElement(leftIcon, {
            className: StyleHelper.mergeStyles(
              'stroke-brand stroke-1 w-6 h-6 absolute top-1/2 -translate-y-1/2 left-2.5 group-focus-within:stroke-2',
              leftIconClassName
            ),
            ...leftIconProps,
          })}

        {cloneElement(Component, {
          className: StyleHelper.mergeStyles(
            'w-full h-7 text-sm bg-transparent pr-2.5 rounded placeholder-grey-500 ring-0 border outline-none transition-colors text-grey-100 disabled:opacity-50',
            {
              'border-red-600/70': error,
              'border-grey-500/30': !error,
              'focus:ring-brand focus:shadow-none': !readOnly && !error,
              'focus:ring-red-600 focus:shadow-none': !readOnly && error,
              'pl-10': !!leftIcon,
              'pl-2.5': !leftIcon,
            },
            className
          ),
          ...props,
          readOnly,
        })}
      </div>

      {!!error && <span className="text-xs text-red-600 mt-0.5 block">{error}</span>}
    </div>
  )
}
