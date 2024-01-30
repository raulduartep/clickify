import { ComponentProps } from 'react'

import { StyleHelper } from '@helpers/style'

type TProps = ComponentProps<'div'>

export const Separator = ({ className, ...props }: TProps) => {
  return <div className={StyleHelper.mergeStyles('w-full h-px bg-grey-600', className)} {...props} />
}
