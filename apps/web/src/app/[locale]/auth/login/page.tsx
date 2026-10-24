import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import {
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  Lock,
  Sparkles,
  TrendingUp,
  Database,
  CheckCircle2,
  BookOpen,
} from "lucide-react"
import { routing } from "@/src/i18n/routing"
import { Link } from "@/src/i18n/navigation"
import { Header } from "@/src/widgets/header"
import { Footer } from "@/src/widgets/footer"
import { EXTERNAL_LINKS } from "@/src/shared/config"

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: "auth" })

  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "auth" })

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50 dark:bg-background text-foreground antialiased">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  <span>AcademicIndex Identity</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t("subtitle")}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Sparkles className="size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>{t("userAuthNotice")}</span>
                </div>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  {t("userAuthDesc")}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={EXTERNAL_LINKS.ADMIN_CONSOLE}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full flex items-center justify-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer group"
                >
                  <Lock className="size-4" aria-hidden="true" />
                  <span>{t("adminConsoleButton")}</span>
                  <ExternalLink className="size-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </a>

                <p className="text-[11px] text-center text-muted-foreground font-mono">
                  {t("adminConsoleDesc")}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/70">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground py-2 px-4 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                <span>{t("backToHome")}</span>
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
                <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>{t("securityNotice")}</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 flex-col justify-between overflow-hidden border-l border-border/40 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.18),transparent_70%)] pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 size-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative space-y-4 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-blue-200">
                <Sparkles className="size-3 text-amber-300" aria-hidden="true" />
                <span>{t("verifiedDataBadge")}</span>
              </div>

              <h2 className="text-xl font-black leading-snug tracking-tight">
                {t("heroTitle")}
              </h2>
              <p className="text-xs text-blue-100/70 leading-relaxed">
                {t("heroSubtitle")}
              </p>
            </div>

            <div className="relative space-y-3 z-10 py-6">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <TrendingUp className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[11px] text-blue-200/80 font-medium">Академічний індекс</div>
                  <div className="text-sm font-black font-mono">18,96 (Топ-1 рейтинг)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <Database className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[11px] text-blue-200/80 font-medium">Реєстр публікацій</div>
                  <div className="text-sm font-black font-mono">4 952 верифіковані праці</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <div className="size-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <BookOpen className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[11px] text-blue-200/80 font-medium">Видання України</div>
                  <div className="text-sm font-black font-mono">37 фахових журналів</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 text-[10px] text-blue-200/60 flex items-center justify-between">
              <span>AcademicIndex Core v2.0</span>
              <span>UA Scientometrics</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
