"use client"

import { useQuery } from "@tanstack/react-query"
import { publicationService } from "../publication.service"

export function usePublicationReferences(doi: string, enabled = false) {
  return useQuery({
    ...publicationService.getReferencesQueryOptions(doi),
    enabled: Boolean(doi) && enabled,
  })
}
