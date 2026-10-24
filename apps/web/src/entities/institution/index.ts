export { institutionService } from "./api/institution.service"
export { useInstitutionsSearch } from "./api/queries/use-institutions-search"
export { useInstitutionDetails } from "./api/queries/use-institution-details"
export {
  MOCK_INSTITUTIONS,
  MOCK_INSTITUTIONS_PAGE,
  MOCK_INSTITUTION_DETAILS,
  MOCK_INSTITUTION_AUTHORS,
  filterMockInstitutions,
  getMockInstitutionDetails,
} from "./api/institution.mock"
export type {
  InstitutionDto,
  InstitutionDetailsResponse,
  InstitutionSortOption,
  InstitutionSearchPayload,
  InstitutionSearchParams,
  InstitutionsPage,
} from "./api/institution.types"
