# Task 6: IndexedDB Data Layer

## Status
Completed

## Commit Hash
ec50299

## Build Result
PASS - `npm run build` succeeded (tsc + vite build, 3.17s)

## Files Created
- `src/db/database.ts` - IndexedDB schema (AppDB), `getDB()`, `seedDefaultData()` with 8 flashcards and 6 quiz questions
- `src/db/studySession.ts` - `saveSession()`, `getTodaySessions()`, `getWeeklySessions()`
- `src/db/flashcard.ts` - `getDueCards()`, `markReviewed()` (SM-2 algorithm), `addCard()`
- `src/db/quiz.ts` - `getQuestions()`, `saveAttempt()`, `addQuestion()`
- `src/db/planner.ts` - `getPlans()`, `addPlan()`, `updatePlan()`

## Concerns / Deviations from Plan
1. **IDBKeyRange import**: The plan instructed adding `import { IDBKeyRange } from 'idb'` to studySession.ts, but `IDBKeyRange` is not exported by the `idb` package - it is a DOM global type available when `"DOM"` is in `tsconfig.lib`. I removed the import and relied on the global type (already present via tsconfig). flashcard.ts and quiz.ts also use `IDBKeyRange` and needed the same fix.
2. **idb DBSchema type compatibility**: The plan's schema declared `id: number` as required in all store value types, but `db.add()` with auto-increment generates the id, so the input type must have `id?: number`. Changed to optional in the AppDB schema.
3. **boolean index key**: The `by-due` index declared its key type as `boolean`, which is not a valid `IDBValidKey` (`string | number | Date`). Changed to `number` to satisfy the `DBSchemaValue` constraint from idb's type definitions.
4. **StudyPlan column type**: The DB schema returns `column: string` but the StudyPlan interface narrows it to `'today' | 'week' | 'done'`. Added a type assertion in `getPlans()`.
