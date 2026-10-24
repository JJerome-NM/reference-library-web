import { getTranslations } from "next-intl/server"
import { ExternalLink } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import { FOOTER_SECTIONS } from "@/src/shared/config"

export async function Footer() {
  const t = await getTranslations("footer")
  const currentYear = new Date().getFullYear()

  function getLocalizedText(key: string, fallback: string) {
    const rawKey = key.replace("footer.", "")
    try {
      return t(rawKey)
    } catch {
      return fallback
    }
  }

  return (
    <footer className="border-t border-border bg-card/40 pt-12 pb-8 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-5 lg:col-span-4 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="size-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-extrabold text-xs tracking-tight shadow-xs group-hover:bg-blue-600 transition-colors">
                Ai
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-foreground tracking-tight">
                  AcademicIndex
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded leading-none">
                  UA
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {t("tagline")}
            </p>
          </div>

          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.titleKey} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {getLocalizedText(section.titleKey, section.defaultTitle)}
                </h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {section.links.map((link) => {
                    const label = getLocalizedText(link.labelKey, link.defaultLabel)
                    return (
                      <li key={link.href}>
                        {link.isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                          >
                            <span className="group-hover:underline">{label}</span>
                            {link.isBadge && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                                {link.badgeText}
                              </span>
                            )}
                            <ExternalLink className="size-2.5 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="hover:text-foreground transition-colors block hover:underline"
                          >
                            {label}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} AcademicIndex. {t("allRightsReserved")}</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://status.academicindex.org.ua"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors border border-border/60"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>{t("status")}</span>
            </a>

            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors hover:underline">
                {t("privacy")}
              </Link>
              <Link href="/legal/terms" className="hover:text-foreground transition-colors hover:underline">
                {t("terms")}
              </Link>
              <Link href="/legal/security" className="hover:text-foreground transition-colors hover:underline">
                {t("security")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
