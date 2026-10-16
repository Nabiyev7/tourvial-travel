"use client";

import { CityImageStack } from "@/components/CityImageStack";
import { useKarvon } from "@/lib/store";

export function Hero() {
  const { city, cityIndex, cities, selectCity } = useKarvon();

  return (
    <section
      id="yonalish"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-ink px-gutter pt-hero-top pb-hero-bottom"
    >
      <CityImageStack
        variant="hero"
        zoom
        priority
        sizes="100vw"
      />

      {/* Two layered scrims: one pulls the left column off the photograph, the
          other grounds the hero into the section below it. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg,rgba(14,13,12,0.72) 0%,rgba(14,13,12,0.35) 45%,rgba(14,13,12,0) 75%)," +
            "linear-gradient(180deg,rgba(14,13,12,0.7) 0%,rgba(14,13,12,0.15) 30%,rgba(14,13,12,0.55) 60%,rgba(14,13,12,0.97) 100%)",
        }}
      />

      <div className="relative flex flex-wrap items-end justify-between gap-x-16 gap-y-[clamp(28px,4vw,40px)]">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[18px]">
          <div className="flex items-center gap-3.5 text-[12px] tracking-[0.22em] text-accent uppercase">
            <span aria-hidden className="h-px w-10 bg-accent" />
            <span>{city.country}</span>
          </div>

          <h1 className="font-display m-0 text-hero leading-[0.85] font-medium tracking-[-0.02em]">
            {city.name}
          </h1>

          <p className="font-display m-0 max-w-[520px] text-tagline leading-[1.35] text-pretty text-cream italic [text-shadow:0_1px_18px_rgba(0,0,0,0.6)]">
            {city.tagline}
          </p>
        </div>

        {/* Mobile: a horizontally scrolling rail of city pills. */}
        <div className="-mx-5 flex min-w-0 flex-[1_1_100%] gap-2 overflow-x-auto px-5 pb-1 no-scrollbar dk:hidden">
          {cities.map((option, index) => {
            const active = index === cityIndex;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => selectCity(index)}
                aria-pressed={active}
                className="min-h-11 flex-none cursor-pointer rounded-full border px-[18px] text-[13px] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-all duration-400"
                style={{
                  borderColor: `rgba(243,239,231,${active ? 0.9 : 0.18})`,
                  background: active ? "var(--color-accent)" : "rgba(14,13,12,0.45)",
                  color: active ? "#0e0d0c" : "#f3efe7",
                }}
              >
                {option.name}
              </button>
            );
          })}
        </div>

        {/* Desktop: the city list card. */}
        <div className="hidden min-w-[260px] flex-[0_1_340px] flex-col gap-1.5 rounded-form bg-ink/72 px-5 py-2 backdrop-blur-[14px] dk:flex">
          {cities.map((option, index) => {
            const active = index === cityIndex;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => selectCity(index)}
                aria-pressed={active}
                className="grid cursor-pointer grid-cols-[36px_1fr_auto] items-center gap-3 border-b py-3 text-left text-[14px] tracking-[0.12em] uppercase transition-all duration-400"
                style={{
                  borderBottomColor: `rgba(243,239,231,${active ? 0.9 : 0.18})`,
                  color: `rgba(243,239,231,${active ? 1 : 0.6})`,
                }}
              >
                <span
                  className="text-[11px]"
                  style={{
                    color: active ? "var(--color-accent)" : "rgba(243,239,231,0.45)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{option.name}</span>
                <span className="text-[12px] tracking-[0.04em] normal-case">
                  {option.from}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
