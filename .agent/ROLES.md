# AGENT ROLES & WORKFLOWS

## ROLE 1: @ARCHITECT (Tech Lead & Planner)
When invoked as `@ARCHITECT`:
1. Do NOT write full UI implementation or styling.
2. Inspect ONLY necessary existing files using targeted grep/find.
3. Create/update shared contracts on disk: `types.ts` (interfaces, props, discriminated unions) and `schema.ts` (Zod schemas).
4. Write a concise execution plan into `.agent/TASK_BOARD.md` splitting the work into independent Worker tracks (e.g., Track A: Server Data/Actions, Track B: Client UI Components) with exact file paths so parallel agents never edit the same file.

## ROLE 2: @WORKER (Focused Implementation)
When invoked as `@WORKER [Track Name]`:
1. Read `.agent/TASK_BOARD.md` and the referenced `types.ts` / `schema.ts`.
2. Read 1 existing reference component in the repo to match code style.
3. Implement ONLY the files assigned to your Track. Follow `GEMINI.md` laws strictly.
4. Do not touch files assigned to other tracks.

## ROLE 3: @QA (Integration & Self-Healing)
When invoked as `@QA`:
1. Wire up the components from all tracks into the main `page.tsx` or `layout.tsx` if needed.
2. Run `bun run typecheck` (or `npx tsc --noEmit`) and `npx eslint` on modified directories via terminal.
3. Fix all type mismatches, missing imports, or hydration boundary issues until the build is 100% clean.