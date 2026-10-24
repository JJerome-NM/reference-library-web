import type {
  AuthorDto,
  AuthorStatisticDto,
  AuthorDetailsResponse,
  Page,
} from "@/src/shared/api/types"

export type { AuthorDto, AuthorStatisticDto, AuthorDetailsResponse }

export type AuthorSortOption = "INDEX_DESC" | "RATING_ASC" | "NAME_ASC"

export interface AuthorSearchPayload {
  searchQuery?: string
  indexFrom?: number
  indexTo?: number
  onlyOrcid?: boolean
  onlyActivePubs?: boolean
  sortOption?: AuthorSortOption
  page?: number
  size?: number
}

export interface AuthorSearchParams {
  searchQuery?: string
  page?: number
  size?: number
}

export interface AuthorDetailsParams {
  searchQuery?: string
  sortOption?: string[]
  startDate?: string
  endDate?: string
}

export type AuthorsPage = Page<AuthorDto>
