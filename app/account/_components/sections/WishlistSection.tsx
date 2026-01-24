"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase/client";
import { Heart, Trash2 } from "lucide-react";

type Item = {
  id: string;
  product_id: string;
  product_snapshot: {
    title?: string;
    price?: number;
    image?: string;
  };
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function WishlistSection({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id, product_id, product_snapshot")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) setErr(error.message);
    setItems((data as any) ?? []);
    setLoading(false);
  }

  async function remove(id: string) {
    await supabase.from("wishlist_items").delete().eq("id", id);
    load();
  }

  useEffect(() => {
    load();
  }, [userId]);

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-5">
      <div className="text-[12px] tracking-[0.22em] uppercase text-black/50">
        Список желаний
      </div>

      {loading ? (
        <div className="mt-3 text-[14px] text-black/60">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="mt-3 text-[14px] text-black/60">
          В избранном пока пусто.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/[0.05] grid place-items-center">
                  <Heart className="h-4 w-4 text-black/60" />
                </div>

                <div>
                  <div className="text-[14px] text-black/80">
                    {it.product_snapshot?.title ?? "Товар"}
                  </div>
                  {it.product_snapshot?.price && (
                    <div className="text-[12px] text-black/45">
                      {Math.round(it.product_snapshot.price)} UZS
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => remove(it.id)}
                className="h-9 w-9 rounded-xl border border-black/10 grid place-items-center text-black/60 hover:text-black hover:bg-black/[0.04] transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {err && (
        <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-[13px] text-rose-900">
          {err}
        </div>
      )}
    </div>
  );
}
