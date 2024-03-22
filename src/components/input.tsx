import { cloneElement, ComponentProps, forwardRef } from 'react'
import { IMaskInput } from 'react-imask'

import { StyleHelper } from '@helpers/style'

export type TInputProps = {
  hasError?: boolean
  mask?: string
  label?: string
  containerClassName?: string
  error?: string
  size?: 'sm' | 'md'
} & Omit<ComponentProps<'input'>, 'ref' | 'size'>

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  ({ className, mask, label, readOnly, containerClassName, error, size = 'md', ...props }, ref) => {
    const Component = mask ? <IMaskInput mask={mask} unmask={true} /> : <input />

    return (
      <div className={StyleHelper.mergeStyles('flex flex-col group', containerClassName)} ref={ref}>
        {label && (
          <label
            htmlFor={props.name}
            className="text-grey-500 transition-colors text-2xs group-focus-within:text-brand"
          >
            {label}
          </label>
        )}

        {cloneElement(Component, {
          className: StyleHelper.mergeStyles(
            'w-full bg-transparent placeholder-grey-500 border outline-none transition-colors text-grey-100 disabled:opacity-50',
            {
              'border-red-600/70 focus:border-red-600': error,
              'border-grey-500/30 focus:border-brand': !error,
              'px-2.5 text-sm h-7 rounded': size === 'md',
              'px-1.5 text-xs h-5 rounded-sm': size === 'sm',
            },
            className
          ),
          readOnly,
          autoComplete: 'off',
          ...props,
        })}

        {!!error && <span className="text-xs text-red-600 mt-0.5 block">{error}</span>}
      </div>
    )
  }
)
