import type {
  FullPublicationDto,
  PublicationSearchPayload,
  PublicationsPage,
} from "./publication.types"

export const MOCK_PUBLICATIONS: FullPublicationDto[] = [
  {
    doi: "10.1016/j.funbio.2026.101812",
    name: "Variations in elemental and isotopic compositions of Cu, Zn, and Cd in mushrooms: are they site- or species-dependent?",
    showOnWebsite: true,
    manuallyAdded: false,
    publicationDate: "2026-10-01",
    importedDate: "2026-10-01T10:00:00",
    journal: {
      printIssn: "1878-6146",
      onlineIssn: null,
      title: "Fungal Biology",
    },
    journalVersionNumber: 1,
    authors: [
      {
        orcid: "https://orcid.org/0000-0001-5212-3713",
        firstName: "Anna",
        lastName: "Vynnychuk",
        academicIndex: 4.8,
        numberInRating: 12,
        importedBy: null,
      },
      {
        orcid: "",
        firstName: "Alexandre",
        lastName: "Andronikov",
        academicIndex: null,
        numberInRating: null,
        importedBy: null,
      },
    ],
    transientAuthors: [],
    tags: [],
    totalReferences: 14,
    totalCitations: 0,
    printIssn: "1878-6146",
    onlineIssn: null,
  },
  {
    doi: "10.1016/j.ijft.2026.101683",
    name: "Research into thermochemical pressing as an alternative method for producing high-entropy alloys",
    showOnWebsite: true,
    manuallyAdded: false,
    publicationDate: "2026-09-15",
    importedDate: "2026-09-15T12:00:00",
    journal: {
      printIssn: "2666-2027",
      onlineIssn: null,
      title: "Int. Journal of Thermofluids",
    },
    journalVersionNumber: 4,
    authors: [
      {
        orcid: "https://orcid.org/0000-0003-0524-4998",
        firstName: "Oleksii",
        lastName: "Hrechanyi",
        academicIndex: 5.6,
        numberInRating: 8,
        importedBy: null,
      },
      {
        orcid: "",
        firstName: "T.",
        lastName: "Vasilchenko",
        academicIndex: null,
        numberInRating: null,
        importedBy: null,
      },
    ],
    transientAuthors: [],
    tags: [],
    totalReferences: 3,
    totalCitations: 2,
    printIssn: "2666-2027",
    onlineIssn: null,
  },
  {
    doi: "10.1016/j.nvngu.2025.100412",
    name: "Geomechanical modeling of underground strata displacement during deep mining",
    showOnWebsite: true,
    manuallyAdded: false,
    publicationDate: "2025-04-10",
    importedDate: "2025-04-12T08:00:00",
    journal: {
      printIssn: "2071-2227",
      onlineIssn: null,
      title: "Науковий Вісник НГУ",
    },
    journalVersionNumber: 2,
    authors: [
      {
        orcid: "https://orcid.org/0000-0001-9228-8459",
        firstName: "Oleksiy",
        lastName: "Melnyk",
        academicIndex: 18.96,
        numberInRating: 1,
        importedBy: null,
      },
    ],
    transientAuthors: [],
    tags: [],
    totalReferences: 19,
    totalCitations: 8,
    printIssn: "2071-2227",
    onlineIssn: null,
  },
  {
    doi: "10.1016/j.cageo.2020.104539",
    name: "Semantic differential in GIS: automated spatial attribute evaluation",
    showOnWebsite: true,
    manuallyAdded: false,
    publicationDate: "2020-07-01",
    importedDate: "2023-01-10T14:30:00",
    journal: {
      printIssn: "0098-3004",
      onlineIssn: null,
      title: "Computers & Geosciences",
    },
    journalVersionNumber: 2,
    authors: [
      {
        orcid: "https://orcid.org/0000-0002-9875-1579",
        firstName: "Олег",
        lastName: "Коваль",
        academicIndex: 5.2,
        numberInRating: 5,
        importedBy: null,
      },
    ],
    transientAuthors: [],
    tags: [],
    totalReferences: 25,
    totalCitations: 12,
    printIssn: "0098-3004",
    onlineIssn: null,
  },
  {
    doi: "10.1016/j.nvngu.2024.100889",
    name: "Dynamic vibration stability of extraction complexes in coal seams",
    showOnWebsite: true,
    manuallyAdded: false,
    publicationDate: "2024-11-20",
    importedDate: "2024-11-22T16:00:00",
    journal: {
      printIssn: "2071-2227",
      onlineIssn: null,
      title: "Науковий Вісник НГУ",
    },
    journalVersionNumber: 5,
    authors: [
      {
        orcid: "https://orcid.org/0000-0001-7065-6820",
        firstName: "Igor",
        lastName: "Hrytsuk",
        academicIndex: 16.94,
        numberInRating: 3,
        importedBy: null,
      },
    ],
    transientAuthors: [],
    tags: [],
    totalReferences: 11,
    totalCitations: 5,
    printIssn: "2071-2227",
    onlineIssn: null,
  },
]

export function filterMockPublications(
  payload: PublicationSearchPayload = {}
): PublicationsPage {
  const {
    searchQuery = "",
    yearFrom,
    yearTo,
    journals = [],
    onlyWithCitations = false,
    onlyWithReferences = false,
    sortOption = "DATE_DESC",
    page = 0,
    size = 10,
  } = payload

  let filtered = [...MOCK_PUBLICATIONS]

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filtered = filtered.filter((pub) => {
      const titleMatch = pub.name?.toLowerCase().includes(q)
      const doiMatch = pub.doi.toLowerCase().includes(q)
      const authorMatch = pub.authors.some((a) =>
        `${a.firstName ?? ""} ${a.lastName ?? ""}`.toLowerCase().includes(q)
      )
      const journalMatch = pub.journal?.title?.toLowerCase().includes(q)
      return titleMatch || doiMatch || authorMatch || journalMatch
    })
  }

  if (yearFrom !== undefined && !Number.isNaN(yearFrom)) {
    filtered = filtered.filter((pub) => {
      if (!pub.publicationDate) return false
      const year = parseInt(pub.publicationDate.slice(0, 4), 10)
      return year >= yearFrom
    })
  }

  if (yearTo !== undefined && !Number.isNaN(yearTo)) {
    filtered = filtered.filter((pub) => {
      if (!pub.publicationDate) return false
      const year = parseInt(pub.publicationDate.slice(0, 4), 10)
      return year <= yearTo
    })
  }

  if (journals.length > 0) {
    filtered = filtered.filter((pub) => {
      const journalTitle = pub.journal?.title ?? ""
      return journals.includes(journalTitle)
    })
  }

  if (onlyWithCitations) {
    filtered = filtered.filter((pub) => pub.totalCitations > 0)
  }

  if (onlyWithReferences) {
    filtered = filtered.filter((pub) => pub.totalReferences > 0)
  }

  filtered.sort((a, b) => {
    if (sortOption === "CITATIONS_DESC") {
      return b.totalCitations - a.totalCitations
    }
    if (sortOption === "REFERENCES_DESC") {
      return b.totalReferences - a.totalReferences
    }
    const dateA = a.publicationDate ?? ""
    const dateB = b.publicationDate ?? ""
    return dateB.localeCompare(dateA)
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

export const MOCK_PUBLICATIONS_PAGE: PublicationsPage = filterMockPublications()

export function getMockPublicationReferences() {
  return [
    {
      id: 1,
      title: "Phase stability and microstructural transitions in high-entropy multicomponent systems",
      journal: "Acta Materialia",
      doi: "10.1016/j.actamat.2024.119874",
    },
    {
      id: 2,
      title: "Microstructural features and consolidation mechanics of warm-pressed refractory alloys",
      journal: "Materials Science and Engineering: A",
      doi: "10.1016/j.msea.2025.145120",
    },
    {
      id: 3,
      title: "Kinetic models and numerical simulation of solid-state interdiffusion under quasi-static stress",
      journal: "Metallurgical and Materials Transactions A",
      doi: "10.1016/j.msea.2025.145120",
    },
  ]
}
