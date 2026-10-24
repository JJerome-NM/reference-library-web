import { Suspense } from "react"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/src/i18n/routing"
import { Header } from "@/src/widgets/header"
import { Footer } from "@/src/widgets/footer"
import { SearchConsole } from "@/src/features/search-console"
import {
  AuthorFiltersCard,
  PlatformStatsCard,
  DataRegistriesCard,
  ContactsCard,
  MobileFilterDrawer,
} from "@/src/widgets/sidebar"
import { AuthorsTable } from "@/src/widgets/authors-table"

interface AuthorsPageProps {
  params: Promise<{ locale: string }>
}

export default async function AuthorsPage({ params }: AuthorsPageProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-background text-foreground antialiased">
      <Header />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <Suspense fallback={<div className="h-96 animate-pulse bg-muted/20 rounded-2xl" />}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-5 min-w-0">
              <SearchConsole initialMode="author" />
              <MobileFilterDrawer>
                <AuthorFiltersCard />
              </MobileFilterDrawer>
              <AuthorsTable />
            </main>

            <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3 space-y-5 lg:sticky lg:top-24">
              <div className="hidden lg:block">
                <AuthorFiltersCard />
              </div>
              <PlatformStatsCard highlightAuthor={true} />
              <DataRegistriesCard />
              <ContactsCard />
            </aside>
          </div>
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
