import type {
  AuthorDto,
  JournalDto,
  JournalWithAuthorsDto,
  Page,
} from "@/src/shared/api/types"

export type { JournalDto, JournalWithAuthorsDto }

export interface JournalVersionDto {
  doi: string
  imageUrl: string | null
  publishedDate: string | null
  versionNumber: number | null
  journalPrintIssn: string | null
  journalOnlineIssn: string | null
}

export interface FullJournalDto {
  printIssn: string | null
  onlineIssn: string | null
  title: string | null
  authorsCount: number | null
  versionsCount: number | null
  impactFactor: number | null
  authors: AuthorDto[]
  journalVersions: JournalVersionDto[]
}

export interface JournalDetailsResponse {
  journal: FullJournalDto
  academicIndex: number | null
}

export type JournalSortOption = "INDEX_DESC" | "VERSIONS_DESC" | "TITLE_ASC"

export interface JournalSearchPayload {
  searchQuery?: string
  indexFrom?: number
  indexTo?: number
  hasVersions?: boolean
  hasPrintIssn?: boolean
  hasOnlineIssn?: boolean
  sortOption?: JournalSortOption
  page?: number
  size?: number
}

export interface JournalSearchParams {
  searchQuery?: string
  page?: number
  size?: number
}

export type JournalsPage = Page<JournalWithAuthorsDto>
