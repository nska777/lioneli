import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, region } = body;

    if (!firstName || !phone) {
      return NextResponse.json(
        { ok: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    const text = `
📞 *Заявка на звонок*
—————————————
👤 *Имя:* ${firstName} ${lastName ?? ""}
📱 *Телефон:* ${phone}
🌍 *Регион:* ${region}
🕒 *Время:* ${new Date().toLocaleString("ru-RU")}
    `.trim();

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("Telegram error:", err);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
