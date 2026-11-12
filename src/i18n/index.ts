import es from './es.json';
import en from './en.json';

export type Locale = 'es' | 'en';
export type MessageKey = keyof typeof es;

type Catalog = typeof es;

const enCatalog: Catalog = en;

const catalogs: Record<Locale, Catalog> = {
  es,
  en: { ...es, ...enCatalog },
};

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en';
}

function localeFromPath(pathname: string): Locale | null {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  return null;
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'es';

  const fromQuery = new URLSearchParams(window.location.search).get('lang');
  if (isLocale(fromQuery)) return fromQuery;

  try {
    const fromParent = localeFromPath(window.parent.location.pathname);
    if (fromParent) return fromParent;
  } catch {
    // El iframe no puede leer la página padre.
  }

  return 'es';
}

export const locale: Locale = detectLocale();

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale;
}

export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const template = catalogs[locale][key] ?? catalogs.es[key];
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = vars[name];
    return value === undefined ? '' : String(value);
  });
}

export function localizeHref(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${window.location.origin}${path}`;
}
