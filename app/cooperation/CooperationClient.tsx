"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building2,
  BriefcaseBusiness,
  Handshake,
  Palette,
  Send,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type Track = "designer" | "dealer" | "developer" | "b2b";

type TrackCard = {
  id: Track;
  label: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ReactNode;
};

const TRACKS: TrackCard[] = [
  {
    id: "designer",
    label: "ДЛЯ ДИЗАЙНЕРОВ",
    title: "Партнёрская программа",
    desc: "Комплектация проектов, быстрые расчёты, аккуратная коммуникация и поддержка.",
    bullets: [
      "Персональный менеджер",
      "Подбор решений под интерьер",
      "КП и спецификация за 1–2 дня",
      "Приоритетная логистика",
    ],
    icon: <Palette className="h-5 w-5 text-black/70" />,
  },
  {
    id: "dealer",
    label: "ДЛЯ ДИЛЕРОВ",
    title: "Дистрибуция и поставки",
    desc: "Регулярные поставки, стандарты экспозиции, материалы для продаж и обучение.",
    bullets: [
      "Оптовые условия и матрица",
      "Рекомендации по экспозиции",
      "Маркетинг-материалы",
      "Обучение команды",
    ],
    icon: <Handshake className="h-5 w-5 text-black/70" />,
  },
  {
    id: "developer",
    label: "ДЛЯ ЗАСТРОЙЩИКОВ",
    title: "Комплектация объектов",
    desc: "Квартиры, апарт-отели, шоурумы: типовые пакеты и индивидуальная доработка.",
    bullets: [
      "Смета и спецификация",
      "План-график поставок",
      "Единый стиль по объекту",
      "Сервис и гарантия",
    ],
    icon: <Building2 className="h-5 w-5 text-black/70" />,
  },
  {
    id: "b2b",
    label: "B2B / HORECA",
    title: "Корпоративные заказы",
    desc: "Отели, рестораны, офисы: устойчивые материалы и понятные условия сотрудничества.",
    bullets: [
      "Оптовые условия",
      "Материалы под нагрузку",
      "Сопровождение проекта",
      "Контроль качества",
    ],
    icon: <BriefcaseBusiness className="h-5 w-5 text-black/70" />,
  },
];

function Pill({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.16em] transition",
        active
          ? "border-black/20 bg-black text-white"
          : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black",
      )}
    >
      {label}
    </button>
  );
}

function StatCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "rounded-3xl border border-black/10 bg-white p-6",
        "transition hover:border-black/20",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[12px] tracking-[0.18em] text-black/45">
            {title.toUpperCase()}
          </div>
          <div className="mt-2 text-[14px] leading-6 text-black/70">{desc}</div>
        </div>
        <div className="h-11 w-11 rounded-2xl border border-black/10 bg-black/[0.03] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

function TrackCardUI({
  t,
  active,
  onClick,
}: {
  t: TrackCard;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-reveal
      className={cn(
        "cursor-pointer text-left rounded-3xl border p-6 transition relative overflow-hidden",
        active
          ? "border-black/25 bg-black/[0.02]"
          : "border-black/10 bg-white hover:border-black/20",
      )}
    >
      {/* мягкий premium glow */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          active ? "opacity-100" : "group-hover:opacity-100",
        )}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-black/[0.04] blur-3xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[12px] tracking-[0.18em] text-black/45">
            {t.label}
          </div>
          <div className="mt-2 text-[16px] font-semibold tracking-[-0.01em] text-black/85 md:text-[18px]">
            {t.title}
          </div>
          <p className="mt-2 text-[14px] leading-7 text-black/70">{t.desc}</p>
        </div>

        <div
          className={cn(
            "h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0",
            active
              ? "border-black/20 bg-white"
              : "border-black/10 bg-black/[0.02]",
          )}
        >
          {t.icon}
        </div>
      </div>

      {/* bullets — только у активного, чтобы не перегружать */}
      {active && (
        <div data-detail className="mt-5 grid gap-2">
          {t.bullets.map((b) => (
            <div
              key={b}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-[13px] text-black/70 flex items-start gap-2"
            >
              <Check className="mt-0.5 h-4 w-4 text-black/50" />
              <span className="leading-6">{b}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

function StepCard({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "rounded-3xl border border-black/10 bg-white p-6",
        "transition hover:border-black/20",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-3 py-2 text-[12px] font-medium text-black/70">
          {n}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold tracking-[-0.01em] text-black/85">
            {title}
          </div>
          <p className="mt-2 text-[14px] leading-7 text-black/70">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function CooperationClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<Track>("designer");

  const activeTrack = useMemo(
    () => TRACKS.find((t) => t.id === active) ?? TRACKS[0],
    [active],
  );

  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      // reveal blocks
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      // detail animation when active changes
      gsap.fromTo(
        "[data-detail]",
        { autoAlpha: 0, y: 10, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={rootRef} className="space-y-10 md:space-y-14">
      {/* HERO / offer */}
      <section
        data-reveal
        className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/[0.04] blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-black/[0.05] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-20%,rgba(0,0,0,0.06),transparent_60%)]" />
        </div>

        <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] tracking-[0.22em] text-black/70">
              <Sparkles className="h-3.5 w-3.5 text-black/45" />
              LIONETO • PARTNERSHIP
            </div>

            <h2 className="mt-4 text-balance text-[20px] font-semibold tracking-[-0.01em] md:text-[32px]">
              Партнёрство, которое ощущается спокойно и выгодно
            </h2>

            <p className="mt-3 max-w-3xl text-[14px] leading-7 text-black/70 md:text-[16px]">
              Мы берём на себя расчёты, спецификации и сопровождение — чтобы вы
              сосредоточились на проекте и клиенте. Всё прозрачно, быстро и без
              «шума».
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill
                active={active === "designer"}
                label="ДИЗАЙНЕРАМ"
                onClick={() => setActive("designer")}
              />
              <Pill
                active={active === "dealer"}
                label="ДИЛЕРАМ"
                onClick={() => setActive("dealer")}
              />
              <Pill
                active={active === "developer"}
                label="ЗАСТРОЙЩИКАМ"
                onClick={() => setActive("developer")}
              />
              <Pill
                active={active === "b2b"}
                label="B2B / HORECA"
                onClick={() => setActive("b2b")}
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="text-[12px] tracking-[0.18em] text-black/45">
                ОТВЕТ И КП
              </div>
              <div className="mt-2 text-[18px] font-semibold text-black/85">
                1–2 рабочих дня
              </div>
              <p className="mt-2 text-[13px] leading-6 text-black/65">
                Получите консультацию, спецификацию и первичное коммерческое
                предложение по вашему запросу.
              </p>

              <div className="mt-4 grid gap-2">
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[13px] text-black/70 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-black/45" />
                  Быстрая коммуникация
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[13px] text-black/70 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-black/45" />
                  Контроль качества
                </div>
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-[13px] text-black/70 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-black/45" />
                  Логистика и сопровождение
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks — карточки направлений */}
      <section>
        <div data-reveal className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[12px] tracking-[0.18em] text-black/45">
              ФОРМАТЫ СОТРУДНИЧЕСТВА
            </div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              Выберите направление — увидите выгоды
            </h3>
            <p className="mt-2 max-w-3xl text-[14px] leading-7 text-black/70">
              Мы показываем только главное — без перегруза: условия, поддержка,
              скорость и качество.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          {TRACKS.map((t) => (
            <TrackCardUI
              key={t.id}
              t={t}
              active={t.id === active}
              onClick={() => setActive(t.id)}
            />
          ))}
        </div>
      </section>

      {/* Benefits — что получает партнер */}
      <section>
        <div data-reveal className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[12px] tracking-[0.18em] text-black/45">
              ЧТО ВЫ ПОЛУЧАЕТЕ
            </div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              Понятные выгоды и аккуратный процесс
            </h3>
            <p className="mt-2 max-w-3xl text-[14px] leading-7 text-black/70">
              Мы делаем так, чтобы сотрудничество было удобным: быстро,
              прозрачно и предсказуемо.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
          <StatCard
            title="Скорость"
            desc="Ответ и первичное КП за 1–2 дня. Без лишних согласований."
            icon={<Clock className="h-5 w-5 text-black/60" />}
          />
          <StatCard
            title="Качество"
            desc="Материалы, сборка и упаковка проходят контроль перед отгрузкой."
            icon={<ShieldCheck className="h-5 w-5 text-black/60" />}
          />
          <StatCard
            title="Логистика"
            desc="Сопровождение поставки и понятные сроки. Бережная доставка."
            icon={<Truck className="h-5 w-5 text-black/60" />}
          />
        </div>
      </section>

      {/* Steps — процесс */}
      <section>
        <div data-reveal className="flex items-end justify-between gap-6">
          <div>
            <div className="text-[12px] tracking-[0.18em] text-black/45">
              КАК МЫ РАБОТАЕМ
            </div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              4 шага до результата
            </h3>
            <p className="mt-2 max-w-3xl text-[14px] leading-7 text-black/70">
              Структура понятна с первого взгляда. У вас — проект, у нас —
              спецификация, расчёт и сопровождение.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          <StepCard
            n="01"
            title="Заявка"
            desc="Вы описываете задачу: объект, сроки, пожелания, контакт для связи."
          />
          <StepCard
            n="02"
            title="Подбор и расчёт"
            desc="Мы формируем решения под стиль и бюджет, готовим спецификацию и КП."
          />
          <StepCard
            n="03"
            title="Согласование"
            desc="Уточняем детали, фиксируем условия и сроки. Никаких “сюрпризов”."
          />
          <StepCard
            n="04"
            title="Поставка и поддержка"
            desc="Контроль качества, упаковка, доставка. Мы остаёмся на связи после отгрузки."
          />
        </div>
      </section>

      {/* Form — премиальный CTA */}
      <section
        data-reveal
        className="rounded-3xl border border-black/10 bg-white p-6 md:p-10"
      >
        <div className="grid gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-6">
            <div className="text-[12px] tracking-[0.18em] text-black/45">
              ЗАЯВКА НА СОТРУДНИЧЕСТВО
            </div>
            <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              Расскажите о задаче — мы предложим решение
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              Выбранный формат:{" "}
              <span className="font-medium text-black/80">
                {activeTrack.title}
              </span>
              . Мы свяжемся, уточним детали и подготовим предложение.
            </p>

            <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.02] p-5 text-[13px] leading-6 text-black/65">
              <div className="font-medium text-black/80">Включено:</div>
              <div className="mt-2 grid gap-2">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-black/50" />
                  <span>Консультация и подбор решений</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-black/50" />
                  <span>Спецификация и коммерческое предложение</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-black/50" />
                  <span>Сопровождение поставки и поддержка</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: подключим API (app/api/cooperation/route.ts)
                alert("Заявка отправлена (пока мок). Далее подключим API.");
              }}
              className="grid gap-3"
            >
              <input
                required
                placeholder="Имя"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />
              <input
                required
                placeholder="Компания / студия"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />
              <input
                required
                placeholder="Телефон"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />
              <textarea
                rows={4}
                placeholder="Коротко опишите задачу (объект, сроки, бюджет, пожелания)"
                className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />

              <input type="hidden" value={active} name="track" />

              <button
                type="submit"
                className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-[12px] font-medium tracking-[0.18em] text-white transition hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                ОТПРАВИТЬ
              </button>

              <div className="text-[11px] leading-5 text-black/45">
                Нажимая «Отправить», вы соглашаетесь на обработку данных.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
