import { useState } from "react"

import { ClockifyService } from "@services/clockify"

import { useStorage } from "./use-storage"

export const useUpdateApiKey = () => {
  const { setStorage } = useStorage()

  const [apiKey, setApiKey] = useState('')
  const [fetching, setFetching] = useState(false)

  const handleUpdateKey = async () => {
    try {
      setFetching(true)

      const user = await ClockifyService.getUser(apiKey)

      if (user.profilePicture) {
        try {
          const response = await fetch(user.profilePicture, { method: 'GET', mode: 'no-cors' })
          if (!response.ok) throw new Error('Network response was not ok')
        } catch (error) {
          user.profilePicture = undefined
        }
      }

      const [projects, tags] = await Promise.all([
        ClockifyService.getAllProjects({ apiKey, workspaceId: user.activeWorkspace }),
        ClockifyService.getAllTags({ apiKey, workspaceId: user.activeWorkspace }),
      ])

      const projectsWithClickupList = projects.map(project => ({
        ...project,
        clickupListNames: [],
      }))

      setStorage({
        apiKey,
        projects: projectsWithClickupList,
        tags,
        user,
      })
    } finally {
      setFetching(false)
    }
  }

  return {
    apiKey,
    setApiKey,
    fetching,
    handleUpdateKey,
  }

}