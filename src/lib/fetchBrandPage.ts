export interface FetchedPage {
  url: string;
  content: string;
}

/**
 * Best-effort direct browser fetch of a brand's homepage. Most sites don't send permissive
 * CORS headers, so this will often throw — callers should catch and fall back to letting the
 * user paste page content/notes manually (see BUILD_PROMPT.md: "a reasonable prototype
 * fallback" — no scraping backend here by design).
 */
export async function fetchBrandPage(url: string): Promise<FetchedPage> {
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const response = await fetch(normalized, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }
  const content = await response.text();
  return { url: normalized, content };
}
