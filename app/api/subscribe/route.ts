import { NextResponse } from "next/server";

// ds 1) (Опционально) запись в Strapi
async function saveToStrapi(email: string) {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) return; // если не настроено — просто пропускаем

  // Нужно создать коллекцию в Strapi: subscribers { email: string, confirmed: boolean }
  await fetch(`${STRAPI_URL}/api/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: { email, confirmed: false },
    }),
    cache: "no-store",
  });
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const v = (email || "").trim().toLowerCase();

    if (!isEmail(v)) {
      return NextResponse.json(
        { ok: false, message: "Некорректный email." },
        { status: 400 }
      );
    }

    // сохраняем (если Strapi настроен)
    await saveToStrapi(v);

    // Resend удалён (не нужен для проекта/билда)

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Серверная ошибка." },
      { status: 500 }
    );
  }
}
