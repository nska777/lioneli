import { NextResponse } from "next/server";

// 1) Отправка писем (Resend) — самый простой вариант
import { Resend } from "resend";

// 2) (Опционально) запись в Strapi
async function saveToStrapi(email: string) {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

  if (!STRAPI_URL || !STRAPI_TOKEN) return; // если не настроено — просто пропускаем

  // ⚠️ Нужно создать коллекцию в Strapi: subscribers { email: string, confirmed: boolean }
  await fetch(`${STRAPI_URL}/api/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify({
      data: { email, confirmed: false },
    }),
    // важно: без кеша
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

    // 1) сохраняем (если Strapi настроен)
    await saveToStrapi(v);

    // 2) отправляем письмо (если настроен Resend)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.NEWSLETTER_FROM; // типа "Lioneto <noreply@yourdomain.com>"
    const TO_ADMIN = process.env.NEWSLETTER_ADMIN_EMAIL; // чтобы тебе прилетало уведомление (опционально)

    if (RESEND_API_KEY && FROM_EMAIL) {
      const resend = new Resend(RESEND_API_KEY);

      // письмо пользователю (подтверждение)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: v,
        subject: "Вы подписались на новости Lioneto",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2 style="margin:0 0 12px">Спасибо за подписку!</h2>
            <p style="margin:0 0 10px">Вы будете получать новости, акции и поступления от Lioneto.</p>
            <p style="margin:0;color:#666;font-size:13px">Если это были не вы — просто игнорируйте это письмо.</p>
          </div>
        `,
      });

      // уведомление админу (опционально)
      if (TO_ADMIN) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_ADMIN,
          subject: "Новая подписка на новости",
          html: `<div style="font-family:Arial,sans-serif">Новый подписчик: <b>${v}</b></div>`,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Серверная ошибка." },
      { status: 500 }
    );
  }
}
