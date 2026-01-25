// app/lib/strapi.ts
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// универсальный fetch с no-store, чтобы изменения из CMS виделись сразу
async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText} ${txt}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Global single type
 * Важно: populate обязателен, иначе компоненты/медиа/релэйшены не придут.
 */
export async function getGlobal() {
  // ✅ самый простой и рабочий вариант в Strapi v4 — populate=*
  // (deep — НЕ поддерживается, поэтому у тебя был Invalid key deep)
  const json = await strapiFetch<any>(`/api/global?populate=*`);

  // в Strapi ответ обычно: { data: { id, attributes... } } либо { data: {...} }
  // у тебя сейчас судя по скрину: { data: { ...поля... }, meta: {} }
  return json?.data ?? null;
}
