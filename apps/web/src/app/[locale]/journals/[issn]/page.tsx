import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/src/i18n/routing"
import { Header } from "@/src/widgets/header"
import { Footer } from "@/src/widgets/footer"
import {
  PlatformStatsCard,
  DataRegistriesCard,
  ContactsCard,
} from "@/src/widgets/sidebar"
import { JournalDetailsView } from "@/src/widgets/journal-details"
import {
  journalService,
  MOCK_JOURNALS,
  getMockJournalDetails,
} from "@/src/entities/journal"

interface JournalDetailsPageProps {
  params: Promise<{ locale: string; issn: string }>
}

export function generateStaticParams() {
  const paths: { locale: string; issn: string }[] = []
  for (const locale of routing.locales) {
    for (const journal of MOCK_JOURNALS) {
      const issn = journal.printIssn || journal.onlineIssn
      if (issn) {
        paths.push({ locale, issn })
      }
    }
  }
  return paths
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; issn: string }>
}): Promise<Metadata> {
  const { locale, issn } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const details = await journalService.getDetails(issn).catch(() => getMockJournalDetails(issn))

  return {
    title: details.journal.title ?? issn,
    description: `Наукометричні показники та випуски журналу ${details.journal.title ?? issn}`,
  }
}

export default async function JournalDetailsPage({ params }: JournalDetailsPageProps) {
  const { locale, issn } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const data = await journalService.getDetails(issn).catch(() => getMockJournalDetails(issn))

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-background text-foreground antialiased">
      <Header />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-9 space-y-5 min-w-0">
            <JournalDetailsView data={data} />
          </main>

          <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3 space-y-5 lg:sticky lg:top-24">
            <PlatformStatsCard highlightJournal={true} />
            <DataRegistriesCard />
            <ContactsCard />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
