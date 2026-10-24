import type {
  AuthorDto,
  InstitutionDto,
  Page,
} from "@/src/shared/api/types"

export type { InstitutionDto }

export interface InstitutionDetailsResponse {
  institution: InstitutionDto
  authors: Page<AuthorDto>
  authorCount: number
}

export type InstitutionSortOption = "INDEX_DESC" | "NAME_ASC" | "AUTHORS_DESC"

export interface InstitutionSearchPayload {
  searchQuery?: string
  indexFrom?: number
  indexTo?: number
  country?: string
  sortOption?: InstitutionSortOption
  page?: number
  size?: number
}

export interface InstitutionSearchParams {
  searchQuery?: string
  page?: number
  size?: number
}

export type InstitutionsPage = Page<InstitutionDto>
