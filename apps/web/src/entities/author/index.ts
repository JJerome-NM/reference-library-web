export { authorService } from "./api/author.service"
export { useAuthorDetails } from "./api/queries/use-author-details"
export { useAuthorsSearch } from "./api/queries/use-authors-search"
export {
  MOCK_AUTHOR_DETAILS,
  MOCK_AUTHORS_PAGE,
  MOCK_AUTHORS,
  filterMockAuthors,
  getMockAuthorDetails,
} from "./api/author.mock"
export type {
  AuthorDto,
  AuthorStatisticDto,
  AuthorDetailsResponse,
  AuthorSearchParams,
  AuthorSearchPayload,
  AuthorSortOption,
  AuthorDetailsParams,
  AuthorsPage,
} from "./api/author.types"
