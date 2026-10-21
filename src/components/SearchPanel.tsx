"use client";

import { GUEST_OPTIONS, WEEKDAYS } from "@/data/site";
import { useKarvon } from "@/lib/store";

const LABEL = "text-[11px] tracking-[0.18em] text-cream/55 uppercase";

export function SearchPanel() {
  const {
    city,
    dateLabel,
    calendarLabel,
    calendarDays,
    canGoBack,
    canGoForward,
    prevMonth,
    nextMonth,
    pickDay,
    guests,
    guestsLabel,
    setGuests,
    popover,
    togglePopover,
    openBooking,
  } = useKarvon();

  const facts = [
    { key: "Parvoz", value: city.flight },
    { key: "Eng yaxshi mavsum", value: city.season },
    { key: "Viza", value: city.visa },
    { key: "Vaqt farqi", value: city.tz },
  ];

  return (
    <section className="-mt-px bg-ink px-gutter">
      {/* The 1px grid gap over a cream-tinted background is what draws the
          dividers between cells. */}
      <form
        data-search-form
        onSubmit={(event) => {
          event.preventDefault();
          openBooking();
        }}
        className="relative z-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-px rounded-form border border-cream/12 bg-cream/12"
      >
        <div className="flex flex-col gap-1.5 bg-cell px-6 py-5">
          <span className={LABEL}>Manzil</span>
          <span className="text-[16px] font-semibold">
            {city.name}, {city.country}
          </span>
        </div>

        {/* --- Date ------------------------------------------------------ */}
        <div className="relative bg-cell">
          <button
            type="button"
            onClick={() => togglePopover("month")}
            aria-expanded={popover === "month"}
            className="flex h-full w-full cursor-pointer items-center justify-between gap-3 px-6 py-5 text-left"
          >
            <span className="flex flex-col gap-1.5">
              <span className={LABEL}>Sana</span>
              <span className="text-[16px] font-semibold">{dateLabel}</span>
            </span>
            <span
              aria-hidden
              className="text-[12px] text-accent transition-transform duration-300"
              style={{
                transform: `rotate(${popover === "month" ? 180 : 0}deg)`,
              }}
            >
              ▾
            </span>
          </button>

          {popover === "month" ? (
            <div className="absolute top-[calc(100%+8px)] left-0 z-30 flex w-[max(100%,min(320px,calc(100vw-40px)))] flex-col gap-3.5 rounded-form border border-cream/14 bg-pop p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prevMonth}
                  disabled={!canGoBack}
                  aria-label="Oldingi oy"
                  className="h-9 w-9 cursor-pointer rounded-full border border-cream/14 text-[14px] disabled:cursor-default"
                  style={{ opacity: canGoBack ? 1 : 0.3 }}
                >
                  ‹
                </button>
                <span className="font-display text-[22px] font-medium">
                  {calendarLabel}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  disabled={!canGoForward}
                  aria-label="Keyingi oy"
                  className="h-9 w-9 cursor-pointer rounded-full border border-cream/14 text-[14px] disabled:cursor-default"
                  style={{ opacity: canGoForward ? 1 : 0.3 }}
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {WEEKDAYS.map((weekday) => (
                  <span
                    key={weekday}
                    className="py-1.5 text-center text-[11px] tracking-[0.08em] text-cream/45 uppercase"
                  >
                    {weekday}
                  </span>
                ))}

                {calendarDays.map((entry, index) =>
                  entry.day === null ? (
                    <span key={`blank-${index}`} className="h-[38px]" />
                  ) : (
                    <button
                      key={entry.day}
                      type="button"
                      onClick={() => pickDay(entry.day!)}
                      disabled={entry.past}
                      aria-pressed={entry.selected}
                      className="h-[38px] rounded-full text-[14px] enabled:cursor-pointer disabled:cursor-default"
                      style={{
                        background: entry.selected
                          ? "var(--color-accent)"
                          : "transparent",
                        color: entry.selected
                          ? "#0e0d0c"
                          : entry.past
                            ? "rgba(243,239,231,0.22)"
                            : "#f3efe7",
                        fontWeight: entry.selected ? 700 : 500,
                      }}
                    >
                      {entry.day}
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* --- Guests ---------------------------------------------------- */}
        <div className="relative bg-cell">
          <button
            type="button"
            onClick={() => togglePopover("guests")}
            aria-expanded={popover === "guests"}
            className="flex h-full w-full cursor-pointer items-center justify-between gap-3 px-6 py-5 text-left"
          >
            <span className="flex flex-col gap-1.5">
              <span className={LABEL}>Mehmonlar</span>
              <span className="text-[16px] font-semibold">{guestsLabel}</span>
            </span>
            <span
              aria-hidden
              className="text-[12px] text-accent transition-transform duration-300"
              style={{
                transform: `rotate(${popover === "guests" ? 180 : 0}deg)`,
              }}
            >
              ▾
            </span>
          </button>

          {popover === "guests" ? (
            <div className="absolute top-[calc(100%+8px)] inset-x-0 z-30 flex flex-col gap-0.5 rounded-form border border-cream/14 bg-pop p-2 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              {GUEST_OPTIONS.map((option) => {
                const active = option.value === guests;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGuests(option.value)}
                    aria-pressed={active}
                    className="flex cursor-pointer items-center justify-between rounded-card px-3.5 py-3 text-left text-[15px] font-medium hover:bg-cream/6"
                    style={{
                      background: active ? "rgba(243,239,231,0.06)" : undefined,
                    }}
                  >
                    <span>{option.label}</span>
                    <span
                      aria-hidden
                      className="text-accent"
                      style={{ opacity: active ? 1 : 0 }}
                    >
                      ●
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="cursor-pointer bg-accent px-6 py-5 text-[13px] font-bold tracking-[0.14em] text-ink uppercase"
        >
          Sayohatni rejalashtirish
        </button>
      </form>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-[clamp(20px,3vw,32px)] pt-[clamp(40px,6vw,56px)]">
        {facts.map((fact) => (
          <div
            key={fact.key}
            className="flex flex-col gap-2 border-t border-cream/14 pt-4"
          >
            <span className={LABEL}>{fact.key}</span>
            <span className="font-display text-[26px] leading-[1.2]">
              {fact.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
