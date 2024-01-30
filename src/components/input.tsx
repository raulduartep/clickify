import { cloneElement, ComponentProps } from 'react'
import InputMask from 'react-input-mask'

import { StyleHelper } from '@helpers/style'

export type TInputProps = {
  leftIcon?: JSX.Element
  hasError?: boolean
  flat?: boolean
  mask?: string
} & ComponentProps<'input'>

export const Input = ({ leftIcon, className, hasError = false, flat = false, mask, ...props }: TInputProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

  const Component = mask ? <InputMask mask={mask} maskChar={null} /> : <input />

  return (
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
          'w-full bg-transparent focus:shadow-none pr-2.5 rounded-sm placeholder-grey-500 border ring- ring-transparent outline-none transition-colors text-grey-100 disabled:opacity-50',
          {
            'border-red-600/70': hasError,
            'border-grey-600 focus:border-brand': !hasError,
            'pl-10': !!leftIcon,
            'pl-2.5': !leftIcon,
            'h-10': !flat,
            'h-7': flat,
          },
          className
        ),
        ...props,
      })}
    </div>
  )
}
