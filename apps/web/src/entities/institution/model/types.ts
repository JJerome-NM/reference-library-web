import { z } from "zod"
import type { Page } from "@/src/shared/api/types"
import {
  institutionDtoSchema,
  institutionDetailsResponseSchema,
  institutionSortOptionSchema,
  institutionSearchPayloadSchema,
  institutionSearchParamsSchema,
} from "./institution.schema"

export type InstitutionDto = z.infer<typeof institutionDtoSchema>
export type InstitutionDetailsResponse = z.infer<typeof institutionDetailsResponseSchema>
export type InstitutionSortOption = z.infer<typeof institutionSortOptionSchema>
export type InstitutionSearchPayload = z.infer<typeof institutionSearchPayloadSchema>
export type InstitutionSearchParams = z.infer<typeof institutionSearchParamsSchema>

export type InstitutionsPage = Page<InstitutionDto>
