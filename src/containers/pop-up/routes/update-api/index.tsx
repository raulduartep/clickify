import { ChangeEvent, Fragment, useEffect } from 'react'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { PopupHeader } from '@components/popup-header'
import { useStorage } from '@hooks/use-storage'
import { useUpdateApiKey } from '@hooks/use-update-api-key'

export const PopupUpdateApiPage = () => {
  const { values } = useStorage()
  const { apiKey, fetching, handleUpdateKey, setApiKey } = useUpdateApiKey()

  const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value)
  }

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleUpdateKey()
  }

  useEffect(() => {
    setApiKey(values.apiKey ?? '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.apiKey])

  return (
    <Fragment>
      <PopupHeader />

      <div className="px-6">
        <div className="text-red-500 border border-red-500/20 rounded-md text-sm p-4 mt-6 mb-4 font-bold bg-red-500/10">
          Make sure of this action, when you update your API key, it will update all projects, tags and users data.
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Input label="YOUR API KEY" name="api-key" value={apiKey} onChange={handleApiKeyChange} />
          <Button colorSchema="red" label="Update" type="submit" loading={fetching} />
        </form>
      </div>
    </Fragment>
  )
}
