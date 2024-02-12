import { useCallback } from "react";
import { useQueryClient } from "react-query";

import { DateUTCHelper } from "@helpers/date";
import { TStartEntryParams } from "@interfaces/use-clockify";
import { ClockifyService } from "@services/clockify";

import { USE_COMPLETED_ENTRIES_LIST_QUERY_KEY } from "./use-completed-entries-list";
import { useStorage } from "./use-storage";

export const useClockify = () => {
  const { values, setStorage, removeStorage } = useStorage()
  const queryClient = useQueryClient()

  const playEntry = useCallback(
    async ({ description, projectId, tagId }: TStartEntryParams) => {
      if (!values.apiKey || !values.user) {
        throw new Error(
          'API Key, User or Projects not found. You need to open the extension popup and set your API Key.'
        )
      }

      const start = DateUTCHelper.formattedNowDateTime()

      const createdTimeEntry = await ClockifyService.createNewTimeEntry({
        body: {
          billable: true,
          description: description ?? "",
          start,
          projectId,
          tagIds: tagId ? [tagId] : undefined,
        },
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })

      setStorage({ runningEntry: createdTimeEntry })
    },
    [setStorage, values.apiKey, values.user]
  )

  const stopEntry = useCallback(async () => {
    try {
      if (!values.apiKey || !values.user) {
        throw new Error('API Key or User not found. You need to open the extension popup and set your API Key.')
      }

      const end = DateUTCHelper.formattedNowDateTime()
      await ClockifyService.stopRunningTimeEntry({
        body: {
          end,
        },
        userId: values.user.id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })

      queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], (data: any) => {
        if (!data) return

        return {
          ...data,
          pages: [
            {
              ...data.pages[0],
              data: [
                {
                  ...values.runningEntry,
                  timeInterval: {
                    ...values.runningEntry?.timeInterval,
                    end,
                  },
                },
                ...data.pages[0].data,
              ],
            },
            ...data.pages.slice(1),
          ]
        }
      })
    } finally {
      removeStorage("runningEntry")
    }
  }, [values.apiKey, values.user, removeStorage, queryClient, values.runningEntry])

  const deleteTimeEntry = useCallback(
    async (id: string) => {
      if (!values.apiKey || !values.user) {
        throw new Error('API Key or User not found. You need to open the extension popup and set your API Key.')
      }

      await ClockifyService.deleteTimeEntry({
        id,
        config: {
          apiKey: values.apiKey,
          workspaceId: values.user.activeWorkspace,
        },
      })

      if (values.runningEntry?.id === id) {
        removeStorage("runningEntry")
      }

      queryClient.setQueryData([USE_COMPLETED_ENTRIES_LIST_QUERY_KEY], (data: any) => {
        if (!data) return

        return {
          ...data,
          pages: data.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((entry: any) => entry.id !== id),
          })),
        }
      })
    },
    [values.apiKey, values.user, queryClient, removeStorage, values.runningEntry]
  )

  return {
    playEntry,
    stopEntry,
    deleteTimeEntry
  }
};
