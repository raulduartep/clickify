import { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import Logo from '@assets/images/icon.svg?react'
import { Button } from '@components/button'
import { Input } from '@components/input'
import { useStorage } from '@hooks/use-storage'
import { useUpdateApiKey } from '@hooks/use-update-api-key'

export const PopupWelcomePage = () => {
  const { apiKey, fetching, handleUpdateKey, setApiKey } = useUpdateApiKey()
  const { setStorage } = useStorage()
  const navigate = useNavigate()

  const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value)
  }

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleUpdateKey()
    setStorage({ isFirstTime: false })
    navigate('/')
  }

  return (
    <div className="px-6 flex flex-col text-grey-100 justify-between ">
      <div className="flex flex-col items-center">
        <p className="text-4xl font-bold  mt-12">Welcome to</p>

        <Logo className="h-auto w-36 object-contain" />

        <p className="text-sm bg-brand/10 font-medium rounded-md px-4 py-2 mt-8 text-center">
          You need to provide us with your Clockify API KEY. We will use it to request the Clockify API to create,
          update and list your time entries.
        </p>
      </div>

      <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
        <Input value={apiKey} onChange={handleApiKeyChange} label="YOUR API KEY" name="api-key" />
        <Button label="Send" type="submit" loading={fetching} />
      </form>
    </div>
  )
}
