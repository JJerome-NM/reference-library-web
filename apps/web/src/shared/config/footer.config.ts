import { APP_ROUTES, EXTERNAL_LINKS } from "./navigation.config"

export interface FooterLink {
  readonly labelKey: string
  readonly defaultLabel: string
  readonly href: string
  readonly isExternal?: boolean
  readonly isBadge?: boolean
  readonly badgeText?: string
}

export interface FooterSection {
  readonly titleKey: string
  readonly defaultTitle: string
  readonly links: readonly FooterLink[]
}

export const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    titleKey: "footer.registriesTitle",
    defaultTitle: "Реєстри даних",
    links: [
      {
        labelKey: "footer.publications",
        defaultLabel: "Публікації",
        href: APP_ROUTES.PUBLICATIONS,
      },
      {
        labelKey: "footer.authors",
        defaultLabel: "Науковці України",
        href: APP_ROUTES.AUTHORS,
      },
      {
        labelKey: "footer.journals",
        defaultLabel: "Наукові журнали",
        href: APP_ROUTES.JOURNALS,
      },
      {
        labelKey: "footer.institutions",
        defaultLabel: "Установи та ЗВО",
        href: APP_ROUTES.INSTITUTIONS,
      },
    ],
  },
  {
    titleKey: "footer.forPublishersTitle",
    defaultTitle: "Науковцям та видавцям",
    links: [
      {
        labelKey: "footer.methodology",
        defaultLabel: "Методологія індексу",
        href: "/about/methodology",
      },
      {
        labelKey: "footer.indexingCriteria",
        defaultLabel: "Критерії індексації",
        href: "/about/indexing",
      },
      {
        labelKey: "footer.orcidIntegration",
        defaultLabel: "Інтеграція ORCID",
        href: "https://orcid.org",
        isExternal: true,
      },
      {
        labelKey: "footer.issnStandards",
        defaultLabel: "Стандарти ISSN",
        href: "https://www.issn.org",
        isExternal: true,
      },
    ],
  },
  {
    titleKey: "footer.platformTitle",
    defaultTitle: "Платформа та сервіси",
    links: [
      {
        labelKey: "footer.adminConsole",
        defaultLabel: "Панель управління",
        href: EXTERNAL_LINKS.ADMIN_CONSOLE,
        isExternal: true,
        isBadge: true,
        badgeText: "Admin",
      },
      {
        labelKey: "footer.openApi",
        defaultLabel: "Відкритий API",
        href: "/docs/api",
      },
      {
        labelKey: "footer.about",
        defaultLabel: "Про проєкт",
        href: "/about",
      },
      {
        labelKey: "footer.editorialContacts",
        defaultLabel: "Контакти редакції",
        href: `mailto:${EXTERNAL_LINKS.SUPPORT_EMAIL}`,
        isExternal: true,
      },
    ],
  },
] as const
