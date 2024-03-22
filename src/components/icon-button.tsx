import { cloneElement, ComponentProps, forwardRef } from 'react'

import { StyleHelper } from '@helpers/style'

type TIconButtonColorScheme = 'brand' | 'gray' | 'red'

export type TIconButtonProps = {
  icon: JSX.Element
  size?: 'xs' | 'sm' | 'lg'
  colorScheme?: TIconButtonColorScheme
  contained?: boolean
} & ComponentProps<'button'>

export const IconButton = forwardRef<HTMLButtonElement, TIconButtonProps>(
  ({ icon, className, disabled = false, size = 'xs', contained, colorScheme = 'brand', ...props }, ref) => {
    const { className: iconClassName, ...iconProps } = icon.props
    return (
      <button
        aria-disabled={disabled}
        disabled={disabled}
        className={StyleHelper.mergeStyles(
          'flex items-center justify-center outline-none transition-colors',
          'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-40',
          {
            'min-w-[1rem] max-w-[1rem] min-h-[1rem] max-h-[1rem] rounded-sm': size === 'xs',
            'min-w-[1.75rem] max-w-[1.75rem] min-h-[1.75rem] max-h-[1.75rem] rounded': size === 'lg',
            'min-w-[1.25rem] max-w-[1.25rem] min-h-[1.25rem] max-h-[1.25rem] rounded-sm': size === 'sm',
            'text-brand aria-[disabled=false]:hover:bg-brand/20 aria-[expanded=true]:bg-brand/20':
              colorScheme === 'brand' && !contained,
            'text-grey-500 aria-[disabled=false]:hover:bg-grey-500/20 aria-[expanded=true]:bg-grey-500/20':
              colorScheme === 'gray' && !contained,
            'text-red-500/75 aria-[disabled=false]:hover:bg-red-500/20 aria-[expanded=true]:bg-red-500/20':
              colorScheme === 'red' && !contained,
            'bg-brand text-grey-100 aria-[disabled=false]:hover:bg-brand/75 aria-[expanded=true]:bg-brand/75':
              colorScheme === 'brand' && contained,
            'text-grey-100 aria-[disabled=false]:hover:bg-grey-500/50 bg-grey-500/50 aria-[expanded=true]:bg-grey-500/50':
              colorScheme === 'gray' && contained,
            'text-grey-100 aria-[disabled=false]:hover:bg-red-500/50 bg-red-500/75 aria-[expanded=true]:bg-red-500/50':
              colorScheme === 'red' && contained,
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
              'w-4 h-4': size === 'sm',
              'w-5 h-5': size === 'lg',
            }),
            iconClassName
          ),
        })}
      </button>
    )
  }
)
