"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Ruler,
  Truck,
  Headphones,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

import CallModal from "@/app/components/modals/CallModal";
import { useRegionLang } from "@/app/context/region-lang";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type Step = {
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    title: "Материалы",
    desc: "Отбираем то, что стабильно ведёт себя в жизни: фактура, износостойкость, тактильность.",
    bullets: ["Шпон и массив", "Фурнитура премиум-класса", "Честные покрытия"],
    icon: <Ruler className="h-5 w-5" />,
  },
  {
    title: "Геометрия",
    desc: "Точные зазоры и пропорции. Премиальность читается в чистоте линий, а не в эффектности.",
    bullets: ["Точные стыки", "Стабильная сборка", "Продуманная эргономика"],
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Финиш",
    desc: "Кромки, тон, покрытие — там, где бренд видно сразу. Делаем аккуратно и спокойно.",
    bullets: ["Ровный тон", "Аккуратная кромка", "Защитные слои"],
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Контроль",
    desc: "Каждая позиция проходит внутреннюю проверку перед тем, как попасть к клиенту.",
    bullets: ["Комплектность", "Упаковка", "Финальный осмотр"],
    icon: <BadgeCheck className="h-5 w-5" />,
  },
];

export default function AboutClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // CTA modal
  const [callOpen, setCallOpen] = useState(false);

  // region
  const { region } = useRegionLang();

  const regionKey: "uz" | "ru" = region === "uz" ? "uz" : "ru";
  const regionLabel = regionKey === "uz" ? "Узбекистан" : "Россия";
  const phonePrefix = regionKey === "uz" ? "+998" : "+7";
  const [active, setActive] = useState(0);
  const prevActiveRef = useRef(0);

  // refs for animations
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const stepsWrapRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // ========= helpers: magnetic buttons =========
  const attachMagnetic = (btn: HTMLElement) => {
    const strength = 10; // мягко, premium
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.35,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  };

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // ---------- HERO intro ----------
      const hero = root.querySelector("[data-hero]");
      if (hero) {
        const kids = hero.querySelectorAll<HTMLElement>("[data-hero-item]");
        gsap.set(kids, { autoAlpha: 0, y: 18 });

        gsap.to(kids, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.05,
        });

        // параллакс фона (только transform)
        const orbs = hero.querySelectorAll<HTMLElement>("[data-orb]");
        if (orbs.length) {
          gsap.fromTo(
            orbs,
            { y: 10 },
            {
              y: -10,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        }

        // “дыхание” карточки справа
        const stage = hero.querySelector<HTMLElement>("[data-stage]");
        if (stage) {
          gsap.to(stage, {
            y: -6,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // лёгкий tilt по курсору (очень мягко)
          const onMove = (e: MouseEvent) => {
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(stage, {
              rotateX: py * -4,
              rotateY: px * 6,
              transformPerspective: 800,
              transformOrigin: "center",
              duration: 0.45,
              ease: "power3.out",
            });
          };
          const onLeave = () => {
            gsap.to(stage, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.7,
              ease: "power3.out",
            });
          };
          stage.addEventListener("mousemove", onMove);
          stage.addEventListener("mouseleave", onLeave);
        }

        // float мини-статов
        const stats = hero.querySelectorAll<HTMLElement>("[data-stat]");
        if (stats.length) {
          gsap.to(stats, {
            y: -4,
            duration: 2.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.15,
          });
        }
      }

      // ---------- reveal blocks ----------
      const blocks = root.querySelectorAll<HTMLElement>("[data-reveal]");
      blocks.forEach((el) => {
        const kids = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (kids.length) {
          gsap.set(kids, { autoAlpha: 0, y: 18, scale: 0.985 });
          gsap.to(kids, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          });
        } else {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 18, scale: 0.99 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            },
          );
        }
      });

      // ---------- steps active tracking ----------
      const stepEls = Array.from(
        root.querySelectorAll<HTMLElement>("[data-step]"),
      );

      stepEls.forEach((el) => {
        const i = Number(el.dataset.step || "0");
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      // progress line (fill height)
      if (stepsWrapRef.current && progressFillRef.current) {
        const wrap = stepsWrapRef.current;
        const fill = progressFillRef.current;

        ScrollTrigger.create({
          trigger: wrap,
          start: "top 70%",
          end: "bottom 55%",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress));
            gsap.to(fill, { scaleY: p, duration: 0.15, ease: "none" });
          },
        });

        gsap.set(fill, { transformOrigin: "top", scaleY: 0 });
      }

      // ---------- shine cards (mousemove) ----------
      const cards = root.querySelectorAll<HTMLElement>("[data-shinecard]");
      cards.forEach((card) => {
        const shine = card.querySelector<HTMLElement>("[data-shine]");
        if (!shine) return;

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(shine, {
            x: x * 22,
            y: y * 22,
            duration: 0.35,
            ease: "power3.out",
          });
        };

        const onLeave = () => {
          gsap.to(shine, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });

      // ---------- magnetic buttons ----------
      const mags = root.querySelectorAll<HTMLElement>("[data-magnetic]");
      const cleanups: Array<() => void> = [];
      mags.forEach((b) => cleanups.push(attachMagnetic(b)));

      // cleanup
      return () => cleanups.forEach((c) => c());
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // ========= Active card transition on change =========
  useEffect(() => {
    if (reduced) return;
    if (!activeCardRef.current) return;

    const prev = prevActiveRef.current;
    prevActiveRef.current = active;

    // если первый рендер — без дерганий
    if (prev === active) return;

    const card = activeCardRef.current;

    // micro “swap” animation (transform + opacity)
    gsap.killTweensOf(card);
    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 12, scale: 0.992 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      },
    );
  }, [active, reduced]);

  const s = STEPS[active];

  return (
    <>
      <div ref={rootRef} className="bg-white text-black">
        <main className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:pb-24">
          <nav className="pt-6 text-[12px] tracking-[0.18em] text-black/50">
            <Link className="hover:text-black/80" href="/">
              ГЛАВНАЯ
            </Link>
            <span className="px-2">/</span>
            <span className="text-black/80">О КОМПАНИИ</span>
          </nav>

          {/* HERO */}
          <section
            data-hero
            className={cn(
              "relative mt-6 overflow-hidden rounded-[30px] border border-black/10 bg-white",
              "shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div
                data-orb
                className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-black/[0.05]"
              />
              <div
                data-orb
                className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-black/[0.04]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-10%,rgba(0,0,0,0.07),transparent_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_55%)]" />
            </div>

            <div className="relative grid gap-10 p-7 md:grid-cols-12 md:p-12">
              <div className="md:col-span-7">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    data-hero-item
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] tracking-[0.22em] text-black/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black/35" />
                    LIONETO • PREMIUM FURNITURE
                  </div>

                  <div
                    data-hero-item
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] tracking-[0.22em] text-black/70"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Качество как система
                  </div>
                </div>

                <h1
                  data-hero-item
                  className="mt-5 text-balance text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[58px]"
                >
                  Спокойная премиальность
                  <span className="block text-[18px] font-medium tracking-[-0.01em] text-black/65 md:text-[20px]">
                    Когда качество читается в деталях, а не в шуме.
                  </span>
                </h1>

                <p
                  data-hero-item
                  className="mt-5 max-w-2xl text-pretty text-[14px] leading-7 text-black/70 md:text-[16px]"
                >
                  Мы создаём коллекции, которые выглядят современно и живут
                  долго: точная геометрия, честные материалы и продуманный
                  сервис.
                </p>

                <div data-hero-item className="mt-8 flex flex-wrap gap-3">
                  <Link
                    data-magnetic
                    href="/catalog"
                    className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90 active:scale-[0.99]"
                  >
                    Коллекции
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    data-magnetic
                    href="/contacts"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-black/80 transition hover:border-black/25 hover:text-black active:scale-[0.99]"
                  >
                    Контакты
                  </Link>
                </div>

                <div
                  data-hero-item
                  className="mt-7 grid grid-cols-2 gap-3 md:max-w-[520px] md:grid-cols-4"
                >
                  {[
                    { t: "2010+", s: "опыт" },
                    { t: "Премиум", s: "материалы" },
                    { t: "Контроль", s: "сборка" },
                    { t: "Сервис", s: "поддержка" },
                  ].map((m) => (
                    <div
                      key={m.t}
                      data-stat
                      className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3"
                    >
                      <div className="text-[14px] font-semibold tracking-[-0.01em]">
                        {m.t}
                      </div>
                      <div className="mt-0.5 text-[11px] tracking-[0.18em] text-black/50">
                        {m.s.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5">
                <div
                  data-stage
                  data-hero-item
                  data-shinecard
                  className="relative overflow-hidden rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.06)] will-change-transform"
                >
                  <div
                    data-shine
                    className="pointer-events-none absolute inset-0 opacity-60 will-change-transform"
                  >
                    <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-black/[0.05]" />
                    <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-black/[0.04]" />
                  </div>

                  <div className="relative">
                    <div className="text-[12px] tracking-[0.18em] text-black/50">
                      НАШ СТАНДАРТ
                    </div>

                    <div className="mt-2 text-[18px] font-semibold tracking-[-0.01em]">
                      Премиальное качество
                    </div>

                    <p className="mt-2 text-[13px] leading-6 text-black/65">
                      Материалы, геометрия, финиш — всё проходит внутреннюю
                      проверку.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {[
                        {
                          k: "Материалы",
                          v: "отбор",
                          i: <Ruler className="h-4 w-4" />,
                        },
                        {
                          k: "Сборка",
                          v: "контроль",
                          i: <ShieldCheck className="h-4 w-4" />,
                        },
                        {
                          k: "Доставка",
                          v: "бережно",
                          i: <Truck className="h-4 w-4" />,
                        },
                        {
                          k: "Сервис",
                          v: "поддержка",
                          i: <Headphones className="h-4 w-4" />,
                        },
                      ].map((it) => (
                        <div
                          key={it.k}
                          className="rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/20"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-[12px] tracking-[0.18em] text-black/45">
                              {it.k.toUpperCase()}
                            </div>
                            <div className="text-black/55">{it.i}</div>
                          </div>
                          <div className="mt-2 text-[14px] font-medium text-black/80">
                            {it.v}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[12px] text-black/65">
                      <span className="font-medium text-black/80">
                        Спокойная роскошь
                      </span>{" "}
                      — когда всё аккуратно вживую.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STEPS */}
          <section className="mt-12 md:mt-16">
            <div data-reveal>
              <div
                data-reveal-item
                className="text-[12px] tracking-[0.18em] text-black/50"
              >
                LIONETO • QUALITY SYSTEM
              </div>
              <h2
                data-reveal-item
                className="mt-2 text-[22px] font-semibold tracking-[-0.01em] md:text-[30px]"
              >
                Стандарт, который видно в деталях
              </h2>
              <p
                data-reveal-item
                className="mt-3 max-w-2xl text-[14px] leading-7 text-black/70"
              >
                Скролль вниз: слева этапы, справа — активный блок меняется по
                прокрутке. Это “вау” без тяжёлых эффектов.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-12">
              {/* LEFT */}
              <div className="md:col-span-5">
                <div className="md:sticky md:top-6">
                  <div className="relative">
                    {/* progress rail */}
                    <div className="pointer-events-none absolute left-2 top-2 hidden h-[calc(100%-16px)] w-[2px] rounded-full bg-black/10 md:block" />
                    <div
                      ref={progressFillRef}
                      className="pointer-events-none absolute left-2 top-2 hidden h-[calc(100%-16px)] w-[2px] rounded-full bg-black/30 md:block"
                    />

                    <div ref={stepsWrapRef} className="space-y-2 pl-0 md:pl-6">
                      {STEPS.map((x, i) => {
                        const isActive = i === active;
                        return (
                          <div
                            key={x.title}
                            data-step={i}
                            className={cn(
                              "group relative rounded-[22px] border p-4 transition will-change-transform",
                              isActive
                                ? "border-black/25 bg-black/[0.03]"
                                : "border-black/10 bg-white hover:border-black/20",
                            )}
                          >
                            {/* active accent dot */}
                            <div
                              className={cn(
                                "absolute -left-[18px] top-7 hidden h-3 w-3 rounded-full border md:block",
                                isActive
                                  ? "border-black/40 bg-black/30"
                                  : "border-black/15 bg-white",
                              )}
                            />

                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-[11px] tracking-[0.18em] text-black/45">
                                  ЭТАП {i + 1}
                                </div>
                                <div
                                  className={cn(
                                    "mt-1 text-[15px] font-semibold",
                                    isActive ? "text-black" : "text-black/85",
                                  )}
                                >
                                  {x.title}
                                </div>
                                <div className="mt-2 text-[13px] leading-6 text-black/65">
                                  {x.desc}
                                </div>
                              </div>

                              <div
                                className={cn(
                                  "grid h-10 w-10 place-items-center rounded-2xl border bg-white text-black/60 transition",
                                  isActive
                                    ? "border-black/20"
                                    : "border-black/10 group-hover:border-black/20",
                                )}
                              >
                                {x.icon}
                              </div>
                            </div>

                            {/* subtle hover lift */}
                            <div className="pointer-events-none absolute inset-0 rounded-[22px] opacity-0 transition group-hover:opacity-100">
                              <div className="absolute inset-0 rounded-[22px] shadow-[0_14px_40px_rgba(0,0,0,0.06)]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="md:col-span-7">
                <div
                  ref={activeCardRef}
                  data-reveal
                  className="relative overflow-hidden rounded-[30px] border border-black/10 bg-white p-7 shadow-[0_16px_50px_rgba(0,0,0,0.06)] will-change-transform"
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-black/[0.04]" />
                    <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-black/[0.03]" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[12px] tracking-[0.18em] text-black/50">
                        АКТИВНЫЙ ЭТАП
                      </div>
                      <div className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.18em] text-black/70">
                        {active + 1} / {STEPS.length}
                      </div>
                    </div>

                    <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.01em] md:text-[24px]">
                      {s.title}
                    </h3>

                    <p className="mt-3 text-[14px] leading-7 text-black/70">
                      {s.desc}
                    </p>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">
                      {s.bullets.map((b) => (
                        <div
                          key={b}
                          className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:border-black/20"
                        >
                          <div className="grid h-9 w-9 place-items-center rounded-2xl border border-black/10 bg-black/[0.03] text-black/60">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                          <div className="text-[13px] text-black/75">{b}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 text-[13px] text-black/70">
                      <span className="font-medium text-black/85">
                        Премиум — это системность.
                      </span>{" "}
                      Мы делаем стабильный результат, а не случайный “эффект”.
                    </div>

                    {/* tiny footer accent */}
                    <div className="mt-5 flex items-center justify-between gap-3 text-[12px] tracking-[0.18em] text-black/45">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-black/35" />
                        LIONETO STANDARD
                      </div>
                      <div className="flex items-center gap-2 text-black/50">
                        <Sparkles className="h-3.5 w-3.5" />
                        DETAIL-FIRST
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 md:mt-16">
            <div
              data-reveal
              className="rounded-[30px] border border-black/10 bg-black/[0.02] p-6 md:p-8"
            >
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="text-[12px] tracking-[0.18em] text-black/50">
                    НУЖНА КОНСУЛЬТАЦИЯ?
                  </div>
                  <div className="mt-2 text-[16px] font-semibold text-black/85 md:text-[18px]">
                    Подберём коллекцию и комплектацию под ваш интерьер
                  </div>
                  <div className="mt-1 text-[13px] text-black/65">
                    Напишите нам — ответим быстро.
                  </div>
                </div>

                <button
                  data-magnetic
                  type="button"
                  onClick={() => setCallOpen(true)}
                  className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90 active:scale-[0.99]"
                >
                  СВЯЗАТЬСЯ
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* MODAL */}
      <CallModal
        open={callOpen}
        onClose={() => setCallOpen(false)}
        onSubmit={(data) => {
          console.log("CALL MODAL SUBMIT:", data);
        }}
      />
    </>
  );
}
