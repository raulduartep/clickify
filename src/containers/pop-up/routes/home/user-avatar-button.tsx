import { IconChevronDown } from '@tabler/icons-react'

import { StyleHelper } from '@helpers/style'
import { useStorage } from '@hooks/use-storage'

export const UserAvatarButton = () => {
  const {
    values: { user },
    hasAllValues,
  } = useStorage()

  return (
    <button
      disabled={!hasAllValues}
      className={StyleHelper.mergeStyles('h-10 w-10 rounded-full border-2 bg-grey-500 border-brand relative', {
        'cursor-not-allowed opacity-50': !hasAllValues,
        'group cursor-pointer transition-colors hover:border-brand-600': hasAllValues,
      })}
    >
      {!!user?.profilePicture && (
        <img src={user.profilePicture} alt="User avatar" className="h-full w-full rounded-full object-cover" />
      )}

      <div
        className={StyleHelper.mergeStyles(
          'bg-brand p-0.5 w-min h-min rounded-full text-grey-100 absolute -right-1 -bottom-1 border-2 border-grey-800',
          {
            'transition-colors group-hover:bg-brand-600': hasAllValues,
          }
        )}
      >
        <IconChevronDown className="w-3 h-3" />
      </div>
    </button>
  )
}
