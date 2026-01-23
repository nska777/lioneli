// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import GSAPHeroSlider from "../components/home/GSAPHeroSlider";

export const metadata: Metadata = {
  title: "О компании — Lioneto",
  description:
    "Lioneto — премиальный мебельный бренд. Узнайте о нашем подходе, ценностях и стандартах качества.",
  openGraph: {
    title: "О компании — Lioneto",
    description:
      "Lioneto — премиальный мебельный бренд. Подход, ценности и стандарты качества.",
    type: "website",
    locale: "ru_RU",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function AboutPage() {
  return (
    <>
      {/* GSAP (минимально и без конфликтов): грузим на клиенте через Script */}
      <Script
        src="https://unpkg.com/gsap@3.12.5/dist/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://unpkg.com/gsap@3.12.5/dist/ScrollTrigger.min.js"
        strategy="afterInteractive"
      />

      <main className="bg-white text-black">
        <GSAPHeroSlider />
        <div className="mx-auto w-full max-w-[1200px] px-4">
          {/* Breadcrumbs */}

          <nav className="pt-6 text-[12px] tracking-[0.18em] text-black/50">
            <Link className="hover:text-black/80" href="/">
              ГЛАВНАЯ
            </Link>
            <span className="px-2">/</span>
            <span className="text-black/80">О КОМПАНИИ</span>
          </nav>
          {/* HERO */}
          <section className="relative mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white">
            {/* мягкий премиальный фон */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/[0.04] blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-black/[0.05] blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-20%,rgba(0,0,0,0.05),transparent_65%)]" />
            </div>

            <div className="relative grid gap-10 p-8 md:grid-cols-12 md:p-12">
              <div className="md:col-span-7">
                <div
                  data-anim="fadeUp"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.22em] text-black/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  LIONETO • PREMIUM FURNITURE
                </div>

                <h1
                  data-anim="fadeUp"
                  className="mt-5 text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] md:text-[52px]"
                >
                  О компании Lioneto
                </h1>

                <p
                  data-anim="fadeUp"
                  className="mt-5 max-w-2xl text-pretty text-[15px] leading-7 text-black/70 md:text-[16px]"
                >
                  Мы создаём мебель и интерьерные решения в премиальной эстетике
                  — с вниманием к деталям, качеству материалов и ощущениям в
                  повседневной жизни. Наша философия — спокойная роскошь и
                  безупречная функциональность.
                </p>

                <div data-anim="fadeUp" className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/catalog"
                    className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90"
                  >
                    Коллекции
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/contacts"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-black/80 transition hover:border-black/25 hover:text-black"
                  >
                    КОНТАКТЫ
                  </Link>
                </div>
              </div>

              {/* Правая “витрина” */}
              <div className="md:col-span-5">
                <div
                  data-anim="scaleIn"
                  className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[12px] tracking-[0.18em] text-black/50">
                        НАШ СТАНДАРТ
                      </div>
                      <div className="mt-2 text-[18px] font-semibold tracking-[-0.01em]">
                        Премиальное качество
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-black/65">
                        Материалы, геометрия, финиш — всё проходит внутреннюю
                        проверку перед тем, как попасть к клиенту.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-3 py-2 text-[12px] font-medium text-black/70">
                      2010+
                      <div className="text-[10px] font-normal tracking-[0.18em] text-black/45">
                        опыт
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { k: "Материалы", v: "отбор" },
                      { k: "Сборка", v: "контроль" },
                      { k: "Доставка", v: "бережно" },
                      { k: "Сервис", v: "поддержка" },
                    ].map((it) => (
                      <div
                        key={it.k}
                        className="rounded-2xl border border-black/10 bg-white p-4"
                      >
                        <div className="text-[12px] tracking-[0.18em] text-black/45">
                          {it.k.toUpperCase()}
                        </div>
                        <div className="mt-2 text-[14px] font-medium text-black/80">
                          {it.v}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-black/[0.04] blur-3xl" />
                </div>
              </div>
            </div>
          </section>
          {/* ТЕКСТ О КОМПАНИИ */}
          <section className="mt-12 md:mt-16">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2
                  data-anim="fadeUp"
                  className="text-[22px] font-semibold tracking-[-0.01em] md:text-[28px]"
                >
                  Мы создаём интерьер, который живёт долго
                </h2>
                <p
                  data-anim="fadeUp"
                  className="mt-4 text-[14px] leading-7 text-black/70"
                >
                  Lioneto — это сочетание эстетики, точности и практичности.
                  Важны не только формы, но и тактильность, стыки, фурнитура,
                  баланс цвета и фактуры.
                </p>
                <p
                  data-anim="fadeUp"
                  className="mt-4 text-[14px] leading-7 text-black/70"
                >
                  Мы проектируем коллекции так, чтобы они были актуальны годами:
                  спокойные пропорции, чистые линии, материалы с надёжной
                  репутацией.
                </p>
              </div>

              <div className="md:col-span-7">
                <div className="grid gap-4">
                  {[
                    {
                      title: "Дизайн",
                      text: "Сдержанная премиальность: чистые формы, точная типографика, баланс деталей.",
                    },
                    {
                      title: "Качество",
                      text: "Контроль на каждом этапе: материалы, сборка, упаковка и финальная проверка.",
                    },
                    {
                      title: "Сервис",
                      text: "Поддержка до и после покупки: консультация, доставка, забота о клиенте.",
                    },
                  ].map((card) => (
                    <article
                      key={card.title}
                      data-anim="fadeUp"
                      className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[12px] tracking-[0.18em] text-black/45">
                            {card.title.toUpperCase()}
                          </div>
                          <div className="mt-2 text-[16px] font-semibold text-black/85">
                            {card.title}
                          </div>
                          <p className="mt-2 text-[14px] leading-7 text-black/70">
                            {card.text}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-2xl border border-black/10 bg-black/[0.03]" />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* ЦЕННОСТИ / ПОДХОД */}
          <section className="mt-12 md:mt-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2
                  data-anim="fadeUp"
                  className="text-[22px] font-semibold tracking-[-0.01em] md:text-[28px]"
                >
                  Ценности и подход
                </h2>
                <p
                  data-anim="fadeUp"
                  className="mt-3 max-w-2xl text-[14px] leading-7 text-black/70"
                >
                  Наша цель — чтобы каждый элемент выглядел дорого и ощущался
                  спокойно. Без шума. Без лишнего.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Точность",
                  d: "Мы внимательны к мелочам: от стыков до геометрии и финиша поверхностей.",
                },
                {
                  t: "Честные материалы",
                  d: "Только то, что работает в реальности: практичность, стойкость, комфорт.",
                },
                {
                  t: "Премиальный ритм",
                  d: "Актуальный дизайн без перегруза — чтобы интерьер не уставал со временем.",
                },
              ].map((it) => (
                <div
                  key={it.t}
                  data-anim="fadeUp"
                  className={cn(
                    "rounded-3xl border border-black/10 bg-white p-6",
                    "transition hover:border-black/20",
                  )}
                >
                  <div className="text-[12px] tracking-[0.18em] text-black/45">
                    {it.t.toUpperCase()}
                  </div>
                  <div className="mt-2 text-[16px] font-semibold text-black/85">
                    {it.t}
                  </div>
                  <p className="mt-2 text-[14px] leading-7 text-black/70">
                    {it.d}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              data-anim="fadeUp"
              className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:flex-row md:items-center"
            >
              <div>
                <div className="text-[12px] tracking-[0.18em] text-black/50">
                  НУЖНА КОНСУЛЬТАЦИЯ?
                </div>
                <div className="mt-2 text-[16px] font-semibold text-black/85">
                  Поможем выбрать коллекцию и комплектацию
                </div>
                <div className="mt-1 text-[13px] text-black/65">
                  Напишите нам или оставьте заявку — ответим быстро.
                </div>
              </div>

              <Link
                href="/contacts"
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90"
              >
                СВЯЗАТЬСЯ
                <span className="ml-2">→</span>
              </Link>
            </div>
          </section>
          {/* нижний отступ до футера (футер у тебя в layout) */}
          <div className="h-16 md:h-24" />
        </div>
      </main>

      {/* Инициализация анимаций (минимально): fadeUp + scaleIn, без pin/скролл-локов */}
      <Script id="about-gsap-init" strategy="afterInteractive">
        {`
(() => {
  const w = window;
  const gsap = w.gsap;
  const ScrollTrigger = w.ScrollTrigger;

  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // Чуть "Apple-style": мягкий fade+lift, без резких эффектов
  const els = document.querySelectorAll('[data-anim]');
  els.forEach((el) => {
    const type = el.getAttribute('data-anim');

    if (type === 'scaleIn') {
      gsap.fromTo(el,
        { autoAlpha: 0, scale: 0.98, y: 10, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
      return;
    }

    // fadeUp (по умолчанию)
    gsap.fromTo(el,
      { autoAlpha: 0, y: 16, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true
        }
      }
    );
  });

  // Уважение к prefers-reduced-motion
  const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (m && m.matches) {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.globalTimeline.clear();
    document.querySelectorAll('[data-anim]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
  }
})();
        `}
      </Script>
    </>
  );
}
