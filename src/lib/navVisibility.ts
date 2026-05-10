/**
 * Routes that exist and remain reachable by URL, but should NOT appear
 * in any navigation UI (navbar, sidebars, footers, etc.).
 *
 * Add or remove a path here — no other file needs to change.
 */
export const HIDDEN_NAV_ROUTES: ReadonlySet<string> = new Set([
  '/about/membership',
  '/resources/membership',
  '/membership',
])

/** True if `href` points to a route hidden from navigation. */
export function isHiddenNavRoute(href: string): boolean {
  const path = href.split('?')[0]?.split('#')[0] ?? ''
  if (HIDDEN_NAV_ROUTES.has(path)) return true
  for (const hidden of HIDDEN_NAV_ROUTES) {
    if (path.startsWith(hidden + '/')) return true
  }
  return false
}

/** Filter helper for any array of `{ href }`-shaped nav items. */
export function visibleNavItems<T extends { href: string }>(items: readonly T[]): T[] {
  return items.filter((item) => !isHiddenNavRoute(item.href))
}
