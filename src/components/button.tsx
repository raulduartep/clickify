import { ComponentProps } from 'react'

import { StyleHelper } from '@helpers/style'

import { Loader } from './loader'

type TProps = {
  variant?: 'contained' | 'outlined'
  label: string
  loading?: boolean
  flat?: boolean
} & ComponentProps<'button'>

const ContainedButton = ({ label, loading = false, className, disabled = false, flat = false, ...props }: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        'flex justify-center items-center rounded-sm bg-brand !text-grey-100 font-bold transition-colors',
        'aria-[disabled=false]:hover:bg-brand/90 cursor-pointer',
        'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
        {
          'min-h-[2.5rem] px-4 text-sm': !flat,
          'min-h-[1.75rem] px-3 text-xs': flat,
        },
        className
      )}
      type="submit"
      aria-disabled={loading || disabled}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader /> : label}
    </button>
  )
}

const OutlinedButton = ({ label, className, loading = false, disabled = false, flat = false, ...props }: TProps) => {
  return (
    <button
      className={StyleHelper.mergeStyles(
        'flex justify-center items-center rounded-sm border border-brand !text-brand font-bold transition-colors',
        'aria-[disabled=false]:hover:bg-brand/20',
        'aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50',
        {
          'min-h-[2.5rem] px-4 text-sm': !flat,
          'min-h-[1.75rem] px-3 text-xs': flat,
        },
        className
      )}
      aria-disabled={loading || disabled}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader className="stroke-brand" /> : label}
    </button>
  )
}

export const Button = ({ variant = 'contained', ...props }: TProps) => {
  return variant === 'contained' ? <ContainedButton {...props} /> : <OutlinedButton {...props} />
}
