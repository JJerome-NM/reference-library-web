# PROJECT CONSTITUTION (NEXT.JS APP ROUTER + STRICT TS)

Respond in **Ukrainian**, concisely. Zero fluff, no introductory essays, no theoretical lectures.

## CORE ENGINEERING LAWS (APPLY TO ALL AGENTS)
1. **RSC by Default:** Every component is a Server Component unless it strictly requires state, effects, or browser listeners. Push `'use client'` to leaf nodes only.
2. **Next.js 15/16 Async APIs:** ALWAYS `await` `params`, `searchParams`, `cookies()`, and `headers()`.
3. **Strict TypeScript:** Zero `any`, no `React.FC`, no blind `as` casting. Use discriminated unions for UI states and `zod` for runtime boundaries.
4. **No Effect Fetching:** Never fetch data inside `useEffect`. Use RSC for initial reads, Server Actions (`useActionState`) for mutations, or TanStack Query for client caching.
5. **UI & A11y:** Semantic HTML (`button`, `nav`, `main`, `section`), keyboard accessibility, `focus-visible:ring-*`, `cn()` utility for Tailwind.

## MULTI-AGENT COORDINATION PROTOCOL
We work via shared contract files on disk.
- Check `.agent/TASK_BOARD.md` if referenced to see your assigned scope.
- Never modify files outside your assigned scope when running as a Worker.
- **MANDATORY GATEKEEPER:** Before finishing ANY code modification turn, you MUST run `bun run typecheck` (or `npx tsc --noEmit`) in the terminal. If errors exist in your touched files, fix them immediately until exit code is 0.