"use client";

import { useEffect, useRef } from "react";

import { useKarvon } from "@/lib/store";

export function BookingModal() {
  const {
    city,
    dateLabel,
    guestsLabel,
    bookingOpen,
    bookingSent,
    bookingTitle,
    closeBooking,
    name,
    setName,
    phone,
    setPhone,
    error,
    submitBooking,
  } = useKarvon();

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookingOpen && !bookingSent) nameRef.current?.focus();
  }, [bookingOpen, bookingSent]);

  if (!bookingOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={bookingTitle}
      onClick={closeBooking}
      className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(8,7,6,0.78)] p-5 backdrop-blur-[8px]"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[calc(100vh-40px)] w-full max-w-[520px] flex-col gap-6 overflow-auto rounded-form border border-cream/14 bg-cell p-modal text-cream"
      >
        <button
          type="button"
          onClick={closeBooking}
          aria-label="Yopish"
          className="absolute top-4 right-4 h-10 w-10 cursor-pointer rounded-full border border-cream/14 text-[18px]"
        >
          ×
        </button>

        {bookingSent ? (
          <div className="flex flex-col gap-4 py-3">
            <span aria-hidden className="h-3 w-3 rounded-full bg-accent" />
            <h3 className="font-display m-0 text-[38px] leading-[1.05] font-medium">
              Rahmat, {name}!
            </h3>
            <p className="m-0 text-[16px] leading-[1.6] text-cream/75">
              So&apos;rovingiz qabul qilindi. Menejer 15 daqiqa ichida {phone}{" "}
              raqamiga qo&apos;ng&apos;iroq qiladi.
            </p>
            <button
              type="button"
              onClick={closeBooking}
              className="cursor-pointer self-start rounded-full border border-cream/40 px-[26px] py-3.5 text-[13px] font-semibold tracking-[0.12em] uppercase"
            >
              Yopish
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2.5 pr-10">
              <span className="text-[11px] tracking-[0.2em] text-accent uppercase">
                {city.name} · {dateLabel} · {guestsLabel}
              </span>
              <h3 className="font-display m-0 text-modal leading-[1.05] font-medium">
                {bookingTitle}
              </h3>
            </div>

            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                submitBooking();
              }}
              className="flex flex-col gap-3.5"
            >
              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.18em] text-cream/55 uppercase">
                  Ismingiz
                </span>
                <input
                  ref={nameRef}
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ism Familiya"
                  autoComplete="name"
                  className="rounded-card border border-cream/14 bg-ink px-4 py-3.5 text-[16px] outline-none focus-visible:border-accent"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[11px] tracking-[0.18em] text-cream/55 uppercase">
                  Telefon
                </span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+998 90 123 45 67"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "booking-error" : undefined}
                  className="rounded-card border border-cream/14 bg-ink px-4 py-3.5 text-[16px] outline-none focus-visible:border-accent"
                />
              </label>

              <span
                id="booking-error"
                role={error ? "alert" : undefined}
                className="min-h-[18px] text-[13px] text-danger"
              >
                {error}
              </span>

              <button
                type="submit"
                className="cursor-pointer rounded-full bg-accent p-[18px] text-[13px] font-bold tracking-[0.14em] text-ink uppercase"
              >
                So&apos;rov yuborish
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
