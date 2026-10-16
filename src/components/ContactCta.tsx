"use client";

import { CityImageStack } from "@/components/CityImageStack";
import { SITE } from "@/data/site";
import { useKarvon } from "@/lib/store";

export function ContactCta() {
  const { city, openBooking } = useKarvon();

  return (
    <section
      id="aloqa"
      className="relative flex min-h-[min(560px,100vh)] items-center overflow-hidden px-gutter py-section-sm"
    >
      <CityImageStack variant="hero" decorative sizes="100vw" />
      <div aria-hidden className="absolute inset-0 bg-ink/72" />

      <div className="relative flex max-w-[760px] flex-col gap-7">
        <h2 className="font-display m-0 text-display-xl leading-[0.98] font-medium text-balance">
          {city.name}ga sayohatni bugun rejalashtiring
        </h2>
        <p className="m-0 text-[17px] leading-[1.6] text-cream/82">
          Menejer 15 daqiqa ichida qo&apos;ng&apos;iroq qilib, sizga mos
          dasturni taklif qiladi.
        </p>

        <div className="flex flex-wrap gap-3.5">
          <a
            href={SITE.phoneHref}
            onClick={(event) => {
              event.preventDefault();
              openBooking();
            }}
            className="rounded-full bg-accent px-[30px] py-[18px] text-[13px] font-bold tracking-[0.12em] text-ink uppercase"
          >
            Qo&apos;ng&apos;iroq buyurtma qilish
          </a>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-cream/50 px-[30px] py-[18px] text-[13px] font-semibold tracking-[0.12em] uppercase"
          >
            Telegramda yozish
          </a>
        </div>
      </div>
    </section>
  );
}
