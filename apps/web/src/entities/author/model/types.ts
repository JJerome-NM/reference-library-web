import { z } from "zod"
import type { Page } from "@/src/shared/api/types"
import {
  authorDtoSchema,
  authorStatisticDtoSchema,
  authorDetailsResponseSchema,
  authorSortOptionSchema,
  authorSearchPayloadSchema,
  authorSearchParamsSchema,
  authorDetailsParamsSchema,
} from "./author.schema"

export type AuthorDto = z.infer<typeof authorDtoSchema>
export type AuthorStatisticDto = z.infer<typeof authorStatisticDtoSchema>
export type AuthorDetailsResponse = z.infer<typeof authorDetailsResponseSchema>
export type AuthorSortOption = z.infer<typeof authorSortOptionSchema>
export type AuthorSearchPayload = z.infer<typeof authorSearchPayloadSchema>
export type AuthorSearchParams = z.infer<typeof authorSearchParamsSchema>
export type AuthorDetailsParams = z.infer<typeof authorDetailsParamsSchema>

export type AuthorsPage = Page<AuthorDto>
