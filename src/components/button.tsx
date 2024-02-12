import { cloneElement, ComponentProps } from 'react'

import { StyleHelper } from '@helpers/style'

import { Loader } from './loader'

type TProps = {
  variant?: 'contained' | 'outlined'
  loading?: boolean
  leftIcon?: JSX.Element
  colorSchema?: 'brand' | 'red'
} & ComponentProps<'button'>

const ContainedButton = ({
  loading = false,
  className,
  disabled = false,
  leftIcon,
  colorSchema,
  children,
  ...props
}: TProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

  const buildIconClassName = (className: string) => {
    return StyleHelper.mergeStyles('object-contain group-aria-[disabled=true]:fill-gray-100/50 w-4 h-4', className)
  }

  return (
    <button
      className={StyleHelper.mergeStyles(
        'flex justify-center items-center min-h-[1.75rem] gap-1.5 px-3 text-sm rounded !text-grey-100 font-bold transition-colors cursor-pointer',
        'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
        {
          'bg-red-500 aria-[disabled=false]:hover:bg-red-500/90': colorSchema === 'red',
          'bg-brand aria-[disabled=false]:hover:bg-brand/90': colorSchema === 'brand',
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

const OutlinedButton = ({ children, className, loading = false, disabled = false, leftIcon, ...props }: TProps) => {
  const { className: leftIconClassName = '', ...leftIconProps } = leftIcon ? leftIcon.props : {}

  const buildIconClassName = (className: string) => {
    return StyleHelper.mergeStyles('object-contain group-aria-[disabled=true]:fill-gray-100/50 w-5 h-5', className)
  }

  return (
    <button
      className={StyleHelper.mergeStyles(
        'flex justify-center items-center rounded border min-h-[1.75rem] px-3 text-sm border-brand !text-brand font-bold transition-colors',
        'aria-[disabled=false]:hover:bg-brand/20',
        'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
        className
      )}
      aria-disabled={loading || disabled}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Loader className="stroke-brand" />
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

export const Button = ({ variant = 'contained', colorSchema = 'brand', ...props }: TProps) => {
  return variant === 'contained' ? (
    <ContainedButton colorSchema={colorSchema} {...props} />
  ) : (
    <OutlinedButton {...props} />
  )
}
