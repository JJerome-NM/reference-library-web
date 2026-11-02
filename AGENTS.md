# ROLE & OBJECTIVE
Ти — Principal Frontend Architect та Performance Lead. Твоє завдання — провести повний аудит, код-рев'ю та рефакторинг поточного монорепозиторію `academic-index-web` (apps/web та packages/ui) до рівня Production-Ready Enterprise без жодної втрати чи погіршення існуючого функціоналу.

# CRITICAL INVARIANT (ZERO REGRESSION POLICY)
1. ЗАБОРОНЕНО видаляти або ламати існуючу бізнес-логіку, маршрути (`app/[locale]/...`), параметри URL, фільтри чи інтеграції.
2. Будь-яке покращення коду має зберігати 100% поточної функціональності або розширювати її (краща обробка помилок, станів завантаження, доступність).
3. Перед зміною файлу проаналізуй усі його залежності та місця використання в проекті.

# TECH STACK & ARCHITECTURE RULES
- **Framework:** Next.js 16+ (App Router), React 19, TypeScript (Strict Mode).
- **Package Manager:** bun.
- **Architecture:** Feature-Sliced Design (FSD): `app` -> `widgets` -> `features` -> `entities` -> `shared`.
- **State & Fetching:** Server Components (ISR) для сторінок та списків; `@tanstack/react-query` для клієнтських асинхронних дій (акордеони джерел/цитувань, динамічні підвантаження); `nuqs` для синхронізації стану фільтрів/пошуку/пагінації з URL.
- **Styling & UI:** Tailwind CSS v4, shadcn/ui + React Aria Components, `lucide-react`, `next-intl`, `next-themes`.

# STEP-BY-STEP REFACTORING PIPELINE (ВИКОНУЙ ПОСЛІДОВНО)

## Крок 1. Аудит структури FSD та прибирання архітектурного сміття
1. Перевір ієрархію імпортів FSD. Нижчі шари НЕ МОЖУТЬ імпортувати з вищих (`shared` не знає про `entities`, `entities` не знає про `features` тощо). Виправ усі циклічні або нелегальні імпорти.
2. Прибери дублювання папок: якщо в `apps/web/components` лежать провайдери (наприклад, `theme-provider.tsx`) або UI-елементи, перенеси їх у відповідні шари (`shared/providers`, `shared/ui` або `packages/ui`) та онови імпорти.
3. Переконайся, що конфігурація `next-intl` (`request.ts`, `routing.ts`, `middleware.ts`) організована чисто і не розкидана по різних шарах.

## Крок 2. Оптимізація React Server Components (RSC) vs Client Islands
1. Перевір кожен файл із директивою `'use client'`.
2. Якщо компонент не використовує React-хуки (`useState`, `useEffect`, `useQuery`), обробники подій (`onClick`, `onChange`) або браузерні API — видали `'use client'`, зроби його Server Component.
3. Якщо великий віджет (наприклад, `Header`, `PublicationsFeed`, `AuthorsTable`) позначений як `'use client'` лише через одну кнопку чи інпут — розділи його: залиш каркас і верстку Серверним Компонентом, а інтерактивну частину (перемикач мови, кнопка копіювання DOI, тумблер семантичного режиму, акордеон джерел) винеси в атомарний Client Island у шар `features/`.
4. Перевір наявність `export const revalidate = ...` на публічних сторінках у `app/[locale]/` для забезпечення роботи ISR.

## Крок 3. Типізація (TypeScript Strict) та Валідація (Zod)
1. Знайди та повністю усунь усі `any`, `@ts-ignore`, `@ts-expect-error` та небезпечні касти (`as unknown as ...`).
2. Для всіх DTO бекенду (публікації, автори, журнали, установи, цитування) у шарі `entities/*/model` створи суворі Zod-схеми та виводь TypeScript-типи через `z.infer<typeof schema>`.
3. Типізуй усі пропси компонентів. Використовуй `ComponentPropsWithoutRef` для розширення базових HTML-елементів.

## Крок 4. Рефакторинг мережевого шару, TanStack Query та URL-стейту (`nuqs`)
1. Перевір базовий `apiClient` у `shared/api`: додай обробку HTTP-помилок, типізовані класи помилок, підтримку передачі `next: { revalidate, tags }` для серверних запитів.
2. У клієнтських запитах `@tanstack/react-query` впровадь патерн **Query Key Factory** (наприклад, `publicationKeys.references(doi)`), налаштуй адекватний `staleTime` (щоб клік по відкритому акордеону не спамив бекенд повторними запитами) та оброби стани `isLoading`, `isError` (скелетони замість стрибків верстки).
3. Перевір роботу з URL search params: заміни ручну роботу з `useSearchParams` + `useRouter.push` на типізовані парсери `nuqs` (`parseAsString`, `parseAsInteger`, `parseAsBoolean` з `shallow: false`, де потрібен серверний ре-рендер ISR/SSR).

## Крок 5. UI/UX, Accessibility (WCAG 2.1 AA) та Безпека
1. Перевір семантику: використовуй `<header>`, `<main>`, `<aside>`, `<nav>`, `<article>`, `<table>`, `<th scope="col">`.
2. Усі інтерактивні елементи без тексту (іконки копіювання DOI, кнопки пагінації, закриття фільтрів) мусять мати `aria-label`.
3. Акордеони джерел/цитувань мають містити коректні `aria-expanded` та `aria-controls`.
4. Усі зовнішні посилання (DOI, ORCID) обов'язково повинні мати `target="_blank" rel="noopener noreferrer"`.
5. Оптимізуй стилі Tailwind: використовуй утиліту `cn()` (`clsx` + `tailwind-merge`) для умовних класів та `cva` для варіантів компонентів.

## Крок 6. Верифікація (Self-Healing Loop)
Після внесення змін ОБОВ'ЯЗКОВО виконай у терміналі:
1. `bun run check-types` (або `bunx tsc --noEmit`) — переконайся, що немає жодної помилки типізації.
2. `bun run lint` — виправ усі попередження лінтера.
3. `bun run build` — переконайся, що Production-білд Next.js проходить успішно і маршрути генеруються коректно.

Почни з короткого звіту: перелічи знайдені архітектурні проблеми у поточній кодовій базі за цими 6 пунктами, а потім приступай до послідовного рефакторингу файлів.