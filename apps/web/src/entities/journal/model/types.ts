import { z } from "zod"
import type { Page } from "@/src/shared/api/types"
import {
  journalDtoSchema,
  journalWithAuthorsDtoSchema,
  journalVersionDtoSchema,
  fullJournalDtoSchema,
  journalDetailsResponseSchema,
  journalSortOptionSchema,
  journalSearchPayloadSchema,
  journalSearchParamsSchema,
} from "./journal.schema"

export type JournalDto = z.infer<typeof journalDtoSchema>
export type JournalWithAuthorsDto = z.infer<typeof journalWithAuthorsDtoSchema>
export type JournalVersionDto = z.infer<typeof journalVersionDtoSchema>
export type FullJournalDto = z.infer<typeof fullJournalDtoSchema>
export type JournalDetailsResponse = z.infer<typeof journalDetailsResponseSchema>
export type JournalSortOption = z.infer<typeof journalSortOptionSchema>
export type JournalSearchPayload = z.infer<typeof journalSearchPayloadSchema>
export type JournalSearchParams = z.infer<typeof journalSearchParamsSchema>

export type JournalsPage = Page<JournalWithAuthorsDto>
