# Afro Biome Foods: future work and reference

_Last updated: 2026-05-14 (from full codebase pass). Update this file when you ship features or change architecture._

This note captures **follow-ups, gaps, and “Phase 2” style hints** found in the repo so you can prioritize without re-discovering them.

---

## 1. Recipes & images

| Area | Where | What to do later |
|------|--------|-------------------|
| **Final dish photos** | `data/recipeFinalImages.ts` | Each `recipe_id` maps to a static `require(...)`. Add keys for **new** recipes; swap paths when you replace ingredient shots with plated shots. Metro requires **string-literal** paths (no dynamic `require(variable)`). |
| **Placeholder asset** | `assets/images/icon.png` | Used when a `recipe_id` has no map entry. |
| **Filename quirks on disk** | `assets/images/soupsrecipepictures/` | `Palm fruit souo (Banga).png` (typo “souo”). `Vegetable yam (Ji akwokwo nri).jpg` vs recipe id `ji-akwukwo-nri` (“akwokwo” vs “akwukwo”). Rename files **or** update `require()` paths together. |
| **Local vs Supabase recipes** | `hooks/useRemoteRecipes.ts` | Currently **always** loads `data/recipes.ts` (no Supabase fetch). To use the table again: restore fetch + Realtime, keep `recipeFinalImage(id)` for images unless you store image module ids / URLs in `doc` and teach `mapRecipeDoc` to resolve them. |
| **Mapper `final_image`** | `lib/supabase/mappers.ts` | Remote rows still get `RECIPE_FINAL_IMAGE_PLACEHOLDER`. Later: add optional `final_image_key` or URL in `doc` and map to `ImageSource` or keep using `recipeFinalImage(source_id)`. |
| **Seed SQL vs app data** | `supabase/migrations/20260507101500_seed_recipes.sql` | Seed reflects an **older** small recipe set. App `data/recipes.ts` is much larger. Re-seed or migrate JSON if the catalog should match production DB. |
| **Save recipe (favorites)** | `app/(tabs)/recipes/[id].tsx` | Save button shows **“Saved recipes ship in Phase 2.”** Implement persistence (local SQLite/AsyncStorage or Supabase per-user table) + UI list. |

---

## 2. Admin panel vs app recipe model (drift)

| Issue | Files | Action |
|-------|--------|--------|
| **Category / difficulty enums** | `app/admin/recipes.tsx` uses `soups \| swallows \| vegetables \| soft` and **easy \| medium** only. | `data/recipes.ts` uses **`pepper_soups`, `porridges`, `delicacies`, `snacks`** and **`hard`**. Align admin form + `formToDoc` with `Recipe` / `RecipeCategory` or derive a shared type from `data/recipes.ts`. |
| **Servings & fields** | `Recipe` in `data/recipes.ts` includes `servings`, `final_image`, etc. | Ensure admin `doc` JSON includes fields the app reads; extend admin UI if you add columns to `doc`. |

---

## 3. Supabase, auth & environment

| Topic | Where | Notes |
|-------|--------|--------|
| **Env vars** | `lib/supabase/client.ts` | Needs `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_KEY`. Missing → guest/offline behavior across hooks. |
| **Admin flag** | `context/AuthContext.tsx`, migration comment | Admin is **`app_metadata.admin === true`** in Supabase Dashboard (not a DB column on users). |
| **Google sign-in** | `components/GoogleSignInButton.tsx` | Native path mentions `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`; web uses Supabase redirect. Configure provider + redirect URLs in Supabase. |
| **Auth storage** | `lib/supabase/client.ts` | `safeStorage` wraps AsyncStorage with **in-memory fallback** if the native module fails. Good for dev; document for production expectations. |

---

## 4. Community & content

| Topic | Where | Notes |
|-------|--------|--------|
| **Share without Supabase** | `app/(tabs)/community/share.tsx` | Shows **demo** alert and goes back; no local queue. |
| **Voice stories** | Same file + `lib/i18n.ts` | **“Voice capture arrives in Phase 2 with consent flows.”**. Needs recording, storage, consent copy, and likely moderation. |
| **Community list hook** | `hooks/useRemoteCommunity.ts` | Loads `community_posts` when configured; `mapCommunityRow` expects **loose doc fields**. Verify shape matches SQL columns (`title`, `content`, `author_uid`, …) vs what `mapCommunityRow` reads (`content_en`, `authorName`, etc.). Adjust mapper or add a DB view if posts look wrong when wired. |
| **Pills on community home** | `app/(tabs)/community/index.tsx` | Story / voice / recipe swap labels are **decorative** only. Wire filters or deep links when behavior exists. |

---

## 5. Events & classes

| Topic | Where | Notes |
|-------|--------|--------|
| **Event registration** | `app/(tabs)/events/index.tsx` | Copy mentions **calendar sync & push in Phase 2**. |
| **Classes** | `app/classes/index.tsx` | **Placeholder lessons**. Connect Zoom / WebRTC / hosted video + auth when backend exists. |

---

## 6. Home & marketing UX

| Topic | Where | Notes |
|-------|--------|--------|
| **Featured recipe image** | `app/(tabs)/home.tsx` | Uses **Unsplash** URL, not `recipe.final_image`. Consider using local `featured.final_image` or a curated hero per season. |
| **Featured recipe choice** | Same | Uses `recipes[0]`. With alphabetical list elsewhere, home may not match “featured” intent; pick by tag, date, or CMS field. |
| **Welcome title** | `app/(tabs)/home.tsx` | Greeting block is **commented out**; `name` variable was removed after lint. Restore if you want personalized welcome. |

---

## 7. Services & maps

| Topic | Where | Notes |
|-------|--------|--------|
| **Web map** | `app/(tabs)/services/index.tsx` + `components/ServiceMap/` | Message: interactive maps **best on native**. Improve web (static map image, embed, or MapLibre) if web is a target. |
| **Remote services** | `hooks/useRemoteServices.ts` | Same pattern as events: Supabase optional, fallback `data/services.ts`. |

---

## 8. Nutrition & education

| Topic | Where | Notes |
|-------|--------|--------|
| **Content source** | `data/nutrition.ts`, `app/nutrition/index.tsx` | Static cards + TTS. Later: CMS, clinician review dates, or links to sources. |
| **TTS only** | Nutrition + recipe screens | No pre-recorded **audio_en / audio_ig** playback yet despite optional fields on `Recipe`. `lib/i18n` `demoAudio` string still applies on recipe detail. |

---

## 9. Recipe detail & cooking mode

| Topic | Where | Notes |
|-------|--------|--------|
| **Read-aloud** | `app/(tabs)/recipes/[id].tsx` | Uses `expo-speech` for ingredients + steps. Good baseline; optional: SSML, pause controls, Igbo voice selection. |
| **Cooking mode** | `app/(tabs)/recipes/cooking/[id].tsx` | Uses **`getRecipeById` only** (not `useRemoteRecipes`). Consistent while recipes are local-only; if remote returns, ensure same source of truth. |
| **Timers / hands-free** | Cooking screen | Step navigation only. Add timers, keep-awake, or haptics per step later. |

---

## 10. i18n, accessibility, settings

| Topic | Where | Notes |
|-------|--------|--------|
| **“Notifications (coming soon)”** | `lib/i18n.ts` | Wire Expo notifications or a preferences API when ready. |
| **Onboarding** | `app/onboarding/*` | PIN / accessibility flows exist. Keep in sync with any new auth requirements. |
| **Settings** | `app/settings.tsx` | Admin entry to `/admin/recipes` when `isAdmin`. Ensure production routing is protected (you may add middleware or hide route for non-admin builds). |

---

## 11. Database & migrations

| File | Purpose |
|------|---------|
| `supabase/migrations/20260502000000_initial_remote_schema.sql` | `recipes` / `events` / `services` JSON `doc` tables; `community_posts` relational; RLS; Realtime publication. |
| `supabase/migrations/20260507101500_seed_recipes.sql` | Adds `source_id`, small seed. **out of date vs app recipes**. |

**Later:** RLS review for `community_posts` (public read, own-row write), indexes on `created_at`, backups, and Edge Functions if you add server-side validation.

---

## 12. Engineering hygiene

| Item | Notes |
|------|--------|
| **Automated tests** | No `*.test.ts` / Jest suite found. Add smoke tests for mappers, `recipeFinalImage` keys vs `recipes.map(r => r.recipe_id)`, and critical navigation. |
| **CI** | Run `npx expo lint` and `npx tsc --noEmit` in CI when you add a pipeline. |
| **Duplicate path spellings** | Repo may show both `app/(tabs)/` and `app\(tabs)\` on Windows. Same files; avoid duplicating edits. |
| **`.env.local`** | Document required keys in README for new devs (`EXPO_PUBLIC_*`). |

---

## 13. Quick “when I touch X, also check Y”

- **New `recipe_id` in `data/recipes.ts`** → add row in `data/recipeFinalImages.ts` (or stays on icon).
- **Change Supabase `doc` shape** → update `lib/supabase/mappers.ts` + admin `formToDoc` + any seed SQL.
- **Turn remote recipes back on** → reconcile `useRemoteRecipes`, `mapRecipeDoc`, and `final_image` strategy.
- **Rename image files** → grep for old `require("...")` paths in `recipeFinalImages.ts`.

---

*Tip: After each milestone, append a short dated section below so this file becomes a lightweight changelog for “what we deferred and why.”*
