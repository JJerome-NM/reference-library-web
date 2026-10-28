import { useTranslations } from "next-intl"
import { Mail } from "lucide-react"
import { EXTERNAL_LINKS } from "@/src/shared/config"

export function ContactsCard() {
  const t = useTranslations("common")

  return (
    <div className="bg-card/95 dark:bg-card/85 backdrop-blur-md rounded-2xl border border-border/80 p-3 shadow-xs space-y-1 text-xs">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 px-2 pt-0.5 pb-1 block select-none">
        {t("editorialContacts")}
      </span>
      <a
        href={`mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}`}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-brand-text hover:bg-muted/40 transition-colors group"
      >
        <Mail className="size-3.5 text-muted-foreground group-hover:text-brand-text shrink-0 transition-colors" aria-hidden="true" />
        <span className="font-mono text-xs truncate">
          {EXTERNAL_LINKS.SUPPORT_EMAIL}
        </span>
      </a>
    </div>
  )
}
