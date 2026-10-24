"use client"

import { useQuery } from "@tanstack/react-query"
import { institutionService } from "../institution.service"
import type { InstitutionSearchPayload } from "../institution.types"

export const useInstitutionsSearch = (payload: InstitutionSearchPayload = {}) => {
  const query = useQuery(institutionService.searchQueryOptions(payload))
  return {
    institutionsPage: query.data,
    institutions: query.data?.content ?? [],
    totalElements: query.data?.totalElements ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    ...query,
  }
}
