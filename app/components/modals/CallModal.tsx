"use client";

import Modal from "./Modal";

export default function CallModal({
  open,
  onClose,
  regionLabel,
  phonePrefix,
  regionKey,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  regionLabel: string;
  phonePrefix: string;
  regionKey: "uz" | "ru";
  onSubmit?: (data: {
    lastName: string;
    firstName: string;
    phone: string;
  }) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="ЗАКАЗАТЬ ЗВОНОК"
      widthClass="max-w-[720px]"
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const lastName = String(form.get("lastName") ?? "");
          const firstName = String(form.get("firstName") ?? "");
          const phoneRaw = String(form.get("phone") ?? "");
          const phone = `${phonePrefix} ${phoneRaw}`.trim();

          onSubmit?.({ lastName, firstName, phone });
          onClose();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] tracking-[0.22em] text-black/45">
              ФАМИЛИЯ
            </div>
            <input
              required
              name="lastName"
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[14px] outline-none focus:border-black/20 focus:shadow-[0_0_0_6px_rgba(0,0,0,0.04)] transition"
              placeholder="Иванов"
            />
          </div>

          <div>
            <div className="mb-2 text-[11px] tracking-[0.22em] text-black/45">
              ИМЯ
            </div>
            <input
              required
              name="firstName"
              className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[14px] outline-none focus:border-black/20 focus:shadow-[0_0_0_6px_rgba(0,0,0,0.04)] transition"
              placeholder="Иван"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] tracking-[0.22em] text-black/45">
            ТЕЛЕФОН
          </div>

          <div className="flex h-12 overflow-hidden rounded-2xl border border-black/10 bg-white focus-within:border-black/20 focus-within:shadow-[0_0_0_6px_rgba(0,0,0,0.04)] transition">
            <div className="inline-flex items-center px-4 text-[13px] tracking-[0.14em] text-black/60">
              {phonePrefix}
            </div>
            <input
              required
              name="phone"
              inputMode="tel"
              className="h-full w-full px-3 text-[14px] outline-none"
              placeholder={
                regionKey === "uz" ? "90 123 45 67" : "999 123-45-67"
              }
            />
          </div>

          <div className="mt-2 text-[12px] text-black/45">
            Регион: <span className="text-black/70">{regionLabel}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-2xl bg-black py-3 text-[13px] tracking-[0.18em] text-white hover:opacity-90 transition"
          >
            ОТПРАВИТЬ
          </button>
          <div className="mt-3 text-center text-[12px] text-black/45">
            Далее подключим реальную отправку (Strapi/CRM).
          </div>
        </div>
      </form>
    </Modal>
  );
}
