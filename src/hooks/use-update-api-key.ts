import { useCallback } from 'react'
import { clockifyProjectSchema, clockifyUserSchema } from 'src/schemas/clockify'

import { createClockifyAxios } from '@services/clockify'

import { useStorage } from './use-storage'

export const useUpdateApiKey = () => {
  const { setStorage } = useStorage()

  const updateApiKey = useCallback(
    async (apiKey: string) => {
      const clockifyAxios = createClockifyAxios(apiKey)

      const { data } = await clockifyAxios.get('/user')
      const user = clockifyUserSchema.parse(data)

      if (user.profilePicture) {
        try {
          const response = await fetch(user.profilePicture, { method: 'GET', mode: 'no-cors' })
          if (!response.ok) throw new Error('Network response was not ok')
        } catch (error) {
          user.profilePicture = undefined
        }
      }

      const [projectsResponse, tagsResponse] = await Promise.all([
        clockifyAxios.get(`/workspaces/${user.activeWorkspace}/projects`),
        clockifyAxios.get(`workspaces/${user.activeWorkspace}/tags?archived=false`),
      ])

      const projects = clockifyProjectSchema.array().parse(projectsResponse.data)
      const tags = clockifyProjectSchema.array().parse(tagsResponse.data)

      await setStorage({
        apiKey,
        projects,
        tags,
        user,
      })
    },
    [setStorage]
  )

  return {
    updateApiKey,
  }
}
