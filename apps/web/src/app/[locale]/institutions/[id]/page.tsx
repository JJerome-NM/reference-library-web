import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/src/i18n/routing"
import { Header } from "@/src/widgets/header"
import { Footer } from "@/src/widgets/footer"
import {
  DataRegistriesCard,
  ContactsCard,
} from "@/src/widgets/sidebar"
import { InstitutionDetailsView } from "@/src/widgets/institution-details"
import {
  institutionService,
  MOCK_INSTITUTIONS,
  getMockInstitutionDetails,
} from "@/src/entities/institution"

export const revalidate = 3600

interface InstitutionDetailsPageProps {
  params: Promise<{ locale: string; id: string }>
}

export function generateStaticParams() {
  const paths: { locale: string; id: string }[] = []
  for (const locale of routing.locales) {
    for (const inst of MOCK_INSTITUTIONS) {
      paths.push({ locale, id: String(inst.institutionId) })
    }
  }
  return paths
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const details = await institutionService.getDetails(id).catch(() => getMockInstitutionDetails(id))
  const title = details.institution.nameUA || details.institution.nameEN || id

  return {
    title,
    description: `Наукометричні показники та дослідники установи ${title}`,
  }
}

export default async function InstitutionDetailsPage({ params }: InstitutionDetailsPageProps) {
  const { locale, id } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const data = await institutionService.getDetails(id).catch(() => getMockInstitutionDetails(id))

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-background text-foreground antialiased">
      <Header />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <main className="order-1 lg:order-2 lg:col-span-8 xl:col-span-9 space-y-5 min-w-0">
            <InstitutionDetailsView data={data} />
          </main>

          <aside className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3 space-y-5 lg:sticky lg:top-24">
            <DataRegistriesCard />
            <ContactsCard />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
