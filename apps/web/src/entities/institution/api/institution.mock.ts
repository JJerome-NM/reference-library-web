import type { AuthorDto } from "@/src/entities/author"
import type {
  InstitutionDetailsResponse,
  InstitutionDto,
  InstitutionSearchPayload,
  InstitutionsPage,
} from "./institution.types"

export const MOCK_INSTITUTIONS: InstitutionDto[] = [
  {
    institutionId: 1,
    nameUA: "Академія технічних наук України",
    nameEN: "Academy of Technical Sciences of Ukraine",
    url: "https://ukrtsa.org.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 21.96,
    authorOrcids: [
      "https://orcid.org/0000-0001-5691-8986",
      "https://orcid.org/0000-0002-9522-4925",
      "https://orcid.org/0000-0003-2099-9045",
      "https://orcid.org/0000-0002-3618-5399",
      "https://orcid.org/0000-0001-9228-8459",
    ],
  },
  {
    institutionId: 34,
    nameUA: "Одеський національний морський університет",
    nameEN: "Odessa National Maritime University",
    url: "https://onmu.od.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 21.96,
    authorOrcids: ["https://orcid.org/0000-0002-3766-3188"],
  },
  {
    institutionId: 35,
    nameUA: "Національний університет \"Одеська морська академія\"",
    nameEN: "National University \"Odessa Maritime Academy\"",
    url: "https://onma.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 19.96,
    authorOrcids: ["https://orcid.org/0000-0001-7065-6820"],
  },
  {
    institutionId: 63,
    nameUA: "Харківський національний університет радіоелектроніки",
    nameEN: "Kharkiv National University of Radio Electronics",
    url: "https://nure.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 18.96,
    authorOrcids: ["https://orcid.org/0000-0001-9434-1081"],
  },
  {
    institutionId: 4,
    nameUA: "Національний лісотехнічний університет України",
    nameEN: "National Forestry University of Ukraine",
    url: "https://nltu.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 16.96,
    authorOrcids: ["https://orcid.org/0000-0001-7468-5661"],
  },
  {
    institutionId: 30,
    nameUA: "Херсонська державна морська академія",
    nameEN: "Kherson State Maritime Academy",
    url: "https://ksma.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 16.95,
    authorOrcids: [],
  },
  {
    institutionId: 2,
    nameUA: "Прикарпатський національний університет імені Василя Стефаника",
    nameEN: "Vasyl Stefanyk Carpathian National University",
    url: "https://pnu.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 15.95,
    authorOrcids: ["https://orcid.org/0000-0002-9875-1579"],
  },
  {
    institutionId: 23,
    nameUA: "Івано-Франківський національний технічний університет нафти і газу",
    nameEN: "Ivano-Frankivsk National Technical University of Oil and Gas",
    url: "https://nung.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 15.95,
    authorOrcids: [],
  },
  {
    institutionId: 12,
    nameUA: "Національний технічний університет України \"Київський політехнічний інститут імені Ігоря Сікорського\"",
    nameEN: "National Technical University of Ukraine \"Igor Sikorsky Kyiv Polytechnic Institute\"",
    url: "https://kpi.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 14.8,
    authorOrcids: [],
  },
  {
    institutionId: 8,
    nameUA: "Львівський національний університет імені Івана Франка",
    nameEN: "Ivan Franko National University of Lviv",
    url: "https://lnu.edu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 13.9,
    authorOrcids: [],
  },
  {
    institutionId: 15,
    nameUA: "Київський національний університет імені Тараса Шевченка",
    nameEN: "Taras Shevchenko National University of Kyiv",
    url: "https://knu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 13.5,
    authorOrcids: [],
  },
  {
    institutionId: 7,
    nameUA: "Національний університет \"Львівська політехніка\"",
    nameEN: "Lviv Polytechnic National University",
    url: "https://lpnu.ua",
    country: "UKRAINE",
    showOnWebsite: true,
    academicIndex: 12.8,
    authorOrcids: [],
  },
]

export const MOCK_INSTITUTION_AUTHORS: AuthorDto[] = [
  {
    orcid: "https://orcid.org/0000-0001-5691-8986",
    firstName: "Maksym",
    lastName: "Ahieiev",
    academicIndex: 5.94,
    numberInRating: 1,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-9522-4925",
    firstName: "Halyna",
    lastName: "Andronovych",
    academicIndex: 5.89,
    numberInRating: 2,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0003-2099-9045",
    firstName: "Andriy",
    lastName: "Andrusyak",
    academicIndex: 4.82,
    numberInRating: 3,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-3618-5399",
    firstName: "Andriy",
    lastName: "Annenkov",
    academicIndex: 4.15,
    numberInRating: 4,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0001-9228-8459",
    firstName: "Oleksiy",
    lastName: "Melnyk",
    academicIndex: 18.96,
    numberInRating: 5,
    importedBy: null,
  },
  {
    orcid: "https://orcid.org/0000-0002-3766-3188",
    firstName: "Oleg",
    lastName: "Onishchenko",
    academicIndex: 18.96,
    numberInRating: 6,
    importedBy: null,
  },
]

export function filterMockInstitutions(
  payload: InstitutionSearchPayload = {}
): InstitutionsPage {
  const {
    searchQuery = "",
    indexFrom,
    indexTo,
    country,
    sortOption = "INDEX_DESC",
    page = 0,
    size = 10,
  } = payload

  let filtered = [...MOCK_INSTITUTIONS]

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filtered = filtered.filter((inst) => {
      const matchUA = (inst.nameUA ?? "").toLowerCase().includes(q)
      const matchEN = (inst.nameEN ?? "").toLowerCase().includes(q)
      const matchUrl = (inst.url ?? "").toLowerCase().includes(q)
      return matchUA || matchEN || matchUrl
    })
  }

  if (indexFrom !== undefined && !Number.isNaN(indexFrom)) {
    filtered = filtered.filter((inst) => {
      if (inst.academicIndex === null) return false
      return inst.academicIndex >= indexFrom
    })
  }

  if (indexTo !== undefined && !Number.isNaN(indexTo)) {
    filtered = filtered.filter((inst) => {
      if (inst.academicIndex === null) return false
      return inst.academicIndex <= indexTo
    })
  }

  if (country && country !== "ALL") {
    filtered = filtered.filter(
      (inst) => (inst.country ?? "").toUpperCase() === country.toUpperCase()
    )
  }

  filtered.sort((a, b) => {
    if (sortOption === "NAME_ASC") {
      const nameA = a.nameUA ?? a.nameEN ?? ""
      const nameB = b.nameUA ?? b.nameEN ?? ""
      return nameA.localeCompare(nameB, "uk")
    }
    if (sortOption === "AUTHORS_DESC") {
      return (b.authorOrcids?.length ?? 0) - (a.authorOrcids?.length ?? 0)
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

export function getMockInstitutionDetails(
  id: number | string,
  page = 0,
  sortOption = "INDEX_DESC"
): InstitutionDetailsResponse {
  const numericId = typeof id === "number" ? id : parseInt(id, 10)
  const institution =
    MOCK_INSTITUTIONS.find((inst) => inst.institutionId === numericId) ??
    MOCK_INSTITUTIONS[0]!

  const authors = [...MOCK_INSTITUTION_AUTHORS]
  if (sortOption === "NAME") {
    authors.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""))
  } else {
    authors.sort((a, b) => (b.academicIndex ?? 0) - (a.academicIndex ?? 0))
  }

  const pageSize = 15
  const totalElements = 580
  const totalPages = Math.ceil(totalElements / pageSize)

  return {
    institution,
    authors: {
      content: authors,
      totalElements,
      totalPages,
      size: pageSize,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
    },
    authorCount: totalElements,
  }
}

export const MOCK_INSTITUTIONS_PAGE: InstitutionsPage = filterMockInstitutions()

export const MOCK_INSTITUTION_DETAILS: InstitutionDetailsResponse = getMockInstitutionDetails(1)
