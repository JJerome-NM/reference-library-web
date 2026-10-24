"use client"

import { useQuery } from "@tanstack/react-query"
import { publicationService } from "../publication.service"

export const usePublicationsLatest = (size = 5) => {
  const query = useQuery(publicationService.getLatestQueryOptions(size))
  return { publications: query.data, ...query }
}
