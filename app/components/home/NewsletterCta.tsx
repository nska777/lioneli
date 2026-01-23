"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v.trim());
}

export default function NewsletterCta({
  backgroundUrl = "/images/home/newsletter-bg.jpg", // положи картинку в public
  title = "БУДЬТЕ В КУРСЕ",
  subtitle = "Узнайте первыми о наших новых акциях и распродажах",
}: {
  backgroundUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [msg, setMsg] = useState<string>("");

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      const el = q('[data-nl="wrap"]');

      gsap.set(el, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: rootRef.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const v = email.trim();
    if (!isEmail(v)) {
      setStatus("error");
      setMsg("Введите корректный email.");
      return;
    }

    try {
      setStatus("loading");
      setMsg("");

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMsg(data.message || "Не удалось подписаться. Попробуйте позже.");
        return;
      }

      setStatus("success");
      setMsg("Готово! Проверьте почту — мы отправили подтверждение.");
      setEmail("");
    } catch {
      setStatus("error");
      setMsg("Сеть недоступна. Попробуйте ещё раз.");
    }
  }

  return (
    <section ref={rootRef} className="mx-auto w-full max-w-[1200px] px-4 py-14">
      <div
        data-nl="wrap"
        className="relative overflow-hidden rounded-2xl border border-black/10"
      >
        {/* background image */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />

        {/* overlay (лёгкий, без blur) */}
        <div className="absolute inset-0 bg-black/35" />

        {/* content */}
        <div className="relative px-5 py-10 text-center text-white md:px-10 md:py-14">
          <h3 className="text-[22px] font-semibold tracking-[0.14em] md:text-[28px]">
            {title}
          </h3>
          <p className="mt-2 text-[14px] text-white/85 md:text-[15px]">
            {subtitle}
          </p>

          <form
            onSubmit={onSubmit}
            className="mx-auto mt-6 flex w-full max-w-[520px] flex-col gap-3 sm:flex-row sm:gap-2"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Электронная почта"
              className={cn(
                "h-11 w-full rounded-none border border-white/60 bg-white/10 px-4 text-[14px] text-white outline-none",
                "placeholder:text-white/70",
                "transition",
                status === "error" && "border-red-300",
              )}
              autoComplete="email"
              inputMode="email"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "h-11 shrink-0 cursor-pointer rounded-none border border-[#c9a567] bg-[#c9a567] px-7 text-[13px] font-semibold tracking-[0.14em] text-white",
                "transition-transform will-change-transform",
                "active:scale-[0.99]",
                status === "loading" && "opacity-70",
              )}
            >
              {status === "loading" ? "..." : "ПОДПИСАТЬСЯ"}
            </button>
          </form>

          {msg ? (
            <div
              className={cn(
                "mx-auto mt-3 max-w-[520px] text-[13px]",
                status === "success" ? "text-white/90" : "text-white/90",
              )}
            >
              {msg}
            </div>
          ) : null}

          <div className="mx-auto mt-3 max-w-[720px] text-[12px] text-white/70">
            Нажимая «Подписаться», вы соглашаетесь получать письма от Lioneto.
            Отписка — в 1 клик.
          </div>
        </div>
      </div>
    </section>
  );
}
