import { z } from "zod"
import {
  fullPublicationDtoSchema,
  createPageSchema,
} from "@/src/shared/api/schemas"

export { fullPublicationDtoSchema }

export const sortOptionSchema = z.enum([
  "DATE_DESC",
  "CITATIONS_DESC",
  "REFERENCES_DESC",
])

export const publicationSearchPayloadSchema = z.object({
  searchQuery: z.string().optional(),
  yearFrom: z.number().optional(),
  yearTo: z.number().optional(),
  journals: z.array(z.string()).optional(),
  onlyWithCitations: z.boolean().optional(),
  onlyWithReferences: z.boolean().optional(),
  semanticMode: z.boolean().optional(),
  sortOption: sortOptionSchema.optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const publicationsPageSchema = createPageSchema(fullPublicationDtoSchema)

export const publicationReferenceItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  journal: z.string(),
  doi: z.string(),
})

