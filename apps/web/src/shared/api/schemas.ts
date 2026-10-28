import { z } from "zod"

export const authorDtoSchema = z.object({
  orcid: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  academicIndex: z.number().nullable(),
  numberInRating: z.number().nullable(),
  importedBy: z.string().nullable(),
})

export const authorStatisticDtoSchema = z.object({
  academicIndex: z.number().nullable(),
  coAuthors: z.array(authorDtoSchema),
  totalCitationsPerAllPublications: z.number().nullable(),
  totalPublications: z.number().nullable(),
})

export const transientAuthorDtoSchema = z.object({
  id: z.number().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  doi: z.string(),
})

export const journalDtoSchema = z.object({
  printIssn: z.string().nullable(),
  onlineIssn: z.string().nullable(),
  title: z.string().nullable(),
})

export const tagDtoSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
  trash: z.boolean(),
})

export const fullPublicationDtoSchema = z.object({
  doi: z.string(),
  printIssn: z.string().nullable(),
  onlineIssn: z.string().nullable(),
  showOnWebsite: z.boolean(),
  manuallyAdded: z.boolean(),
  name: z.string().nullable(),
  publicationDate: z.string().nullable(),
  importedDate: z.string().nullable(),
  journal: journalDtoSchema.nullable(),
  journalVersionNumber: z.number().nullable(),
  authors: z.array(authorDtoSchema),
  transientAuthors: z.array(transientAuthorDtoSchema),
  tags: z.array(tagDtoSchema),
  totalReferences: z.number(),
  totalCitations: z.number(),
})

export const citeAuthorDtoSchema = z.object({
  author: authorDtoSchema,
  totalUniqueCitations: z.number(),
  totalCitations: z.number(),
  citerPublicationsCount: z.number().nullable(),
  citedPublicationsCount: z.number().nullable(),
  citerPublications: z.array(fullPublicationDtoSchema),
  citedPublications: z.array(fullPublicationDtoSchema),
  citationsCountByAuthor: z.record(z.string(), z.number()).nullable(),
})

export const journalWithAuthorsDtoSchema = journalDtoSchema.extend({
  authors: z.array(authorDtoSchema),
  amountOfJournalVersions: z.number().nullable(),
  journalVersionDois: z.array(z.string()),
  academicIndex: z.number().nullable(),
})

export const institutionDtoSchema = z.object({
  institutionId: z.number(),
  nameUA: z.string().nullable(),
  nameEN: z.string().nullable(),
  url: z.string().nullable(),
  country: z.string().nullable(),
  showOnWebsite: z.boolean(),
  academicIndex: z.number().nullable(),
  authorOrcids: z.array(z.string()),
})

export const homeSummaryDtoSchema = z.object({
  numOfAuthors: z.number(),
  numOfJournalsWithVersions: z.number(),
  numOfPublications: z.number(),
  numOfInstitutions: z.number(),
})

export const authorDetailsResponseSchema = z.object({
  author: authorDtoSchema,
  statistics: authorStatisticDtoSchema,
  publications: z.array(fullPublicationDtoSchema),
  importedJournalsCount: z.number(),
})

export const createPageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
    first: z.boolean(),
    last: z.boolean(),
  })
