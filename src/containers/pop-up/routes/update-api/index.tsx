import { useEffect } from 'react'
import { PrivatePopupLayout } from 'src/layouts/PrivatePopupLayout'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { PopupHeader } from '@components/popup-header'
import { useActions } from '@hooks/use-actions'
import { useStorage } from '@hooks/use-storage'
import { useUpdateApiKey } from '@hooks/use-update-api-key'

type TFormData = {
  apiKey: string
}

export const PopupUpdateApiPage = () => {
  const { values } = useStorage()
  const { updateApiKey } = useUpdateApiKey()

  const { actionData, setDataFromEventWrapper, setError, setData, actionState, handleAct } = useActions<TFormData>({
    apiKey: '',
  })

  const handleSubmit = () => {
    if (actionData.apiKey.length !== 48) {
      setError({
        apiKey: 'Invalid API key',
      })
      return
    }

    updateApiKey(actionData.apiKey)
  }

  useEffect(() => {
    setData({
      apiKey: values.apiKey,
    })
  }, [values.apiKey, setData])

  return (
    <PrivatePopupLayout>
      <PopupHeader />

      <div className="px-6">
        <div className="text-red-500 border border-red-500/20 rounded-md text-sm p-4 mt-6 mb-4 font-bold bg-red-500/10">
          Make sure of this action, when you update your API key, it will update all projects, tags and users data.
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleAct(handleSubmit)}>
          <Input
            label="YOUR API KEY"
            name="api-key"
            value={actionData.apiKey}
            onChange={setDataFromEventWrapper('apiKey')}
            error={actionState.errors.apiKey}
          />
          <Button colorSchema="red" type="submit" loading={actionState.isActing} disabled={!actionState.isValid}>
            Update
          </Button>
        </form>
      </div>
    </PrivatePopupLayout>
  )
}
