# AuClair Help Center — Build Progress

Living build log for the WordPress Help Center build, tracked against the plan in
`sites-template/wordpress/`. Updated after each task completes — see `MEMORY.md`-style
"most recent state" at the top, full history below.

**Last updated:** 2026-08-10 (bugfix session — Site Editor template editing issues)
**Current phase:** Pages 1–4 completed (landing + category + article + raise-a-ticket with fidelity verification). Next: Page 5 (ticket-submitted).

**Process:** This file is meant to be kept current by a dedicated subagent
(`.claude/agents/progress-tracker.md`), invoked after each task completes. Claude Code only
loads custom subagent definitions at session start, so until the next session begins, updates
are made directly instead — the intent is the same either way: update this file after each
completed task rather than let it drift.

---

## Stack in place

- WordPress core at `app/public/`, block theme `auclair-help-center` + mu-plugin `auclair-core`,
  scaffolded from [10up/wp-scaffold](https://github.com/10up/wp-scaffold) and merged into
  `app/public/wp-content/`.
- Text domain `auclair` (unified across theme + mu-plugin — the scaffold CLI defaults to
  per-package domains, corrected by hand).
- Block namespace `auclair/`.
- Node 24.13.0 (via nvm) + 10up Toolkit for asset builds; Composer for PHP deps
  (`--ignore-platform-reqs` needed — scaffold wants PHP 8.3/8.4, Local site runs 8.2.29).
- Git initialized at repo root; **nothing committed yet** (not requested).
- `WP_DEBUG_LOG`, `SCRIPT_DEBUG`, and `WP_DEVELOPMENT_MODE=theme` enabled in `wp-config.php`
  for this build (theme file caches — patterns, templates — would otherwise go stale between edits).

## Completed tasks

### 1–3. Scaffold setup
- `git init` + `.gitignore` (excludes `conf/`, `logs/`, `wp-config.php`, `uploads/`, `node_modules/`,
  `vendor/`, composer-managed `plugins/`).
- 10up/wp-scaffold merged into `app/public/wp-content/`: block theme selected, theme slug
  `auclair-help-center`, plugin slug `auclair-core`.
- `npm install` + `composer install` (root, theme, mu-plugin) all green.

### 4. `theme.json` design tokens
- Color palette (background/surface/foreground/border/accent-blue + glow) from `00-overview.md`.
- Fluid font sizes (display 40→48, section 24→28) + static (card-title 20, body 16, meta 14).
- Satoshi font family declared with `fontFace` entries pointing at
  `assets/fonts/satoshi-{500,700}.woff2` — **files not present**, falls back to system-ui until
  real Satoshi woff2s are added to the theme.
- Radius scale (`--wp--custom--radius--{field,card,panel,glow}`) and glow-blur as custom properties.

### 5. Post types & taxonomies (`mu-plugins/auclair-core/src/`)
- `PostTypes/KbArticle.php` — custom `help/%help_category%/%kb_article%` permastruct (WP core only
  auto-substitutes `%<post_type>%`, not `%postname%`, for custom permastructs — had to
  `add_rewrite_tag()` for both tokens by hand). Full native-meta field group (intro, steps,
  group, related, is_top_query, chip_label, vote_up/down/score/last, view_count).
- `PostTypes/SupportTicket.php` — non-public, custom `support_ticket` capability type, caps
  granted to `administrator` on first load.
- `Taxonomies/HelpCategory.php` — hierarchical, term meta (icon/accent/short_description/order/
  in_ticket_form) with a hand-rolled add/edit-screen meta box (no ACF in this stack — native
  meta throughout, per CLAUDE.md's "native meta" fallback option). Seeds the 8 default terms.
- `Taxonomies/{HelpTag,TicketStatus,TicketPriority,Platform,Audience}.php` — seeded with spec's
  default terms.
- `Admin/ArticleColumns.php` — Helpful/Score/Votes/Views columns on the `kb_article` admin list,
  sortable, "Needs attention" filter (score < 50%, ≥5 votes), Feedback metabox with reset button.
- Decided against implementing `help_promo` CPT — `cta-banner` is a static block with its own
  heading/body/button attributes per `blocks.md`, so the CPT would be unused. `kb_glossary`
  explicitly marked "optional, future" in the spec — skipped.

### 6. Shared blocks (`themes/auclair-help-center/blocks/`)
14 blocks built, all registering cleanly (`wp eval` confirms `auclair/*` in the block registry,
no PHP warnings in debug.log):

| Block | Type | Notes |
|---|---|---|
| `logo-bar` | S | Text wordmark fallback when no logo image uploaded |
| `breadcrumb` | D | Derives trail from queried object; `overrideLabel`/`overrideUrl` attrs for the ticket-submitted page's special case |
| `pill`, `divider`, `section-heading` | S | Straightforward |
| `button` | S | primary/secondary/ghost variants |
| `icon-tile` | S (styles moved global — see gotcha below) | Curated ~15-icon inline-SVG set in `template-tags.php` (PHP) + `blocks/icon-tile/icons.ts` (JS), kept in sync by hand |
| `help-hero` | S w/ InnerBlocks | Locked to `search-bar` + `quick-help-chips` |
| `search-bar` | S+I | Interactivity API; owns the shared `auclair` store's `state.searchQuery`; live suggestions via `/wp-json/wp/v2/kb_article?search=` |
| `quick-help-chips` | D+I | `source`: manual/term/popular; chip click without a URL writes into the same shared `state.searchQuery` |
| `category-grid` | D | Composes N `category-card` via `render_block()` |
| `category-card` | D | Reuses `render_icon_tile()` PHP helper; `auclair-ring-hover` class |
| `top-queries` | D | `source`: sticky (is_top_query, falls back to most-viewed) / most-viewed / manual |
| `cta-banner` | S | Reuses icon-tile/button markup+classes directly in JSX |

**Gotcha resolved:** `category-card`/`cta-banner` build their icon-tile/button markup via a shared
PHP helper or raw JSX (not by inserting the actual `auclair/icon-tile` or `auclair/button` block),
so 10up-toolkit's per-block conditional CSS loading never enqueues those blocks' stylesheets on
pages that don't literally contain them. Fixed by moving `icon-tile` and `button` CSS out of their
block-level `style.css` into the always-loaded global stylesheet
(`assets/css/components/{icon-tile,button}.css`), and removing the block-level `style.css` files
entirely (both blocks now rely solely on the global one, verified via `add_editor_style()` so the
editor canvas still picks it up).

**Bug found & fixed via live-browser testing:** the shared `ring-hover` CSS's
`@media (prefers-reduced-motion: reduce)` block wasn't taking effect the way expected in the
compiled output — restructured into two explicit `@media (prefers-reduced-motion: reduce)` /
`@media not all and (prefers-reduced-motion: reduce)` blocks around the animation trigger.
**Root cause was actually a stale browser tab** (screenshotted before reloading post-fix) — but
the restructured CSS is a legitimate improvement (explicit opt-in/opt-out media queries instead of
an `!important` override) and was kept.

### 7. Page 1 — Landing (`/help`)
- `templates/page.html` overrides the theme's default page template to drop the generic
  site header/footer template parts (our chrome — `logo-bar` — lives in each page's own content,
  per the prototype, not a shared site-wide header).
- `patterns/help-center-home.php` — full landing composition, registered as a
  `core/pattern`-referenceable block pattern.
- Actual "Help Center" page created (`/help/`, post ID 8) with content
  `<!-- wp:pattern {"slug":"auclair-help-center/help-center-home"} /-->` — single source of
  truth stays in the pattern file; dynamic blocks inside it (category-grid, top-queries,
  quick-help-chips) re-render fresh on every request.
- Seeded 10 sample `kb_article` posts across all 8 categories (with `view_count` and
  `is_top_query` meta) to verify the grid/list blocks render real data, not just empty states.
- Verified in-browser via screenshots: hero, search bar, 8 category cards with correct counts,
  10 top-queries with dividers, CTA banner, and the hover-ring animation actually animating
  (not stuck on).

### 8. Page 2 — Category (`/help/{category}`)
- Three new dynamic blocks built (`blocks/`):
  - `category-header` — renders term icon (large, glow-centered, via `render_icon_tile('large')`),
    term name (h1), and term description. Reads `termId` attribute or auto-derives from
    `get_queried_object()` when `is_tax(HelpCategory::NAME)`.
  - `article-group` — queries current term's `kb_article` posts (`orderby => 'menu_order title'`),
    buckets by `group` post meta (first-seen order), renders uppercase accent-bar label + bordered
    surface-card list per bucket (divider-separated rows, chevron icons). No attributes; auto-derives
    queried object like `breadcrumb`/`category-grid`.
  - `related-categories` — sibling `help_category` terms (same parent, excluding current + optional
    `exclude` attribute), limit 3, ordered by `order` term meta, composed via `render_block()` of
    `auclair/category-card`. Fixed 3-column CSS grid (not variable `--auclair-grid-columns` used by
    `category-grid`), stacks to 1 column at 720px breakpoint.
- `patterns/category-page.php` (slug `auclair-help-center/category-page`) — full page composition:
  logo-bar → breadcrumb (`showBack:false`) → category-header → divider → article-group →
  section-heading "Related categories" → related-categories → cta-banner (heading/body/button all
  hardcoded; button→`/help/raise-a-ticket/`, accent gold `#E9CA75` matching prototype).
- `templates/taxonomy-help_category.html` — mirrors `page.html` (wraps `main` group, refs pattern
  via `<!-- wp:pattern {"slug":"auclair-help-center/category-page"} /-->`).
- **Bug found & fixed:** pattern was using `<!-- wp:auclair/divider /-->` (self-closing syntax) for
  the static divider block, followed by its literal saved HTML and paired `<!-- /wp:auclair/divider -->`.
  Invalid grammar: `parse_blocks()` collapsed everything after the divider (article-group, section-heading,
  related-categories, cta-banner) into one inert "freeform HTML" blob, which rendered as literal
  `<!-- wp:... -->` text on the frontend even though all blocks were registered (verified via
  `wp eval` + `render_block()` calls). Fixed by removing the self-closing slash so the divider's
  opening `<!-- wp:auclair/divider -->` pairs correctly with the closing comment. **Gotcha:** static
  blocks used in hand-written pattern PHP need paired open/close comments; only truly self-closing
  dynamic blocks (no saved markup) should use `/-->`.
- Content seeded for "Getting started" category (term_id 2) to match prototype layout:
  - Set `short_description` term meta (only on this term): "New to AuClair? Everything you need to
    set up and find your feet."
  - Kept existing two sample articles (Welcome/Reset password, IDs 9–10) untouched by title; assigned
    both `group: "Welcome to AuClair"`, `menu_order` 0–1.
  - Added 6 new `kb_article` posts: Creating your account, Taking the app tour (group "Welcome to
    AuClair", order 2–3); Setting up Sound Sense, Building your first playlist, Following artists
    and friends, Understanding Free (Radio) vs Premium (group "Your First Session", order 4–7) —
    titles match prototype exactly.
  - Ran `wp rewrite flush` for new taxonomy template permalinks.
- Verified in-browser at `http://auclair.local/help/getting-started/`: breadcrumb, icon-tile category
  header, divider, both article groups (correct titles/order/chevrons), "Related categories" heading +
  3 sibling cards each showing "1 article", gold CTA banner — all matching prototype. No PHP warnings
  in debug.log.

### Visual fidelity pass (pages 1–2, against `sites-template/html/*.html`)

The written spec docs (`sites-template/wordpress/*.md`) turned out to diverge from the actual
prototype in several places — the prototype (a self-unpacking bundled HTML export, opened via a
local `python3 -m http.server` since `file://` is blocked by the browser extension and the bundler
needs to run its own unpack JS) is the real source of truth. Corrections made by inspecting its
live computed styles/DOM (colors sampled via `getComputedStyle`, SVG path data relayed through a
small local HTTP receiver since the browser tool truncates long strings):

- **Accent color is gold (`#E9CA75`), not blue.** Renamed the `accent-blue`/`accent-blue-glow`
  palette slugs to `accent-gold`/`accent-gold-glow` everywhere (9 files) rather than leaving a
  misleading name on a repointed value. Added `accent-gold-light`/`accent-gold-dark` (logo/button
  gradient stops) and 8 `category-*` palette slugs (one per `help_category` term) to `theme.json`.
- **Real logo**, not a text lockup: the prototype's "AuClair" wordmark + "by AiSound" logotype are
  hand-drawn SVG paths (Figma export), not a font. Extracted the exact path data and rebuilt
  `logo-bar` as a **dynamic** block (`render.php`) — it was static before; switched so the ~4.7K-char
  path string only has to live in one place (PHP) instead of being hand-duplicated into every
  pattern file that uses it. Bar is centered (not space-between), logo stacked above "by AiSound".
- **`help-hero`**: added the `subheading` ("Search our guides, or browse by topic below."), fixed
  the corner glow (radial gold gradient bottom-left, not a centered blob), eyebrow pill restyled to
  match the real one (gold-on-gold-tint, weight 500, no uppercase — it was bold+uppercase+neutral).
- **Hero chip row vs. "Quick help" section are two different things** — the spec's `quick-help-chips`
  block description conflated them. The real prototype has: (a) inside the hero, a "Top Searches:"
  label + solid pill-badge chips with *no* dividers, and (b) a separate "Quick help" section
  *below* the hero using the same chevron-row list styling as `top-queries`. Restyled
  `quick-help-chips` to pill badges (was hairline-divided text), changed its default label to
  "Top Searches:", and reused `top-queries` (source `most-viewed`, manual curation later) for the
  new "Quick help" list section in `patterns/help-center-home.php`.
- **`category-card`**: was using the shared `render_icon_tile()` helper (bordered square + blur
  glow — the *icon-tile* look). The real cards use a plain solid-tint square (background =
  accent at ~9% opacity via `color-mix()`, no border, no blur) with the icon in solid accent
  `currentColor`. Gave it its own `.auclair-category-card__icon` markup/CSS instead. Chevron is
  visible on **desktop too**, not mobile-only as originally built — removed the `display: none`
  default. Fixed the "Creators & artists" icon (was `mic`, should be a person+star badge — added
  a `user-star` icon to both the PHP (`get_icon_svg()`) and JS (`icon-tile/icons.ts`) icon sets).
- **`cta-banner`**: icon is `question-circle`, not `life-buoy`; button is a **vertical gradient**
  (`accent-gold` → `accent-gold-dark`) with dark (`background`-color) text, not solid gold with
  white text; panel background is `rgba(4,6,8,0.5)` with a faint teal radial glow bottom-right
  (independent of the gold accent — a fixed decorative color, not term-driven); copy corrected to
  "Our support team is available 7 days a week..." / button label "Raise A Ticket".
- **`search-bar`**: background `rgba(241,240,237,0.1)`, radius `12px`, no border (was using the
  `surface` color + a visible border + `--radius--field`).
- Seeded real `icon`/`accent` term meta for all 8 `help_category` terms (was empty since creation —
  category cards were silently falling back to the default `life-buoy` icon this whole time).
- **Bug fixed:** the CTA banner disappeared entirely from the landing page after the rewrite —
  same bug class as the divider issue from page 2 (documented below): `cta-banner` is a **static**
  block with real saved markup, and it had been written into the pattern as self-closing
  (`<!-- wp:auclair/cta-banner /-->`). Fixed by pairing it with its actual saved HTML and a proper
  closing comment, same as the divider fix.

### SHARED FILE BUGFIX: `.auclair-ring-hover` animation overflow (pages 1–2)

**File:** `app/public/wp-content/themes/auclair-help-center/assets/css/components/shared-behaviours.css`

**Bug:** The `.auclair-ring-hover` shared behaviour (used by `category-card` and `cta-banner`) was visibly broken — hovering produced a giant diagonal line shooting far outside the element's bounds, instead of a thin ring hugging the rounded corners.

**Root cause:** the original implementation gave the `::after` pseudo-element the full size of the parent (`inset: -1px`) with a literal 2-sided `border` (top+left colored, other sides transparent) rotated -45° via `transform`. On a small element this roughly approximates a ring, but `category-card` (~200px) and `cta-banner` (~650px+) are far larger — rotating a two-sided border spanning the element's full width/height swings its long straight edges way outside the box, which is exactly the visible "huge diagonal line" artifact.

**The fix:** replaced the rotated-border technique with the standard CSS "gradient border" trick. The `::after` pseudo now uses `padding: 1.5px` + a `conic-gradient` background + `mask` with `mask-composite: exclude` (`-webkit-mask-composite: xor` for the prefixed fallback) — this traces a constant-width (1.5px) ring around the element's actual rounded-rect perimeter at any size, so it scales correctly regardless of element dimensions. The conic-gradient has one ~50° transparent gap (centered toward the bottom-right) matching blocks.md's "thin at both ends, gap at the bottom-right edge" description. The animation now animates a registered custom property (`@property --auclair-ring-angle`) that rotates the gradient's `from` angle — the pseudo-element's box itself never rotates, only the color sweep does, which keeps the ring glued to the perimeter through the whole animation.

**Second bug found in the same fix pass:** after the first fix, the ring worked on `category-card` but was completely invisible on `cta-banner`. Cause: `.auclair-cta-banner` has `overflow: hidden` (needed to clip internal glow blur), which was clipping away the ring pseudo-element's `-1.5px` outward inset before it could render. Fixed by changing the ring's `inset` from `-1.5px` to `0` (flush with the box's own edge rather than extending past it), so it never depends on being unclipped by a parent's `overflow: hidden`.

**Cleanup:** the file had a duplicate/redundant second `@media (prefers-reduced-motion: reduce)` block at the very end — merged into the single existing reduced-motion block earlier in the file; behavior unchanged, just no longer split across two blocks.

**Verification:** in-browser at `http://auclair.local/help/getting-started/`, hovering both the related-categories cards (category-card) and the CTA banner now shows a correct thin ring tracing the rounded corners with a small gap, no more overflow/diagonal-line artifact. Rebuilt via `npm run build` in the theme dir (Node 24.13.0 via nvm) — compiled cleanly, no PHP warnings in debug.log.

**Note for concurrent landing-page session:** This fix is in the *shared* CSS file, so the landing page's category-grid cards and cta-banner get this fix automatically. Re-verify that the landing page's hover animation looks correct now too — the bug affected both pages equally since they both use the same `auclair-ring-hover` class.

### SHARED FILES FOLLOW-UP BUGFIX: ring fully closes + button styling (pages 1–2)

**Files:** `app/public/wp-content/themes/auclair-help-center/assets/css/components/shared-behaviours.css`, `button.css`

**Context:** Direct side-by-side comparison of prototype (`sites-template/html/02-category.html` served via local HTTP) against live implementation revealed two additional mismatches in shared component styles.

**Fix 1 — `shared-behaviours.css`: ring now fully closes instead of stopping at a permanent gap.** Inspecting the prototype's hover animation frame-by-frame (hovering category cards and CTA banner, screenshotting at rest/mid-animation/settled), the ring draws progressively around the full perimeter and ends as a **complete closed loop with no gap** — not a partial ring with a permanent gap at one corner (which `blocks.md`'s description "thin at both ends, gap at the right/bottom edge" was interpreted as the final state, but turned out to be only a mid-animation transient frame). Changed technique: instead of animating a fixed-size colored-arc-with-gap conic-gradient around via rotation angle, now animates a single custom property `--auclair-ring-sweep` (registered via `@property`, syntax `<angle>`) from `0deg` to `360deg` — the conic-gradient is `conic-gradient(from 0deg, var(--accent) var(--auclair-ring-sweep), transparent var(--auclair-ring-sweep))`, so the sweep angle IS the accent-colored portion, growing from nothing to a full 360° ring. Renamed keyframes from `auclair-ring-rotate` to `auclair-ring-draw`. Reduced-motion fallback updated to set `--auclair-ring-sweep: 360deg` directly (instant full ring) rather than `opacity: 1` on the old gapped gradient.

**Fix 2 — `button.css`: `.auclair-button.is-primary` now has legible text and real hover feedback.** Primary button (used by CTA banner's "Raise a ticket", any future primary CTA) had `color: #fff` on the light gold `accent-gold` background — white text on gold had very low contrast and didn't match the prototype, which uses dark near-black text on that button. Changed to `color: var(--wp--preset--color--background)` (`#101820`, the theme's dark background token), which reads correctly against gold and matches the prototype. Hovering the button previously showed only an imperceptible `translateY(-1px)` with no color change — user noted "the raise ticket animation is missing." Comparing the prototype, hovering its button visibly darkens/mutes the gold. Added `background: var(--wp--preset--color--accent-gold-dark)` (existing token `#A69054`, previously unused) to the `:hover` rule alongside the existing lift, so there's now a real visible color-shift on hover matching the prototype.

**Verification:** rebuilt via `npm run build` (Node 24.13.0 via nvm), compiled cleanly. Tested in-browser at `http://auclair.local/help/getting-started/`: hovering related-categories cards and CTA banner shows ring drawing to a fully closed loop with no permanent gap; "Raise a ticket" button shows dark legible text plus visible darken-on-hover shift matching the prototype. No PHP warnings in debug.log (file doesn't exist — clean).

**Note for concurrent landing-page session:** Both files are *shared* components (not category-page-specific), so the landing page's category-grid cards and its own cta-banner get both fixes automatically. Re-verify the landing page's hover states now look correct too — the ring should fully close and the primary button should show proper contrast + hover feedback. Flag these changes clearly to avoid re-diagnosing the same issues independently.

### Visual fidelity bugfix pass 2 (pages 1–2, deep inspection)

User spotted three regressions on live pages during spot-check — investigated via headless Chrome (websocket-client Python package, no playwright installed) driving CDP over TCP, screenshotting both pages and inspecting computed DOM/styles directly on `http://auclair.local/help/` and `/help/getting-started/`. Fix verified by same method: screenshots + live `.focus()` calls and `getBoundingClientRect()` measurements at 1440px viewport.

**Issue 1: Hero and logo-bar not full-bleed** — `templates/page.html` and `templates/taxonomy-help_category.html` wrapped their content in `<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->` (main group declared `layout:{type:"constrained"}` in addition to `post-content` being constrained). This creates a double-nested constrained boundary: the main's own padding/centering + post-content's max-width = even constrained children get squeezed to 650px and centered at full viewport width. Stock WordPress block themes (twentytwentythree, twentytwentyfour) avoid this by only putting `layout:constrained` on an inner group (*not* main), so main's children can use `alignfull` to escape to the viewport edge. Fixed by removing `"layout":{"type":"constrained"}` from main (now `<!-- wp:group {"tagName":"main"} -->`), matching core themes' pattern. CDP verification: `.entry-content` measured 650px centered before fix, full viewport width after.

- Secondary issue: `patterns/help-center-home.php`'s logo-bar block invocation was missing `"align":"full"` in its comment markup (block.json supports it but it wasn't set), so even with the template fix the landing logo-bar wouldn't bleed. Added `"align":"full"`.
- Cleanup: `patterns/category-page.php`'s logo-bar invocation had stale hand-written fallback markup (old text wordmark + nonexistent `tagline` attr) left from before logo-bar was dynamic. Collapsed to clean `<!-- wp:auclair/logo-bar {"align":"full","homeUrl":"/help/"} /-->` matching help-center-home.php style (functionally harmless since dynamic blocks ignore saved markup at render, but misleading to read).
- Gotcha found: `templates/taxonomy-help_category.html` silently reverted to broken `layout:{type:"constrained"}` mid-iteration (not via DB override — confirmed `wp post list --post_type=wp_template` empty — likely filesystem sync artifact). Had to reapply fix a second time; worth monitoring this file if the bug ever "comes back" on its own.

**Issue 2: Category card icons had no glow** — compared live pages against `sites-template/html/01-landing.html` (Figma-bundled prototype, unpacked via local HTTP server). Extracted the real icon's styles: it's actually a *stack* of two elements — a blurred glow circle (100px diameter, category-accent at 15% opacity, 20px blur, centered behind) *and* the 46px icon-tile with a ~0.72px accent-tinted outline border (19% opacity) plus a 9%-opacity tint background. Current `blocks/category-card/render.php` + `style.css` had none of this (flat 44px square, no glow, no border). Note in that file claiming "no border, no blur" was incorrect/stale. Fixed by wrapping the icon in `.auclair-category-card__icon-wrap` (positioning context) with a sibling `.auclair-category-card__glow` (absolute inset-0, margin-auto, same centering technique as existing `icon-tile__glow`, but prototype-matched 100px/15%-opacity/20px-blur) painted before the icon in DOM (sits behind via z-order, no z-index needed). Bumped tile to 46px and added 1px accent outline.

**Issue 3: Search bar focus didn't match sitewide focus style** — site has shared `:focus-visible { outline: 2px solid accent-gold; outline-offset: 2px; }` in `assets/css/components/shared-behaviours.css` (documented in `blocks.md` as sitewide `focus-ring` behaviour). `blocks/search-bar/style.css` had `.auclair-search-bar__input { outline: none; }` (specificity 0,1,0), which won or lost depending on stylesheet concatenation order. First fix attempt added `outline: 2px solid` to `.auclair-search-bar` but this resulted in a double ring (one on pill, one browser default on input). Proper fix: scoped the suppression to `.auclair-search-bar__input:focus-visible { outline: none; }` (specificity 0,2,0, reliably wins regardless of source order) and added the same `outline: 2px solid var(--wp--preset--color--accent-gold); outline-offset: 2px;` to the existing `.auclair-search-bar:focus-within` rule (which previously only changed `border-color`). CDP verification: live `.focus()` on search input shows single clean ring, no double ring or missing ring.

**Verification workflow note:** Headless Chrome over CDP (websocket-client Python package) used since no playwright/puppeteer preinstalled. Technique: `import websocket`, connect to Chrome's debugger protocol endpoint, send `{"method": "Page.captureScreenshot", ...}` calls and decode base64 PNG results + DOM inspection via `Runtime.evaluate` to measure element bounds / computed styles. Reusable for future visual verification on this project without installing additional browser automation tooling.

**Files modified:** `templates/page.html`, `templates/taxonomy-help_category.html`, `patterns/help-center-home.php`, `patterns/category-page.php`, `blocks/category-card/render.php`, `blocks/category-card/style.css`, `blocks/search-bar/style.css`.

### Page 2 — Site Editor template editing bugfixes

**Context:** User reported multiple block errors when editing `taxonomy-help_category.html` template directly in WP Site Editor (`/wp-admin/site-editor.php?canvas=edit&p=%2Fwp_template%2Fauclair-help-center%2F%2Ftaxonomy-help_category`), specifically for `category-header` / `article-group` / `related-categories` blocks, and for `cta-banner`. All blocks were rendering correctly on the live front-end (`/help/getting-started/`) but errored or showed empty in the template editor. Diagnosed via Site Editor's own data store and live block validation; three distinct root causes and fixes below.

**Fix 1 — `category-header`, `article-group`, `related-categories` rendering as empty in Site Editor template.** Root cause: all three blocks use `is_tax( HelpCategory::NAME ) ? get_queried_object() : null` to derive their term/content. On a real taxonomy archive request this works fine — `is_tax()` returns true, queried term is set, blocks render real data. But when editing the *template itself* (not browsing an instance of it), there's no queried term, `is_tax()` is false, all three blocks hit their `$term = null; return;` branch and render nothing. Fixed by adding a fallback in all three `render.php` files (`blocks/category-header/render.php`, `blocks/article-group/render.php`, `blocks/related-categories/render.php`): when there's no `termId` attribute and no real queried taxonomy term, query a representative sample category via `get_terms()` ordered by the `order` term meta and use the first result. This mirrors how WordPress core dynamic blocks (e.g. `core/post-title` in a `single.html` template preview) show a real example instead of nothing, giving the template editor real visual feedback instead of an empty block. Required a `npm run build` in the theme dir to recompile blocks from the modified `render.php` sources into `dist/`.

**Fix 2 — Full-bleed layout regression on category page (already partially resolved earlier, documented for completeness).** `templates/taxonomy-help_category.html` had lost its layout constraint between earlier edits, causing the pattern reference to stretch full-width instead of remaining constrained to max-width+centered. Root cause: prior cleanup refactored `templates/page.html` to remove `layout:constrained` from the outer `main` group (matching core themes' convention that main itself stays bare, with inner groups carrying the constraint). The same refactor was supposed to apply to `taxonomy-help_category.html`, but implementation was incomplete — the outer `main` stayed bare but the inner `wp:pattern` reference had no layout wrapping. Fix: added an inner `wp:group {"layout":{"type":"constrained"}}` wrapper around the pattern reference specifically, since `wp:pattern` blocks themselves can't carry layout attributes the way `wp:post-content` can. Verified: template rendering is now constrained and centered as intended.

**Fix 3 — `auclair/cta-banner` "Block contains unexpected or invalid content" validation error in Site Editor.** This was NOT a rendering bug (the live front-end always looked correct) — it was a validation mismatch between the pattern's hand-written static HTML (`patterns/category-page.php`) and the block's actual compiled `save()` function output. Diagnosed by pulling `wp.blocks.getSaveContent()` for the live block instance from the Site Editor's `core/block-editor` store and byte-by-byte diffing against the pattern's stored HTML. Found four mismatches, all now fixed in `patterns/category-page.php`:
   - Collapsed nested divs: the markup had two `<div>` elements flattened into one (useBlockProps.save's wrapper div, and Panel component's `.auclair-cta-banner.auclair-ring-hover` div), but `getSaveContent()` renders them as two distinct nested divs. Fixed to match.
   - Stale icon: SVG was `life-buoy` (32px) but block uses `question-circle` (28px) as of an earlier session change. Updated to `question-circle`.
   - SVG tag format: hand-written markup used explicit closing tags (e.g. `<circle .../></circle>`) where React's static renderer self-closes them (e.g. `<circle .../>`). Updated all child elements to self-closing form to match.
   - Unsupported custom properties: pattern markup baked in six `--auclair-ring-*` custom properties (`--auclair-ring-from`, `-gap-in`, `-solid-start`, `-solid-end`, `-gap-out`, `-lift`) directly into the style attribute, but `auclair/cta-banner` block doesn't define any of these as real block attributes — `getSaveContent()` only ever emits `--auclair-ring-accent`, so anything else will always fail validation regardless of value. Removed these from the pattern's static markup; CTA banner now uses the shared default ring geometry from `shared-behaviours.css` (still animates correctly on hover, just with default angles instead of per-instance overrides).

**Important flag:** `patterns/help-center-home.php` (landing page) contains an identical `auclair/cta-banner` instance with the exact same four mismatches (collapsed-div structure, stale `life-buoy` icon, non-self-closing SVG tags, unsupported ring custom properties). It will show the same "unexpected or invalid content" validation warning in its own Site Editor template. The clean long-term fix is promoting the ring properties to real block attributes on `auclair/cta-banner` (optional strings, only emitted when set), which would fix both patterns' validation at once — **deliberately NOT done tonight** since that block/file is being actively worked on elsewhere; flagging for that owner instead.

**Verification:** Reloaded Site Editor template view for `taxonomy-help_category.html` post-fix — no "Block rendered as empty" or "unexpected or invalid content" errors anywhere. Front-end at `http://auclair.local/help/getting-started/` re-verified to still render and animate correctly (hover ring still works).

**Files modified:** `blocks/category-header/render.php`, `blocks/article-group/render.php`, `blocks/related-categories/render.php`, `templates/taxonomy-help_category.html`, `patterns/category-page.php`.

### 9. Page 3 — Article (`/help/{category}/{article}`)

**Four new blocks built** in `themes/auclair-help-center/blocks/`:
- `article-header` (D) — h1 title + intro meta field. Built dynamic since it needs `get_the_ID()`-scoped meta.
- `article-body` (D) — renders `steps` post meta as a plain list (no visible numbering) followed by `the_content()`. Built dynamic, not static as written spec suggested, since it must read per-post meta.
- `article-feedback` (D+I) — "Was this article helpful?" + Yes/No buttons with Interactivity API store; `castVote` action posts to new `auclair/v1/vote` REST endpoint. Renders already-voted state server-side via cookie (prevents flash on returning visitors). On vote: both buttons dim to `opacity 0.7` and disable; gold thank-you line appears below (buttons remain visible, not replaced). New icons `thumbs-up`/`thumbs-down` added to `template-tags.php` via separate `get_thumb_icon_svg()` function (20x20 viewBox, not the shared 24x24).
- `related-queries` (D) — self-contained block with its own heading (smaller typography, `clamp(17px, 2.2vw, 20px)` weight 700, vs. shared `section-heading`'s 24–28px). List style matches `article-group`'s bordered surface-card pattern (surface-color panel, 12px radius, divider rows via `gap:16px` flex, not border-bottom+padding). Data source: `related` post meta first, falls back to same-category articles excluding self, limit 4.

**New REST endpoint**: `AuclairCore\Rest\VoteEndpoint` (`mu-plugins/auclair-core/src/Rest/VoteEndpoint.php`) — `POST auclair/v1/vote` `{id, value: up|down}`, nonce-checked, blocks repeat votes via per-article cookie (`auclair_voted_{id}`, 1yr) + IP-keyed transient (`auclair_vote_ip_{id}_{ipHash}`, 30 days), updates `vote_up`/`vote_down`, recomputes `vote_score` (percentage), stamps `vote_last`. Auto-registered via `ModuleInitialization` scan.

**Pattern & template**: `patterns/article-page.php` (slug `auclair-help-center/article-page`) — logo-bar → breadcrumb (showBack:false) → article-header → article-body → article-feedback → related-queries → cta-banner. `templates/single-kb_article.html` mirrors `taxonomy-help_category.html`'s structure (main group without `layout:constrained` on main itself, matching page 2 fix).

**Prototype-fidelity findings** (extracted via Chrome DevTools on `sites-template/html/03-article.html`, served locally via `python3 -m http.server`):
- Steps list has **no visible numbering** despite being "numbered steps" in spec — just plain lines with 12px gap. Implemented as semantic `<ol>` with `list-style:none` (accessibility: screen readers announce ordinals) to match visual.
- Article title uses `font-size: clamp(28px, 5vw, 48px)` — shared `--wp--preset--font-size--display` token's `40px→48px` range is noticeably larger on mobile. Implemented literal clamp in `article-header/style.css` rather than touching `theme.json` (used by already-verified pages). **Flagged as known gotcha** — shared `display` token may be too large on mobile and could affect `category-header`'s h1; worth checking in future pass.
- "Related-query links scroll horizontally when overflows" does **not** match real prototype, which shows vertical list identical to `article-group`'s style. Implemented vertical list (not horizontal scroll).
- Feedback block: divider is `border-top` on wrapper (not separate `auclair/divider` block), `rgba(255,255,255,0.07)` ≈ existing border token; used token rather than near-duplicate value.

**CRITICAL BUGFIX — `viewScriptModule` file extension: affects `search-bar`, `quick-help-chips`, `article-feedback`.** WordPress's `register_block_type_from_metadata()` silently registers script modules with **empty `src`** when referenced file doesn't exist. `block.json` declarations of `"viewScriptModule": "file:./view.ts"` cause WP to look for `.../view.ts` (which doesn't exist in `dist/`; only compiled `.js` does), resulting in an empty URL — no warning, no error, Interactivity just never loads. This meant **search-bar's live suggestions and quick-help-chips' click-to-fill have likely never worked** despite visual/screenshot review (invisible in static screenshots; buttons look right but don't do anything). Root cause found while debugging new `article-feedback` block's vote button (same mistake). Fixed all three (`search-bar`, `quick-help-chips`, `article-feedback`) by changing to `"viewScriptModule": "file:./view.js"`, rebuilt, verified via `wp_script_modules()`'s registered handles (src now populated), live-tested: vote button posts to REST endpoint, search-bar's dropdown appears on type, quick-help-chips fill-on-click works. **`ticket-form/block.json` already correctly said `file:./view.js` and was unaffected.** Verification command for future Interactivity blocks: `wp eval` inspect `wp_script_modules()`'s private `registered` property checking for non-empty `src`.

**New subagent `.claude/agents/visual-fidelity-checker.md`** — reusable subagent to compare live pages against `sites-template/html/0N-*.html` prototypes and fix visual mismatches (padding, colors, glows, typography, hover states). Documents prototype-serving technique, Figma class-name-collision gotcha (`querySelector` can silently match wrong element across layers), and the `viewScriptModule` `.ts`-vs-`.js` gotcha above. Not usable this session (Claude Code only loads custom subagents at session start); will be available next session. Fidelity verification for page 3 done manually.

**Verification**: content seeded on existing post ID 21 ("Creating your account", Getting Started category) — `intro`, `steps` (5 items), `related` (IDs 25/27/29/31, matching prototype exactly), post_content matching prototype's body. Verified in-browser at `http://auclair.local/help/getting-started/creating-your-account/`: header, steps, body copy, feedback (up-vote and down-vote tested, thank-you+dimmed-buttons confirmed, cookie-based already-voted persists across reload), related-queries (hover confirmed), cta-banner. No PHP warnings. Desktop (>720px) layout for feedback row-vs-column switch could not be visually verified (fixed ~400px viewport throughout) — implemented by inference, worth follow-up check.

### Page 3 — Independent visual-fidelity-checker pass

**Independent fidelity-checker pass (page 3) found and fixed real bugs in the CTA banner** (`patterns/article-page.php` + shared `assets/css/components/icon-tile.css`):

1. **Wrong icon — was a life-buoy/gear shape, prototype's real icon (verified from raw bundle HTML, `data-layer="bubble-chat-question"`) is a chat-bubble-with-question-mark.** Fixed the inline SVG in `article-page.php`.

2. **Icon tile was rendering at the shared `.is-large` class's default 72px/24px-radius/surface-background instead of the prototype's actual 44px/12px-radius/background-color.** Fixed via a new scoped rule `.auclair-cta-banner .auclair-icon-tile.is-large` in `assets/css/components/icon-tile.css` (background, size, radius override) rather than changing the shared `.is-large` default, so `category-header`'s unrelated large-icon-tile usage is untouched.

3. **Missing hover-ring shape CSS custom properties (`--auclair-ring-from/-gap-in/-solid-start/-solid-end/-gap-out/-lift`) on `article-page.php`'s cta-banner** — `category-page.php` and `help-center-home.php` both set these explicitly; `article-page.php` was missing them and silently fell back to different ring-hover defaults, giving the article page's CTA a differently-shaped hover ring than the other two pages. Added the same explicit values for consistency.

4. **Button label was "Raise a ticket" (lowercase "a"), prototype's real button text is "Raise A Ticket" (capital A)** — `category-page.php`/`help-center-home.php` already had this right, `article-page.php` didn't. Fixed both the block's `buttonLabel` attribute and the anchor text.

**Shared-file impact — flag for whoever next touches pages 1/2:** the `icon-tile.css` fix is scoped by `.auclair-cta-banner`, so it also shrinks the CTA banner's icon tile on the already-"verified" landing page (`help-center-home.php`) and category page (`category-page.php`) from 72px down to the prototype-accurate 44px. This is a correctness fix, not a regression, but it changes how those two pages render — worth a quick re-look since their icon SVGs (28px/32px) were tuned to sit inside the old 72px tile.

**Two bugs found but deliberately NOT fixed (out of scope for this pass, flagged as follow-ups):**
- `category-page.php`'s cta-banner still has the same wrong life-buoy icon that was just fixed on the article page.
- `help-center-home.php`'s cta-banner icon was previously logged in PROGRESS.md as fixed to "question-circle" (a plain circle+question mark), but per direct extraction of the raw prototype markup it should actually be the same chat-bubble-with-tail shape (`bubble-chat-question`) fixed on page 3 — likely a minor misidentification during the original page-1 fidelity pass.

**Also verified (no changes needed):** breadcrumb third-level article title, article-header/article-body typography and spacing (literal `clamp()`/px matches against the prototype), feedback block divider/padding/button dimensions, related-queries list padding/radius/chevron color, and the full vote interaction (up vote, down vote, REST call, disabled+dimmed buttons, cookie persistence across reload). One typography discrepancy was investigated and deliberately left alone: the prototype's "Related queries" heading inline style says `font-weight: 900`, but the prototype's own loaded font faces are only 400/500/700 (confirmed via `document.fonts`), and `900` appears exactly once across all 5 bundled prototype pages — treated as an isolated export artifact, not real design intent, so the build's existing 700 was kept.

Rebuilt via `npm run build`, no new PHP warnings in debug.log. Test vote data/cookies cleaned up on post 21 afterward.

### 10. Page 4 — Raise a ticket (`/help/raise-a-ticket`)

**New block `auclair/ticket-form` (D+I)** at `themes/auclair-help-center/blocks/ticket-form/`:
- Files: `block.json`, `render.php`, `index.tsx` (ServerSideRender editor preview), `style.css`, `view.ts`.
- Features: custom category dropdown (8 `help_category` terms, filtered by `in_ticket_form` meta, ordered by `order` meta; supports `?category=` query-param pre-fill), Subject/Description/Email input fields, Attachment file picker (paperclip icon, native file input via JS, filename display), honeypot field, Submit button with disabled+spinner state.
- Styling extracted directly from prototype: field/select background `rgba(241,240,237,0.1)` radius 12px, dropdown list background `surface` (#1E262D) radius 12px shadow `0 16px 40px rgba(4,6,8,.55)` max-height 260px, card background `rgba(4,6,8,.5)` + gold radial glow bottom-right (`radial-gradient(45% 50% at 87% 94%, rgba(233,202,117,.2) 0%, transparent 100%)`) radius 16px padding 32px→16px at 720px, submit button gradient `accent-gold → accent-gold-dark` radius 8px, textarea min-height 96px no resize.

**New REST endpoint `POST auclair/v1/ticket`** at `mu-plugins/auclair-core/src/Rest/TicketEndpoint.php`:
- Nonce check (X-WP-Nonce/wp_rest), honeypot (fake-success if filled), per-IP rate limit (5/hour via transient), server-side validation mirroring client-side.
- File upload: `wp_handle_upload()` + `wp_insert_attachment()` for optional PNG/JPEG/WebP/PDF attachments, 5MB cap.
- Creates `support_ticket` post + assigns `help_category` term, default `ticket_status` "New" and `ticket_priority` "Normal", sets 7 meta fields from `post-types.md`.
- Sends admin + submitter acknowledgement emails, returns one-time token (`set_transient`, 5 min TTL) appended to redirect URL (`/help/ticket-submitted/?t=<token>`) for task 10 to consume.

**Pattern & template:** `patterns/raise-ticket-page.php` (logo-bar → breadcrumb showBack:false → heading+intro → ticket-form), `templates/page-raise-a-ticket.html` (720px constrained wrapper). Page created via `wp post create`, set as child of "Help Center" post for `/help/raise-a-ticket/` permalink.

**Bugs found and fixed:**
1. **10up-toolkit copies `render.php` into `dist/blocks/<name>/` at build time** — edits to source files under `blocks/` have no runtime effect until `npm run build` runs again; only built files in `dist/` are live. Significant debugging time initially (looked like opcache staleness).
2. **`viewScriptModule: "file:./view.ts"` silently fails to enqueue** — WP core's `register_block_script_module_id()` does `realpath($path . '/' . $module_path)` using the literal path string from block.json without rewriting `.ts`/`.tsx` to `.js`, so it looks for `.../view.ts` which doesn't exist in `dist/` (only compiled `view.js` does), producing an empty asset URL. No error thrown; script module registers but never loads. **Fixed for ticket-form by pointing block.json's `viewScriptModule` at `file:./view.js` directly.** This bug almost certainly affects `search-bar` and `quick-help-chips` too (both declare `viewScriptModule: "file:./view.ts"` identically), making their Interactivity behavior likely non-functional on the live site despite being marked verified — flagged as probable regression requiring confirmation and same one-line fix.
3. **`data-wp-each`/`<template>` causes hydration crash** — "Expected a DOM node of type 'li' but found 'template'... this is caused by the SSR'd HTML containing different DOM-nodes" thrown repeatedly in console, breaking hydration for the entire interactive region. Worked around in `ticket-form` by rendering 8 category `<li>` options directly in render.php (real markup, not client-only template), each carrying `data-wp-context` (categoryOptionId/categoryOptionLabel) merged with form context; view.ts reads that instead of a context.category each-loop. `search-bar`'s suggestions list and `quick-help-chips` use the same `<template data-wp-each>` pattern — likely never exercised due to bug 2 (their scripts never loaded), but will surface if bug 2 is fixed.
4. **Directives are not resolved server-side** — confirmed via raw HTML: `data-wp-bind--hidden`, `data-wp-text` etc. emitted verbatim, never resolved to real attributes/text. Matches `search-bar`'s existing convention; `ticket-form`'s render.php hand-bakes initial `hidden` on dropdown/error/spinner markup and literal initial text on category label/attachment placeholder to avoid flash-of-wrong-state before hydration.
5. **`help/{slug}` page routes collide with `help_category` taxonomy's `help/%slug%` rewrite** — `/help/raise-a-ticket/` 404'd because taxonomy rewrite rule matched first. Fixed with new module `mu-plugins/auclair-core/src/Rewrite/StaticPageRoutes.php` adding two explicit top-priority `add_rewrite_rule(..., 'top')` rules for `/help/raise-a-ticket/` and `/help/ticket-submitted/` (pre-added for task 10). Ran `wp rewrite flush`; verified `/help/getting-started/` (real category) still resolves after.

**End-to-end verification:** dropdown opens/closes (click + outside-click + Esc), category selection updates trigger label/closes list, client-side validation shows four field-level errors matching prototype, full submission created `support_ticket` post with correct meta/taxonomy (tested category: "Hearing test", status "New", priority "Normal") and redirected to `/help/ticket-submitted/?t=<token>`. Test ticket deleted post-verification. No PHP warnings in debug.log.

**Concurrency note:** Built while another session worked on pages 1–2 in the same repo. One collision: a placeholder stub in `blocks/ticket-form/style.css` written by the other session was overwritten with real implementation once main content already in progress — both sessions briefly scoped onto page 4, not a clean 1-vs-2/3-vs-4 split.

### Page 4 — Fidelity bugfix pass (Satoshi fonts + pattern style attrs)

**Files modified:** `app/public/wp-content/themes/auclair-help-center/assets/fonts/satoshi-500.woff2` (new), `satoshi-700.woff2` (new), `patterns/raise-ticket-page.php` (edited).

Investigated reported visual mismatch between live page 4 (`/help/raise-a-ticket/`) and prototype (`sites-template/html/04-raise-ticket.html`) by serving both locally and comparing side-by-side in browser. Found two bugs:

**Bug 1 — Missing self-hosted Satoshi font files (resolves long-standing gotcha).** `theme.json` referenced `assets/fonts/satoshi-{500,700}.woff2` but actual files were never added, so typography fell back to system-ui throughout the site. Downloaded real Satoshi woff2 files (weights 500 & 700) from Fontshare's free CDN (api.fontshare.com, the same source the prototype's bundled HTML loads from) and placed at exact paths `theme.json` expected: `app/public/wp-content/themes/auclair-help-center/assets/fonts/satoshi-{500,700}.woff2`. No build step needed; `theme.json`'s `file:` font-face URIs resolve at runtime. Verified via `wp eval` + `WP_Theme_JSON_Resolver::get_merged_data()` that compiled styles now contain valid `@font-face` rules with 200-status URLs, and `document.fonts` in-browser shows both weights `status: "loaded"`. Glyph shapes now visually match prototype's Satoshi (rounded dotted i, curved t terminal, single-story rounded a).

**Bug 2 — Hand-written pattern PHP declared block style attrs in JSON comment but never baked inline `style="..."` onto actual HTML tags.** In `patterns/raise-ticket-page.php`, h1 block comment declared `"style":{"typography":{"fontSize":"var(--wp--preset--font-size--display)","fontWeight":"700"}}` but literal `<h1 class="wp-block-heading">` tag had no `style` attribute — same for paragraph block's declared color/font-size. Root cause: WP core's static-block rendering outputs literal saved `innerHTML` verbatim without reconstructing inline styles from the attrs JSON (confirmed via `render_block()` + `wp_render_typography_support` hook — it only mutates existing `font-size:` for fluid-clamp, never inserts one from scratch). This is the same silent-drop bug class already documented for self-closing static blocks (divider, cta-banner). Effect: h1 rendered at browser-default ~32px instead of intended fluid 40→48px display preset, making heading noticeably smaller than prototype. Fix: added `style="font-size:var(--wp--preset--font-size--display);font-weight:700"` to h1 and `style="max-width:455px;font-size:16px;color:var(--wp--preset--color--foreground-primary)"` to paragraph, matching their declared JSON attrs exactly.

Verification: reloaded `/help/raise-a-ticket/` in Chrome post-fix, screenshotted top and bottom, compared directly against prototype — heading size/weight/font, paragraph copy, card layout, field styling, submit button gradient, and helper text all now match the prototype. No PHP warnings introduced.

**Gotcha for follow-up:** Any other hand-written pattern PHP files that declare a `style` JSON attr on a static core block should be audited for this same silent-drop bug — it won't throw errors/warnings, the style JSON just gets ignored, so it's easy to miss without live visual diff. Worth checking pages 1, 2, and eventually 3/5 before considering them fully fidelity-verified.

### Known gotchas / follow-ups

- **Admin password:** reset to `password` per explicit request — not a placeholder, this is the
  real current value.
- **`WP_DEVELOPMENT_MODE=theme`** is on in `wp-config.php` for this build session — worth
  reconsidering before anything resembling a "production" deploy (it disables theme.json/pattern/
  template caching, which you want off in dev but on in prod).
- ~~**Page 2 not yet re-verified against the prototype with the same rigor as page 1**~~ — Done
  in the visual fidelity bugfix pass 2; deep CDP inspection of `/help/getting-started/` revealed
  the three issues above and all were fixed + verified via CDP screenshots + live DOM inspection.
- **`category-header`** still uses the old `render_icon_tile()` helper (bordered-square + glow) —
  this is a *deliberate* difference from `category-card`'s new flat-tint icon, since the prototype's
  category page header icon does appear to keep the bordered/glow treatment at the larger size.
  Worth double-checking directly against `sites-template/html/02-category.html`'s computed styles
  rather than by eye.
- ~~**Probable regressions in `search-bar` and `quick-help-chips` blocks**~~ — Fixed in page 3 work (both blocks changed from `"viewScriptModule": "file:./view.ts"` to `"file:./view.js"`, verified working). **Note:** both still use `data-wp-each`/`<template>` pattern for rendering lists (same hydration issue as task 9), which could resurface if the blocks' behavior needs future extension — consider refactoring out as task 9 did for ticket-form.
- **Hand-written pattern PHP: style attr silent-drop.** Audit pages 1, 2, 3, 5 for the same bug fixed on page 4: static-block patterns that declare a `style` JSON attr must bake the full CSS into the HTML tag's `style` attribute (WP core doesn't reconstruct it from JSON). Won't throw errors, just silently render wrong. Flag before final fidelity sign-off on each page.
- **`patterns/help-center-home.php` (landing page) — `auclair/cta-banner` has matching validation mismatches.** Same four bugs as just fixed on `category-page.php`: collapsed-div structure, stale `life-buoy` icon (should be `question-circle`), non-self-closing SVG tags, and unsupported `--auclair-ring-*` custom properties baked into static markup. Long-term fix requires promoting ring properties to real block attributes on the block itself — flagged but not applied tonight since that block is in active development elsewhere.
- Page 5 hasn't had a prototype-fidelity pass yet — the same process (open
  `sites-template/html/05-ticket-submitted.html` via local server, extract real colors/assets, compare) should be
  applied before considering it done, not just built from the written spec docs.
- No commits made yet — repo is git-initialized but everything is still untracked/unstaged.

## Remaining tasks

- **11. Page 5 — Ticket submitted** (`/help/ticket-submitted`): `ticket-success` block;
  one-time-token/transient gate so direct hits redirect back to the ticket form.
