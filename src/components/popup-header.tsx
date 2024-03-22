import { useLocation, useNavigate } from 'react-router-dom'
import { IconChevronLeft, IconDotsVertical } from '@tabler/icons-react'

import Logo from '@assets/images/icon.svg?react'
import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'

import { DropdownMenu } from './dropdown-menu'
import { IconButton } from './icon-button'

type TProps = {
  withBackButton?: boolean
  actions?: React.ReactNode
  className?: string
}

export const PopupHeader = ({ withBackButton = true, actions, className }: TProps) => {
  const { values } = useStorage()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChangeApiClick = () => {
    navigate('/update-api')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <header
      className={StyleHelper.mergeStyles(
        'flex justify-between px-6 pb-3 items-center border-b-2 pt-3 border-grey-600',
        className
      )}
    >
      <div className="flex gap-2 items-center">
        {withBackButton && location.key !== 'default' && (
          <IconButton icon={<IconChevronLeft />} size="lg" colorScheme="gray" onClick={handleBackClick} />
        )}

        <Logo className="-mb-2 h-6 object-contain" />
      </div>

      <div className="flex gap-2">
        {actions}

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <IconButton icon={<IconDotsVertical />} size="lg" colorScheme="gray" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Label className="flex items-center gap-2">
              <span>{values.user?.name}</span>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item className="text-red-500 focus:bg-red-500/10" onClick={handleChangeApiClick}>
              Update API Key
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
