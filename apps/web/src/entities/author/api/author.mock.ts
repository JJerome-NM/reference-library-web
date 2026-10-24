import type { FullPublicationDto } from "@/src/shared/api/types"
import type {
  AuthorDetailsParams,
  AuthorDetailsResponse,
  AuthorDto,
  AuthorSearchPayload,
  AuthorsPage,
} from "./author.types"

export const MOCK_AUTHORS: AuthorDto[] = [
  {
    orcid: "https://orcid.org/0000-0001-9228-8459",
    firstName: "Oleksiy",
    lastName: "Melnyk",
    academicIndex: 18.96,
    numberInRating: 1,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-3766-3188",
    firstName: "Oleg",
    lastName: "Onishchenko",
    academicIndex: 18.96,
    numberInRating: 2,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0001-7065-6820",
    firstName: "Igor",
    lastName: "Hrytsuk",
    academicIndex: 16.94,
    numberInRating: 3,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0001-7468-5661",
    firstName: "Serhiy",
    lastName: "Gayda",
    academicIndex: 13.95,
    numberInRating: 4,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0001-9434-1081",
    firstName: "Sergii",
    lastName: "Khlamov",
    academicIndex: 10.93,
    numberInRating: 5,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-4635-6542",
    firstName: "Iryna",
    lastName: "Svyd",
    academicIndex: 10.82,
    numberInRating: 6,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-9875-1579",
    firstName: "Олег",
    lastName: "Коваль",
    academicIndex: 5.2,
    numberInRating: 7,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0001-1234-5678",
    firstName: "Анна",
    lastName: "Петрова",
    academicIndex: 3.1,
    numberInRating: 8,
    importedBy: null,
  },
]

export function filterMockAuthors(
  payload: AuthorSearchPayload = {}
): AuthorsPage {
  const {
    searchQuery = "",
    indexFrom,
    indexTo,
    onlyOrcid = false,
    onlyActivePubs = false,
    sortOption = "INDEX_DESC",
    page = 0,
    size = 15,
  } = payload

  let filtered = [...MOCK_AUTHORS]

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filtered = filtered.filter((author) => {
      const nameMatch = `${author.firstName ?? ""} ${author.lastName ?? ""}`
        .toLowerCase()
        .includes(q)
      const orcidMatch = author.orcid.toLowerCase().includes(q)
      return nameMatch || orcidMatch
    })
  }

  if (indexFrom !== undefined && !Number.isNaN(indexFrom)) {
    filtered = filtered.filter((author) => {
      if (author.academicIndex === null) return false
      return author.academicIndex >= indexFrom
    })
  }

  if (indexTo !== undefined && !Number.isNaN(indexTo)) {
    filtered = filtered.filter((author) => {
      if (author.academicIndex === null) return false
      return author.academicIndex <= indexTo
    })
  }

  if (onlyOrcid) {
    filtered = filtered.filter((author) => Boolean(author.orcid && author.orcid.includes("0000-")))
  }

  if (onlyActivePubs) {
    filtered = filtered.filter((author) => (author.numberInRating ?? 0) % 2 !== 0)
  }

  filtered.sort((a, b) => {
    if (sortOption === "RATING_ASC") {
      return (a.numberInRating ?? 999) - (b.numberInRating ?? 999)
    }
    if (sortOption === "NAME_ASC") {
      const nameA = a.lastName ?? ""
      const nameB = b.lastName ?? ""
      return nameA.localeCompare(nameB)
    }
    return (b.academicIndex ?? 0) - (a.academicIndex ?? 0)
  })

  const totalElements = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const start = page * size
  const paginatedContent = filtered.slice(start, start + size)

  return {
    content: paginatedContent,
    totalElements,
    totalPages,
    size,
    number: page,
    first: page === 0,
    last: page >= totalPages - 1,
  }
}

export const MOCK_AUTHORS_PAGE: AuthorsPage = filterMockAuthors()

export function getMockAuthorDetails(
  orcid?: string,
  params?: AuthorDetailsParams
): AuthorDetailsResponse {
  const raw = decodeURIComponent(orcid ?? "")
  const clean = raw.replace("https://orcid.org/", "").trim()

  const author =
    MOCK_AUTHORS.find((a) => {
      const aClean = a.orcid.replace("https://orcid.org/", "").trim()
      return aClean === clean || a.orcid === raw
    }) ?? MOCK_AUTHORS[0]!

  const authorCleanOrcid = author.orcid.replace("https://orcid.org/", "").trim()

  const coAuthors = MOCK_AUTHORS.filter(
    (a) => a.orcid !== author.orcid
  ).slice(0, 4)

  const rawPubs: FullPublicationDto[] = [
    {
      doi: `10.1016/j.nvngu.2025.100${author.numberInRating ?? 1}1`,
      name: `Geomechanical and spatial evaluation of technogenic stress fields in rock mass`,
      showOnWebsite: true,
      manuallyAdded: false,
      publicationDate: "2025-03-14",
      importedDate: "2025-03-15T10:00:00",
      journal: {
        printIssn: "2071-2227",
        onlineIssn: null,
        title: "Науковий Вісник НГУ",
      },
      journalVersionNumber: 2,
      authors: [author, coAuthors[0]!].filter(Boolean),
      transientAuthors: [],
      tags: [{ id: 1, name: "Geomechanics", trash: false }],
      totalReferences: 19,
      totalCitations: 14,
      printIssn: "2071-2227",
      onlineIssn: null,
    },
    {
      doi: `10.1016/j.cageo.2024.104${author.numberInRating ?? 2}2`,
      name: `Automated predictive modeling of structural integrity and scientific metric assessment`,
      showOnWebsite: true,
      manuallyAdded: false,
      publicationDate: "2024-09-20",
      importedDate: "2024-09-22T14:30:00",
      journal: {
        printIssn: "0098-3004",
        onlineIssn: null,
        title: "Computers & Geosciences",
      },
      journalVersionNumber: 4,
      authors: [author, coAuthors[1]!].filter(Boolean),
      transientAuthors: [],
      tags: [{ id: 2, name: "Data Analysis", trash: false }],
      totalReferences: 28,
      totalCitations: 22,
      printIssn: "0098-3004",
      onlineIssn: null,
    },
    {
      doi: `10.1016/j.ijft.2023.101${author.numberInRating ?? 3}5`,
      name: `Experimental investigation into thermochemical behavior and material degradation under extreme loading`,
      showOnWebsite: true,
      manuallyAdded: false,
      publicationDate: "2023-11-10",
      importedDate: "2023-11-12T09:15:00",
      journal: {
        printIssn: "2666-2027",
        onlineIssn: null,
        title: "International Journal of Thermofluids",
      },
      journalVersionNumber: 1,
      authors: [author],
      transientAuthors: [],
      tags: [{ id: 3, name: "Materials", trash: false }],
      totalReferences: 15,
      totalCitations: 9,
      printIssn: "2666-2027",
      onlineIssn: null,
    },
    {
      doi: `10.1016/j.funbio.2022.100${author.numberInRating ?? 4}8`,
      name: `Isotopic benchmarking and comparative scientometric assessment of academic entities`,
      showOnWebsite: true,
      manuallyAdded: false,
      publicationDate: "2022-06-18",
      importedDate: "2022-06-20T11:45:00",
      journal: {
        printIssn: "1878-6146",
        onlineIssn: null,
        title: "Fungal Biology",
      },
      journalVersionNumber: 3,
      authors: [author, coAuthors[2]!].filter(Boolean),
      transientAuthors: [],
      tags: [],
      totalReferences: 21,
      totalCitations: 17,
      printIssn: "1878-6146",
      onlineIssn: null,
    },
  ]

  let filteredPubs = [...rawPubs]
  if (params?.searchQuery?.trim()) {
    const q = params.searchQuery.trim().toLowerCase()
    filteredPubs = filteredPubs.filter(
      (p) =>
        (p.name ?? "").toLowerCase().includes(q) || p.doi.toLowerCase().includes(q)
    )
  }

  if (params?.sortOption?.includes("CITATIONS_DESC")) {
    filteredPubs.sort((a, b) => (b.totalCitations ?? 0) - (a.totalCitations ?? 0))
  } else if (params?.sortOption?.includes("PUBLICATION_DATE_ASCENDING")) {
    filteredPubs.sort(
      (a, b) =>
        new Date(a.publicationDate ?? 0).getTime() -
        new Date(b.publicationDate ?? 0).getTime()
    )
  } else {
    filteredPubs.sort(
      (a, b) =>
        new Date(b.publicationDate ?? 0).getTime() -
        new Date(a.publicationDate ?? 0).getTime()
    )
  }

  const totalCitations = rawPubs.reduce(
    (acc, cur) => acc + (cur.totalCitations ?? 0),
    0
  ) + Math.round((author.academicIndex ?? 10) * 8)

  const totalPublications = rawPubs.length + Math.round((author.academicIndex ?? 10) * 1.5)

  return {
    author: {
      ...author,
      orcid: `https://orcid.org/${authorCleanOrcid}`,
    },
    statistics: {
      academicIndex: author.academicIndex,
      coAuthors,
      totalCitationsPerAllPublications: totalCitations,
      totalPublications,
    },
    publications: filteredPubs,
    importedJournalsCount: 4,
  }
}

export const MOCK_AUTHOR_DETAILS: AuthorDetailsResponse = getMockAuthorDetails()
