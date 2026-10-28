export { publicationService, publicationKeys } from "./api/publication.service"
export { usePublicationsLatest } from "./api/queries/use-publications-latest"
export { usePublicationsSearch } from "./api/queries/use-publications-search"
export { usePublicationReferences } from "./api/queries/use-publication-references"
export {
  MOCK_PUBLICATIONS,
  MOCK_PUBLICATIONS_PAGE,
  filterMockPublications,
  getMockPublicationReferences,
} from "./api/publication.mock"
export * from "./model"
