"use client"

import { useTranslations } from "next-intl"
import {
  LogIn,
  Menu,
  FileText,
  Users,
  BookOpen,
  Building2,
} from "lucide-react"
import { Link, usePathname } from "@/src/i18n/navigation"
import { LocaleSwitcher } from "@/src/features/locale-switcher"
import { ThemeToggle } from "@/src/features/theme-toggle"
import { APP_ROUTES } from "@/src/shared/config"
import { cn } from "@workspace/ui/lib/utils"
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

export function HeaderMobileMenu() {
  const t = useTranslations("common")
  const pathname = usePathname()

  const isPublicationsActive = pathname === APP_ROUTES.HOME || pathname === APP_ROUTES.PUBLICATIONS
  const isAuthorsActive = pathname.startsWith(APP_ROUTES.AUTHORS)
  const isJournalsActive = pathname.startsWith(APP_ROUTES.JOURNALS)
  const isInstitutionsActive = pathname.startsWith(APP_ROUTES.INSTITUTIONS)

  return (
    <div className="md:hidden">
      <SheetTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="size-9 p-0 rounded-xl text-foreground hover:bg-muted cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <Sheet side="left" className="w-[85vw] max-w-xs">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-slate-950 text-white flex items-center justify-center font-extrabold text-xs">
                Ai
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-foreground">
                  {t("brandName")}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded leading-none">
                  {t("uaBadge")}
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1 py-4 text-sm font-semibold">
            <Link
              href={APP_ROUTES.HOME}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isPublicationsActive
                  ? "text-brand-subtle-foreground bg-brand-subtle border border-brand-border font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <FileText className="size-4" aria-hidden="true" />
              <span>{t("allPublications")}</span>
            </Link>
            <Link
              href={APP_ROUTES.AUTHORS}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isAuthorsActive
                  ? "text-brand-subtle-foreground bg-brand-subtle border border-brand-border font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Users className="size-4" aria-hidden="true" />
              <span>{t("allAuthors")}</span>
            </Link>
            <Link
              href={APP_ROUTES.JOURNALS}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isJournalsActive
                  ? "text-brand-subtle-foreground bg-brand-subtle border border-brand-border font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <BookOpen className="size-4" aria-hidden="true" />
              <span>{t("allJournals")}</span>
            </Link>
            <Link
              href={APP_ROUTES.INSTITUTIONS}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isInstitutionsActive
                  ? "text-brand-subtle-foreground bg-brand-subtle border border-brand-border font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Building2 className="size-4" aria-hidden="true" />
              <span>{t("allInstitutions")}</span>
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-border space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <LogIn className="size-3.5" aria-hidden="true" />
              <span>{t("login")}</span>
            </Link>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground font-medium">Мова та тема</span>
              <div className="flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Sheet>
      </SheetTrigger>
    </div>
  )
}
