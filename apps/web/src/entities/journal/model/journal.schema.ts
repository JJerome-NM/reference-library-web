import { z } from "zod"
import {
  journalDtoSchema,
  journalWithAuthorsDtoSchema,
  authorDtoSchema,
  createPageSchema,
} from "@/src/shared/api/schemas"

export { journalDtoSchema, journalWithAuthorsDtoSchema }

export const journalVersionDtoSchema = z.object({
  doi: z.string(),
  imageUrl: z.string().nullable(),
  publishedDate: z.string().nullable(),
  versionNumber: z.number().nullable(),
  journalPrintIssn: z.string().nullable(),
  journalOnlineIssn: z.string().nullable(),
})

export const fullJournalDtoSchema = z.object({
  printIssn: z.string().nullable(),
  onlineIssn: z.string().nullable(),
  title: z.string().nullable(),
  authorsCount: z.number().nullable(),
  versionsCount: z.number().nullable(),
  impactFactor: z.number().nullable(),
  authors: z.array(authorDtoSchema),
  journalVersions: z.array(journalVersionDtoSchema),
})

export const journalDetailsResponseSchema = z.object({
  journal: fullJournalDtoSchema,
  academicIndex: z.number().nullable(),
})

export const journalSortOptionSchema = z.enum([
  "INDEX_DESC",
  "VERSIONS_DESC",
  "TITLE_ASC",
])

export const journalSearchPayloadSchema = z.object({
  searchQuery: z.string().optional(),
  indexFrom: z.number().optional(),
  indexTo: z.number().optional(),
  hasVersions: z.boolean().optional(),
  hasPrintIssn: z.boolean().optional(),
  hasOnlineIssn: z.boolean().optional(),
  sortOption: journalSortOptionSchema.optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const journalSearchParamsSchema = z.object({
  searchQuery: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
})

export const journalsPageSchema = createPageSchema(journalWithAuthorsDtoSchema)
