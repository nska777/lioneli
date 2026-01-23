"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const r = useRouter();
  const [phone, setPhone] = useState("+998");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState<string | null>(null);

  async function signInGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  async function sendOtp() {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) return setError(error.message);
    setStep("code");
  }

  async function verifyOtp() {
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });
    if (error) return setError(error.message);
    r.push("/account");
  }

  return (
    <main className="mx-auto max-w-[520px] px-4 py-12">
      <div className="rounded-3xl border border-black/10 bg-white p-6">
        <div className="text-[12px] tracking-[0.28em] text-black/45">
          LIONETO
        </div>
        <h1 className="mt-2 text-2xl font-semibold">Вход</h1>

        <button
          onClick={signInGoogle}
          className="mt-5 w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer"
        >
          Войти через Google
        </button>

        <div className="mt-5 h-px bg-black/10" />

        {step === "phone" ? (
          <>
            <div className="mt-5 text-sm font-medium">Войти по телефону</div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/25"
              placeholder="+998 90 123 45 67"
            />
            <button
              onClick={sendOtp}
              className="mt-3 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition cursor-pointer"
            >
              Получить код
            </button>
          </>
        ) : (
          <>
            <div className="mt-5 text-sm font-medium">Введите код из SMS</div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-black/25"
              placeholder="123456"
            />
            <button
              onClick={verifyOtp}
              className="mt-3 w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer"
            >
              Подтвердить
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
