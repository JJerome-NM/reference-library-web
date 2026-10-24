import type { FullPublicationDto, Page } from "@/src/shared/api/types"

export type { FullPublicationDto }

export type SortOption = "DATE_DESC" | "CITATIONS_DESC" | "REFERENCES_DESC"

export interface PublicationSearchPayload {
  searchQuery?: string
  yearFrom?: number
  yearTo?: number
  journals?: string[]
  onlyWithCitations?: boolean
  onlyWithReferences?: boolean
  semanticMode?: boolean
  sortOption?: SortOption
  page?: number
  size?: number
}

export type PublicationsPage = Page<FullPublicationDto>
