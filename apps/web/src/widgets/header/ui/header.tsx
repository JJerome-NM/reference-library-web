import { getTranslations } from "next-intl/server"
import { LogIn } from "lucide-react"
import { Link } from "@/src/i18n/navigation"
import { LocaleSwitcher } from "@/src/features/locale-switcher"
import { ThemeToggle } from "@/src/features/theme-toggle"
import { APP_ROUTES } from "@/src/shared/config"
import { HeaderNav } from "./header-nav"
import { HeaderMobileMenu } from "./header-mobile-menu"

export async function Header() {
  const t = await getTranslations("common")

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <HeaderMobileMenu />

          <Link href={APP_ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-extrabold text-xs tracking-tight shadow-xs group-hover:bg-blue-600 transition-colors">
              Ai
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-foreground tracking-tight leading-none">
                  {t("brandName")}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded leading-none">
                  {t("uaBadge")}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium leading-none mt-1 hidden sm:block">
                {t("brandSubtitle")}
              </span>
            </div>
          </Link>

          <div className="h-5 w-px bg-border hidden md:block" />

          <HeaderNav />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center gap-1.5 bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs active:scale-95"
          >
            <LogIn className="size-3.5" aria-hidden="true" />
            <span>{t("login")}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
