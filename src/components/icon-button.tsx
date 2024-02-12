import { cloneElement, ComponentProps, forwardRef } from 'react'

import { StyleHelper } from '@helpers/style'

type TIconButtonColorScheme = 'brand' | 'gray' | 'red'

export type TIconButtonProps = {
  icon: JSX.Element
  size?: 'xs' | 'lg'
  colorScheme?: TIconButtonColorScheme
} & ComponentProps<'button'>

export const IconButton = forwardRef<HTMLButtonElement, TIconButtonProps>(
  ({ icon, className, disabled = false, size = 'xs', colorScheme = 'brand', ...props }, ref) => {
    const { className: iconClassName, ...iconProps } = icon.props
    return (
      <button
        aria-disabled={disabled}
        disabled={disabled}
        className={StyleHelper.mergeStyles(
          'flex items-center justify-center',
          'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-40',
          {
            'min-w-[1rem] max-w-[1rem] min-h-[1rem] max-h-[1rem] rounded-sm': size === 'xs',
            'min-w-[1.5rem] max-w-[1.5rem] min-h-[1.5rem] max-h-[1.5rem] rounded-md': size === 'lg',
            'text-brand aria-[disabled=false]:hover:bg-brand/2 aria-[expanded=true]:bg-brand/2':
              colorScheme === 'brand',
            'text-grey-500 aria-[disabled=false]:hover:bg-grey-500/20 aria-[expanded=true]:bg-grey-500/20':
              colorScheme === 'gray',
            'text-red-500/75 aria-[disabled=false]:hover:bg-red-500/20 aria-[expanded=true]:bg-red-500/20':
              colorScheme === 'red',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {cloneElement(icon, {
          ...iconProps,
          className: StyleHelper.mergeStyles(
            StyleHelper.mergeStyles({
              'w-3 h-3': size === 'xs',
              'w-5 h-5': size === 'lg',
            }),
            iconClassName
          ),
        })}
      </button>
    )
  }
)
