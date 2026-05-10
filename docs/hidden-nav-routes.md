# Hidden Navigation Routes

A small policy for hiding routes from navigation **without** removing the
underlying pages, content, or URLs.

## Why

Some routes (currently `/about/membership`, `/resources/membership`,
`/membership`) must remain reachable by direct URL but should not appear in
any UI surface (navbar dropdowns, sidebars, future footers, sitemaps, etc.).

Sprinkling per-route `if`s across every render site doesn't scale.

## How it works

A single source of truth lives in `src/lib/navVisibility.ts`:

```ts
export const HIDDEN_NAV_ROUTES: ReadonlySet<string> = new Set([
  '/about/membership',
  '/resources/membership',
  '/membership',
])
```

It exposes two helpers:

- `isHiddenNavRoute(href)` — true when `href` matches a hidden route or a
  sub-path of one (e.g. `/membership/join`). Strips query/hash before matching.
- `visibleNavItems(items)` — generic filter for any array of
  `{ href: string }`-shaped nav items.

## Where it's applied

The policy is applied **once** to the nav data, not inside JSX loops:

- `src/components/Navigation/index.tsx` — derives `mainMenu` from
  `rawMainMenu` by dropping hidden top-level links and filtering each
  dropdown's `items` through `visibleNavItems(...)`.
- `src/app/about/layout.tsx` — wraps the sidebar `links` array in
  `visibleNavItems([...])`.

Any future nav surface (footer, sitemap, mobile drawer, etc.) should do the
same: build the array, then pass it through `visibleNavItems`.

## Adding / removing a hidden route

Edit `HIDDEN_NAV_ROUTES` in `src/lib/navVisibility.ts`. No other file needs
to change.

## What this does NOT do

- It does **not** delete pages, routes, or i18n strings.
- It does **not** block direct navigation to the URL — the page still
  renders if a user types or links to it.
- It does **not** remove the route from `sitemap.xml` or robots — handle
  those separately if SEO suppression is also desired.

If you ever want hidden routes fully unreachable, the same set can be reused
from Routing Middleware (`src/proxy.ts`) to 404 or redirect them — keeping
one source of truth.
