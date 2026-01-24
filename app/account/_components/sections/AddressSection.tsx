"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type Addr = {
  id: string;
  title: string | null;
  city: string | null;
  street: string | null;
  house: string | null;
  apartment: string | null;
  is_default: boolean;
};

export default function AddressSection({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Addr[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Дом");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");

  async function refresh() {
    setErr(null);
    setLoading(true);
    const { data, error } = await supabase
      .from("addresses")
      .select("id,title,city,street,house,apartment,is_default")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) setErr(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, [userId]);

  async function add() {
    setErr(null);
    const { error } = await supabase.from("addresses").insert({
      user_id: userId,
      title,
      city: city || null,
      street: street || null,
      house: house || null,
      apartment: apartment || null,
    });

    if (error) {
      setErr(error.message);
      return;
    }

    setOpen(false);
    setCity("");
    setStreet("");
    setHouse("");
    setApartment("");
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[12px] tracking-[0.22em] uppercase text-black/50">
              Адресная книга
            </div>
            <div className="mt-1 text-[14px] text-black/70">
              Сохранённые адреса доставки.
            </div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 px-4 rounded-2xl bg-black text-white transition cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <span className="text-[12px] tracking-[0.18em] uppercase">
              {open ? "Закрыть" : "Добавить"}
            </span>
          </button>
        </div>

        {open && (
          <div className="mt-4 grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Название (Дом/Работа)"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none text-[14px]"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Город"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none text-[14px]"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Улица"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none text-[14px]"
              />
              <input
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                placeholder="Дом"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none text-[14px]"
              />
            </div>

            <input
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Квартира (необязательно)"
              className="rounded-2xl border border-black/10 px-4 py-3 outline-none text-[14px]"
            />

            <button
              onClick={add}
              className="mt-2 h-11 rounded-2xl bg-black text-white transition cursor-pointer hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <span className="text-[12px] tracking-[0.18em] uppercase">
                Сохранить адрес
              </span>
            </button>
          </div>
        )}

        {err && (
          <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-[13px] text-rose-900">
            {err}
          </div>
        )}
      </div>

      <div className="rounded-[28px] border border-black/10 bg-white p-5">
        {loading ? (
          <div className="text-[14px] text-black/60">Загрузка…</div>
        ) : rows.length === 0 ? (
          <div className="text-[14px] text-black/60">Адресов пока нет.</div>
        ) : (
          <div className="space-y-2">
            {rows.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-black/10 px-4 py-3"
              >
                <div className="text-[13px] text-black/80">
                  {a.title ?? "Адрес"}
                </div>
                <div className="mt-1 text-[12px] text-black/55">
                  {[
                    a.city,
                    a.street,
                    a.house,
                    a.apartment && `кв ${a.apartment}`,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
