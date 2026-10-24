"use client"

import { useQuery } from "@tanstack/react-query"
import { institutionService } from "../institution.service"

export const useInstitutionDetails = (
  id: number | string,
  page = 0,
  sortOption?: string
) => {
  return useQuery(institutionService.getDetailsQueryOptions(id, page, sortOption))
}
