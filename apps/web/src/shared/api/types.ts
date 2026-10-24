export interface AuthorDto {
  orcid: string
  firstName: string | null
  lastName: string | null
  academicIndex: number | null
  numberInRating: number | null
  importedBy: string | null
}

export interface AuthorStatisticDto {
  academicIndex: number | null
  coAuthors: AuthorDto[]
  totalCitationsPerAllPublications: number | null
  totalPublications: number | null
}

export interface CiteAuthorDto {
  author: AuthorDto
  totalUniqueCitations: number
  totalCitations: number
  citerPublicationsCount: number | null
  citedPublicationsCount: number | null
  citerPublications: FullPublicationDto[]
  citedPublications: FullPublicationDto[]
  citationsCountByAuthor: Record<string, number> | null
}

export interface TransientAuthorDto {
  id: number | null
  firstName: string | null
  lastName: string | null
  doi: string
}

export interface JournalDto {
  printIssn: string | null
  onlineIssn: string | null
  title: string | null
}

export interface JournalWithAuthorsDto extends JournalDto {
  authors: AuthorDto[]
  amountOfJournalVersions: number | null
  journalVersionDois: string[]
  academicIndex: number | null
}

export interface TagDto {
  id: number | null
  name: string
  trash: boolean
}

export interface FullPublicationDto {
  doi: string
  printIssn: string | null
  onlineIssn: string | null
  showOnWebsite: boolean
  manuallyAdded: boolean
  name: string | null
  publicationDate: string | null
  importedDate: string | null
  journal: JournalDto | null
  journalVersionNumber: number | null
  authors: AuthorDto[]
  transientAuthors: TransientAuthorDto[]
  tags: TagDto[]
  totalReferences: number
  totalCitations: number
}

export interface InstitutionDto {
  institutionId: number
  nameUA: string | null
  nameEN: string | null
  url: string | null
  country: string | null
  showOnWebsite: boolean
  academicIndex: number | null
  authorOrcids: string[]
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface HomeSummaryDto {
  numOfAuthors: number
  numOfJournalsWithVersions: number
  numOfPublications: number
  numOfInstitutions: number
}

export interface AuthorDetailsResponse {
  author: AuthorDto
  statistics: AuthorStatisticDto
  publications: FullPublicationDto[]
  importedJournalsCount: number
}
