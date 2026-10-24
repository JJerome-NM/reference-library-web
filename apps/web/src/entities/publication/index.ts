export { publicationService } from "./api/publication.service"
export { usePublicationsLatest } from "./api/queries/use-publications-latest"
export { usePublicationsSearch } from "./api/queries/use-publications-search"
export { MOCK_PUBLICATIONS, MOCK_PUBLICATIONS_PAGE, filterMockPublications } from "./api/publication.mock"
export type {
  FullPublicationDto,
  PublicationSearchPayload,
  PublicationsPage,
  SortOption,
} from "./api/publication.types"
