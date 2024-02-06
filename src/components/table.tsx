import * as React from 'react'

import { StyleHelper } from '@helpers/style'

const Root = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={StyleHelper.mergeStyles('w-full caption-bottom text-sm gap-1', className)}
        {...props}
      />
    </div>
  )
)

const Header = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={StyleHelper.mergeStyles('[&_tr]:border-b', className)} {...props} />
  )
)

const Body = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={StyleHelper.mergeStyles('[&_tr:last-child]:border-0', className)} {...props} />
  )
)

const Footer = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={StyleHelper.mergeStyles('border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
)

const Row = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={StyleHelper.mergeStyles('border-b border-grey-600', className)} {...props} />
  )
)

const Head = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={StyleHelper.mergeStyles(
        'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
)

const Cell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={StyleHelper.mergeStyles(
        'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
)

const Caption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={StyleHelper.mergeStyles('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)

export const Table = { Root, Body, Caption, Cell, Footer, Head, Header, Row }
