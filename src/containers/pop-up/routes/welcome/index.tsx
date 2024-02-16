import { useNavigate } from 'react-router-dom'
import { MainPopupLayout } from 'src/layouts/MainPopupLayout'

import Logo from '@assets/images/icon.svg?react'
import { Button } from '@components/button'
import { Input } from '@components/input'
import { useActions } from '@hooks/use-actions'
import { useStorage } from '@hooks/use-storage'
import { useUpdateApiKey } from '@hooks/use-update-api-key'

type TFormData = {
  apiKey: string
}

export const PopupWelcomePage = () => {
  const { updateApiKey } = useUpdateApiKey()
  const { setStorage } = useStorage()
  const navigate = useNavigate()

  const { actionData, setDataFromEventWrapper, setError, actionState, handleAct } = useActions<TFormData>({
    apiKey: '',
  })

  const handleSubmit = async () => {
    if (actionData.apiKey.length !== 48) {
      setError({
        apiKey: 'Invalid API key',
      })
      return
    }

    await updateApiKey(actionData.apiKey)
    await setStorage({ isFirstTime: false })
    navigate('/')
  }

  return (
    <MainPopupLayout>
      <div className="px-6 flex flex-col text-grey-100 justify-between ">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold  mt-12">Welcome to</p>

          <Logo className="h-auto w-36 object-contain" />

          <p className="text-sm bg-brand/10 font-medium rounded-md px-4 py-2 mt-8 text-center">
            You need to provide us with your Clockify API KEY. We will use it to request the Clockify API to create,
            update and list your time entries.
          </p>
        </div>

        <form className="flex flex-col gap-2 mt-4" onSubmit={handleAct(handleSubmit)}>
          <Input
            value={actionData.apiKey}
            onChange={setDataFromEventWrapper('apiKey')}
            label="YOUR API KEY"
            name="api-key"
            error={actionState.errors.apiKey}
          />

          <Button type="submit" loading={actionState.isActing} disabled={!actionState.isValid}>
            Send
          </Button>
        </form>
      </div>
    </MainPopupLayout>
  )
}
