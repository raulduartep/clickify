import { IconLoader2, TablerIconsProps } from '@tabler/icons-react'

import { StyleHelper } from '@helpers/style'

export const Loader = ({ className, ...props }: TablerIconsProps) => {
  return <IconLoader2 className={StyleHelper.mergeStyles('w-4 h-4 text-grey-100 animate-spin', className)} {...props} />
}
