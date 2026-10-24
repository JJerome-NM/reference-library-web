import type {
  JournalDetailsResponse,
  JournalSearchPayload,
  JournalVersionDto,
  JournalWithAuthorsDto,
  JournalsPage,
} from "./journal.types"

export const MOCK_JOURNALS: JournalWithAuthorsDto[] = [
  {
    title: "Ventilation Illumination and Heat Gas Supply",
    printIssn: "2409-2606",
    onlineIssn: "2664-5769",
    amountOfJournalVersions: 29,
    journalVersionDois: [
      "10.32347/2409-2606.2026.57",
      "10.32347/2409-2606.2026.56",
      "10.32347/2409-2606.2025.55",
    ],
    academicIndex: 2.6,
    authors: [
      {
        orcid: "https://orcid.org/0000-0001-8543-1800",
        firstName: "Viktor",
        lastName: "Mileikovskyi",
        academicIndex: 5.4,
        numberInRating: 11,
        importedBy: null,
      },
      {
        orcid: "https://orcid.org/0000-0003-2105-5951",
        firstName: "Tetiana",
        lastName: "Tkachenko",
        academicIndex: 4.8,
        numberInRating: 14,
        importedBy: null,
      },
      {
        orcid: "https://orcid.org/0000-0002-2960-9659",
        firstName: "Daria",
        lastName: "Vakulenko",
        academicIndex: 3.2,
        numberInRating: 28,
        importedBy: null,
      },
      {
        orcid: "https://orcid.org/0000-0002-7910-8705",
        firstName: "Yurii",
        lastName: "Franchuk",
        academicIndex: 4.1,
        numberInRating: 19,
        importedBy: null,
      },
      {
        orcid: "https://orcid.org/0000-0001-5115-7188",
        firstName: "Viktoriia",
        lastName: "Konovaliuk",
        academicIndex: 3.9,
        numberInRating: 22,
        importedBy: null,
      },
    ],
  },
  {
    title: "Фізика низьких температур",
    printIssn: "0132-6414",
    onlineIssn: "1816-0328",
    amountOfJournalVersions: 16,
    journalVersionDois: ["10.1063/fnt.2023.01", "10.1063/fnt.2023.02"],
    academicIndex: 7.1,
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
  },
  {
    title: "Journal of Automation and Information Sciences",
    printIssn: "1064-2315",
    onlineIssn: "2163-9337",
    amountOfJournalVersions: 15,
    journalVersionDois: ["10.1615/jautomatinfscien.2023.1"],
    academicIndex: 6.2,
    authors: [
      {
        orcid: "https://orcid.org/0000-0002-3766-3188",
        firstName: "Oleg",
        lastName: "Onishchenko",
        academicIndex: 18.96,
        numberInRating: 2,
        importedBy: null,
      },
    ],
  },
  {
    title: "Кібернетика та системний аналіз",
    printIssn: "0023-1274",
    onlineIssn: "1573-8337",
    amountOfJournalVersions: 14,
    journalVersionDois: ["10.1007/s10559-023-00561-1"],
    academicIndex: 5.7,
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
  },
  {
    title: "Український географічний журнал",
    printIssn: "1561-4980",
    onlineIssn: "2415-3206",
    amountOfJournalVersions: 12,
    journalVersionDois: ["10.15407/ugz2023.01.003"],
    academicIndex: 4.8,
    authors: [],
  },
  {
    title: "Науковий вісник Національного гірничого університету",
    printIssn: "2071-2227",
    onlineIssn: null,
    amountOfJournalVersions: 10,
    journalVersionDois: ["10.33271/nvngu/2023-1/005"],
    academicIndex: 4.1,
    authors: [
      {
        orcid: "https://orcid.org/0000-0001-7468-5661",
        firstName: "Serhiy",
        lastName: "Gayda",
        academicIndex: 13.95,
        numberInRating: 4,
        importedBy: null,
      },
    ],
  },
  {
    title: "Мінералогічний журнал",
    printIssn: "2519-2396",
    onlineIssn: "2519-447X",
    amountOfJournalVersions: 9,
    journalVersionDois: ["10.15407/mineraljournal.45.01.015"],
    academicIndex: 3.9,
    authors: [],
  },
  {
    title: "Вісник Київського національного університету імені Тараса Шевченка",
    printIssn: "1728-3817",
    onlineIssn: null,
    amountOfJournalVersions: 8,
    journalVersionDois: ["10.17721/1728-3817/2023-2"],
    academicIndex: 3.5,
    authors: [],
  },
  {
    title: "Прикладна гідромеханіка",
    printIssn: "1561-9966",
    onlineIssn: null,
    amountOfJournalVersions: 7,
    journalVersionDois: ["10.15407/jah2023.01.021"],
    academicIndex: 2.8,
    authors: [],
  },
  {
    title: "Computers & Geosciences",
    printIssn: "0098-3004",
    onlineIssn: "1873-7803",
    amountOfJournalVersions: 5,
    journalVersionDois: ["10.1016/j.cageo.2020.104539"],
    academicIndex: 2.1,
    authors: [
      {
        orcid: "https://orcid.org/0000-0002-9875-1579",
        firstName: "Олег",
        lastName: "Коваль",
        academicIndex: 5.2,
        numberInRating: 7,
        importedBy: null,
      },
    ],
  },
  {
    title: "Економіка України",
    printIssn: "0131-775X",
    onlineIssn: null,
    amountOfJournalVersions: 6,
    journalVersionDois: ["10.15407/economyuau.2023.02.003"],
    academicIndex: 1.9,
    authors: [],
  },
]

export function filterMockJournals(
  payload: JournalSearchPayload = {}
): JournalsPage {
  const {
    searchQuery = "",
    indexFrom,
    indexTo,
    hasVersions = false,
    hasPrintIssn = false,
    hasOnlineIssn = false,
    sortOption = "INDEX_DESC",
    page = 0,
    size = 10,
  } = payload

  let filtered = [...MOCK_JOURNALS]

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim()
    filtered = filtered.filter((journal) => {
      const titleMatch = (journal.title ?? "").toLowerCase().includes(q)
      const printMatch = (journal.printIssn ?? "").toLowerCase().includes(q)
      const onlineMatch = (journal.onlineIssn ?? "").toLowerCase().includes(q)
      const authorMatch = journal.authors.some((author) =>
        `${author.firstName ?? ""} ${author.lastName ?? ""}`
          .toLowerCase()
          .includes(q)
      )
      return titleMatch || printMatch || onlineMatch || authorMatch
    })
  }

  if (indexFrom !== undefined && !Number.isNaN(indexFrom)) {
    filtered = filtered.filter((journal) => {
      if (journal.academicIndex === null) return false
      return journal.academicIndex >= indexFrom
    })
  }

  if (indexTo !== undefined && !Number.isNaN(indexTo)) {
    filtered = filtered.filter((journal) => {
      if (journal.academicIndex === null) return false
      return journal.academicIndex <= indexTo
    })
  }

  if (hasVersions) {
    filtered = filtered.filter(
      (journal) => (journal.amountOfJournalVersions ?? 0) > 0
    )
  }

  if (hasPrintIssn) {
    filtered = filtered.filter((journal) => Boolean(journal.printIssn))
  }

  if (hasOnlineIssn) {
    filtered = filtered.filter((journal) => Boolean(journal.onlineIssn))
  }

  filtered.sort((a, b) => {
    if (sortOption === "VERSIONS_DESC") {
      return (
        (b.amountOfJournalVersions ?? 0) - (a.amountOfJournalVersions ?? 0)
      )
    }
    if (sortOption === "TITLE_ASC") {
      const titleA = a.title ?? ""
      const titleB = b.title ?? ""
      return titleA.localeCompare(titleB)
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

export function getMockJournalDetails(issn?: string): JournalDetailsResponse {
  const normalizedIssn = (issn ?? "").trim().toLowerCase()
  const matched =
    MOCK_JOURNALS.find(
      (j) =>
        j.printIssn?.toLowerCase() === normalizedIssn ||
        j.onlineIssn?.toLowerCase() === normalizedIssn
    ) ?? MOCK_JOURNALS[0]!

  const versionsCount = matched.amountOfJournalVersions ?? 10
  const baseVersion = versionsCount > 10 ? versionsCount * 2 - 1 : versionsCount
  const versions: JournalVersionDto[] = Array.from({ length: versionsCount }).map((_, i) => {
    const versionNum = baseVersion - i
    const year = 2026 - Math.floor(i / 3)
    const month = String(1 + ((i * 4) % 12)).padStart(2, "0")
    const day = String(10 + (i % 18)).padStart(2, "0")
    const pIssn = matched.printIssn ?? "2409-2606"
    return {
      doi: `10.32347/${pIssn}.${year}.${versionNum}`,
      imageUrl: null,
      publishedDate: `${year}-${month}-${day}`,
      versionNumber: versionNum,
      journalPrintIssn: matched.printIssn,
      journalOnlineIssn: matched.onlineIssn,
    }
  })

  return {
    journal: {
      printIssn: matched.printIssn,
      onlineIssn: matched.onlineIssn,
      title: matched.title,
      authorsCount: matched.authors.length > 0 ? matched.authors.length : 9,
      versionsCount,
      impactFactor: 2.6,
      authors: matched.authors,
      journalVersions: versions,
    },
    academicIndex: matched.academicIndex,
  }
}

export const MOCK_JOURNALS_PAGE: JournalsPage = filterMockJournals()

export const MOCK_JOURNAL_DETAILS: JournalDetailsResponse = getMockJournalDetails("2409-2606")
