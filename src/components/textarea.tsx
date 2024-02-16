import { forwardRef, TextareaHTMLAttributes } from 'react'

import { StyleHelper } from '@helpers/style'

type TProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  containerClassName?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TProps>(({ className, label, containerClassName, ...props }, ref) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={props.name} className="text-grey-500 text-xs">
        {label}
      </label>
      <textarea
        className={StyleHelper.mergeStyles(
          'flex min-h-[60px] w-full rounded border border-grey-600 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-grey-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})

export { Textarea }
