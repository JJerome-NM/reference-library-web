"use client"

import { useQuery } from "@tanstack/react-query"
import { authorService } from "../author.service"
import type { AuthorDetailsParams } from "../author.types"

export const useAuthorDetails = (orcid?: string, params?: AuthorDetailsParams) => {
  const query = useQuery(authorService.getDetailsQueryOptions(orcid, params))
  return { authorDetails: query.data, ...query }
}
