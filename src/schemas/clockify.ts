import { z } from 'zod'

export const clockifyTimeEntrySchema = z
  .object({
    id: z.string(),
    description: z.string(),
    projectId: z
      .string()
      .nullish()
      .transform(value => value ?? undefined),
    userId: z.string(),
    tagIds: z
      .array(z.string())
      .nullish()
      .transform(value => value ?? undefined),
    timeInterval: z.object({
      start: z.string(),
      end: z
        .string()
        .nullish()
        .transform(value => value ?? undefined),
    }),
    workspaceId: z.string(),
  })
  .transform(({ description, id, timeInterval, userId, workspaceId, projectId, tagIds }) => {
    const tagId = tagIds?.[0]
    return {
      id,
      tagId,
      description,
      projectId,
      userId,
      timeInterval,
      workspaceId,
    }
  })
export type TClockifyTimeEntry = z.infer<typeof clockifyTimeEntrySchema>

export const clockifyUserSchema = z.object({
  id: z.string(),
  activeWorkspace: z.string(),
  profilePicture: z
    .string()
    .nullish()
    .transform(value => value ?? undefined),
  name: z.string(),
})
export type TClockifyUser = z.infer<typeof clockifyUserSchema>

export const clockifyProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  listNames: z
    .array(z.string())
    .nullish()
    .transform(value => value ?? []),
})
export type TClockifyProject = z.infer<typeof clockifyProjectSchema>

export const clockifyTagSchema = z.object({
  id: z.string(),
  name: z.string(),
})
export type TClockifyTag = z.infer<typeof clockifyTagSchema>
