import { z } from 'zod'

const envSchema = z.object({
  VITE_TEST_CLICKUP_TASK_ID: z
    .string()
    .optional()
    .transform(val => val ?? ''),
  VITE_TEST_CLICKUP_TASK_NAME: z
    .string()
    .optional()
    .transform(val => val ?? ''),
  VITE_TEST_CLICKUP_TASK_PROJECT_NAME: z
    .string()
    .optional()
    .transform(val => val ?? ''),
  DEV: z.boolean(),
})

export const EnvHelper = envSchema.parse(import.meta.env)
