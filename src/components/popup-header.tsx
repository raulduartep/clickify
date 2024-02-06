import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react'

import Logo from '@assets/images/icon.svg?react'
import { StyleHelper } from '@helpers/style'
import { UtilsHelper } from '@helpers/utils'
import { useStorage } from '@hooks/use-storage'

import { DropdownMenu } from './dropdown-menu'
import { IconButton } from './icon-button'

type TProps = {
  withBackButton?: boolean
}

export const PopupHeader = ({ withBackButton = true }: TProps) => {
  const { values, hasAllValues } = useStorage()
  const navigate = useNavigate()

  const [hasPictureError, setHasPictureError] = useState<boolean>(false)

  const handleChangeApiClick = () => {
    navigate('/update-api')
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  const handleErrorProfilePicture = () => {
    setHasPictureError(true)
  }

  return (
    <header className="flex justify-between px-6 pb-4 border-b-2 border-grey-600 items-center">
      <div className="flex gap-4 items-center">
        {withBackButton && (
          <IconButton icon={<IconChevronLeft />} size="lg" colorScheme="gray" onClick={handleBackClick} />
        )}

        <Logo className="-mb-2" />
      </div>

      <div className="flex">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild disabled={!hasAllValues}>
            <button
              className={StyleHelper.mergeStyles(
                'h-10 w-10 rounded-full border-2 bg-brand/20 border-brand relative outline-none',
                'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                {
                  'cursor-not-allowed opacity-50': !hasAllValues,
                  'group cursor-pointer transition-colors hover:border-brand-600': hasAllValues,
                }
              )}
            >
              {values.user?.name && (hasPictureError || !values.user?.profilePicture) ? (
                <span>{UtilsHelper.extractFirstLetters(values.user.name)}</span>
              ) : (
                values.user?.profilePicture && (
                  <img
                    src={values.user.profilePicture}
                    alt="User avatar"
                    className="h-full w-full rounded-full object-cover"
                    onError={handleErrorProfilePicture}
                  />
                )
              )}

              <div
                className={StyleHelper.mergeStyles(
                  'bg-brand p-0.5 w-min h-min rounded-full text-grey-100 absolute -right-1 -bottom-1 border-2 border-grey-800 group-data-[disabled]:group-hover:bg-brand',
                  {
                    'transition-colors group-hover:bg-brand-600': hasAllValues,
                  }
                )}
              >
                <IconChevronDown className="w-3 h-3" />
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Label>{values.user?.name}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Link Projects</DropdownMenu.Item>
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