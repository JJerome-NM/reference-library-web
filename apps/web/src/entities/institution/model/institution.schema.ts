import { z } from "zod"
import {
  institutionDtoSchema,
  authorDtoSchema,
  createPageSchema,
} from "@/src/shared/api/schemas"

export { institutionDtoSchema }

export const institutionDetailsResponseSchema = z.object({
  institution: institutionDtoSchema,
  authors: createPageSchema(authorDtoSchema),
  authorCount: z.number(),
})

export const institutionSortOptionSchema = z.enum([
  "INDEX_DESC",
  "NAME_ASC",
  "AUTHORS_DESC",
])

export const institutionSearchPayloadSchema = z.object({
  searchQuery: z.string().optional(),
  indexFrom: z.number().optional(),
  indexTo: z.number().optional(),
  country: z.string().optional(),
  sortOption: institutionSortOptionSchema.optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const institutionSearchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const institutionsPageSchema = createPageSchema(institutionDtoSchema)
