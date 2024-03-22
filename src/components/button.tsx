import { cloneElement, ComponentProps, forwardRef } from 'react'

import { StyleHelper } from '@helpers/style'

import { Loader } from './loader'

type TProps = {
  variant?: 'contained' | 'outlined'
  loading?: boolean
  leftIcon?: JSX.Element
  colorSchema?: 'brand' | 'red' | 'gray'
  size?: 'sm' | 'md'
} & ComponentProps<'button'>

const ContainedButton = forwardRef<HTMLButtonElement, TProps>(
  ({ loading = false, className, disabled = false, leftIcon, colorSchema, children, size = 'md', ...props }, ref) => {
    const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

    const buildIconClassName = (className: string) => {
      return StyleHelper.mergeStyles(
        'object-contain group-aria-[disabled=true]:fill-gray-100/50',
        {
          'w-4 h-4': size === 'md',
          'w-3 h-3': size === 'sm',
        },
        className
      )
    }

    return (
      <button
        ref={ref}
        className={StyleHelper.mergeStyles(
          'flex justify-center items-center  !text-grey-100 font-bold transition-colors cursor-pointer',
          'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
          {
            'bg-red-500 aria-[disabled=false]:hover:bg-red-500/90 aria-[expanded=true]:bg-red-500/90':
              colorSchema === 'red',
            'bg-brand aria-[disabled=false]:hover:bg-brand/90 aria-[expanded=true]:bg-brand/90':
              colorSchema === 'brand',
            'bg-grey-600 aria-[disabled=false]:hover:bg-grey-600/90 aria-[expanded=true]:bg-grey-600/90':
              colorSchema === 'gray',
            'px-1.5 text-xs h-5 min-h- 1.25rem] rounded-sm': size === 'sm',
            'h-7 min-h-[1.75rem] gap-2.5 px-2.5 rounded text-sm': size === 'md',
          },
          className
        )}
        type="submit"
        aria-disabled={loading || disabled}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {leftIcon &&
              cloneElement(leftIcon, {
                className: buildIconClassName(leftIconClassName),
                ...leftIconProps,
              })}

            <span className={StyleHelper.mergeStyles('font-medium whitespace-nowrap')}>{children}</span>
          </>
        )}
      </button>
    )
  }
)

const OutlinedButton = forwardRef<HTMLButtonElement, TProps>(
  ({ children, className, loading = false, colorSchema, disabled = false, leftIcon, size = 'md', ...props }, ref) => {
    const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

    const buildIconClassName = (className: string) => {
      return StyleHelper.mergeStyles(
        'object-contain group-aria-[disabled=true]:fill-gray-100/50',
        {
          'w-4 h-4': size === 'md',
          'w-3 h-3': size === 'sm',
        },
        className
      )
    }

    return (
      <button
        ref={ref}
        className={StyleHelper.mergeStyles(
          'flex justify-center items-center rounded border font-bold transition-colors',
          'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
          {
            'border-brand !text-brand aria-[disabled=false]:hover:bg-brand/20 aria-[expanded=true]:bg-brand/20':
              colorSchema === 'brand',
            'border-red-500 !text-red-500 aria-[disabled=false]:hover:bg-red-500/20 aria-[expanded=true]:bg-red-500/20':
              colorSchema === 'red',
            'border-grey-600 !text-grey-100 aria-[disabled=false]:hover:bg-grey-600/50 aria-[expanded=true]:bg-grey-600/50':
              colorSchema === 'gray',
            'px-1.5 text-xs h-5 min-h- 1.25rem] rounded-sm': size === 'sm',
            'h-7 min-h-[1.75rem] gap-2.5 px-2.5 rounded text-sm': size === 'md',
          },
          className
        )}
        aria-disabled={loading || disabled}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {leftIcon &&
              cloneElement(leftIcon, {
                className: buildIconClassName(leftIconClassName),
                ...leftIconProps,
              })}

            <span className={StyleHelper.mergeStyles('font-medium whitespace-nowrap')}>{children}</span>
          </>
        )}
      </button>
    )
  }
)

export const Button = forwardRef<HTMLButtonElement, TProps>(
  ({ variant = 'contained', colorSchema = 'brand', ...props }, ref) => {
    return variant === 'contained' ? (
      <ContainedButton colorSchema={colorSchema} {...props} ref={ref} />
    ) : (
      <OutlinedButton colorSchema={colorSchema} {...props} ref={ref} />
    )
  }
)
