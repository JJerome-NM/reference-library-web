import { z } from "zod"
import type { Page } from "@/src/shared/api/types"
import {
  fullPublicationDtoSchema,
  sortOptionSchema,
  publicationSearchPayloadSchema,
  publicationReferenceItemSchema,
} from "./publication.schema"

export type FullPublicationDto = z.infer<typeof fullPublicationDtoSchema>
export type SortOption = z.infer<typeof sortOptionSchema>
export type PublicationSearchPayload = z.infer<typeof publicationSearchPayloadSchema>
export type PublicationReferenceItem = z.infer<typeof publicationReferenceItemSchema>

export type PublicationsPage = Page<FullPublicationDto>
