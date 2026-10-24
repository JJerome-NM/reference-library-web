export { journalService } from "./api/journal.service"
export { useJournalsSearch } from "./api/queries/use-journals-search"
export { useJournalDetails } from "./api/queries/use-journal-details"
export {
  MOCK_JOURNALS,
  MOCK_JOURNALS_PAGE,
  MOCK_JOURNAL_DETAILS,
  getMockJournalDetails,
  filterMockJournals,
} from "./api/journal.mock"
export type {
  JournalDto,
  JournalWithAuthorsDto,
  FullJournalDto,
  JournalVersionDto,
  JournalDetailsResponse,
  JournalSortOption,
  JournalSearchPayload,
  JournalSearchParams,
  JournalsPage,
} from "./api/journal.types"
