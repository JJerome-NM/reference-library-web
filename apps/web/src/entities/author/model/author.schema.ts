import { z } from "zod"
import {
  authorDtoSchema,
  authorStatisticDtoSchema,
  authorDetailsResponseSchema,
  createPageSchema,
} from "@/src/shared/api/schemas"

export {
  authorDtoSchema,
  authorStatisticDtoSchema,
  authorDetailsResponseSchema,
}

export const authorSortOptionSchema = z.enum([
  "INDEX_DESC",
  "RATING_ASC",
  "NAME_ASC",
])

export const authorSearchPayloadSchema = z.object({
  searchQuery: z.string().optional(),
  indexFrom: z.number().optional(),
  indexTo: z.number().optional(),
  onlyOrcid: z.boolean().optional(),
  onlyActivePubs: z.boolean().optional(),
  sortOption: authorSortOptionSchema.optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const authorSearchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const authorDetailsParamsSchema = z.object({
  searchQuery: z.string().optional(),
  sortOption: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const authorsPageSchema = createPageSchema(authorDtoSchema)
