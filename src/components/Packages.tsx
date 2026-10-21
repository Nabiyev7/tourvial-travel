"use client";

import { CityImageStack } from "@/components/CityImageStack";
import { useKarvon } from "@/lib/store";

export function Packages() {
  const { city, openBooking } = useKarvon();

  return (
    <section
      id="paketlar"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-[clamp(40px,6vw,96px)] px-gutter pt-section pb-section-sm"
    >
      <div className="relative top-10 flex flex-col gap-7 dk:sticky">
        <div className="flex flex-col gap-4">
          <span className="text-[12px] tracking-[0.22em] text-accent uppercase">
            {city.name} paketlari
          </span>
          <h2 className="font-display m-0 text-display-lg leading-none font-medium tracking-[-0.01em] text-balance">
            Har bir kun oldindan o&apos;ylangan
          </h2>
        </div>

        <div className="relative aspect-4/3 overflow-hidden rounded-card bg-pop dk:aspect-4/5">
          <CityImageStack
            variant="packages"
            sizes="(min-width: 760px) 44vw, 100vw"
          />
        </div>
      </div>

      <div className="flex flex-col pt-0 dk:pt-[clamp(0px,8vw,160px)]">
        {city.packages.map((pkg, index) => (
          <article
            key={pkg.title}
            className="flex flex-col gap-5 border-t border-cream/14 py-10"
          >
            <div className="flex items-baseline justify-between gap-4 text-[12px] tracking-[0.16em] text-cream/60 uppercase">
              <span>
                {String(index + 1).padStart(2, "0")} · {pkg.days}
              </span>
              <span>{pkg.price} dan</span>
            </div>

            <h3 className="font-display m-0 text-package leading-[1.05] font-medium">
              {pkg.title}
            </h3>

            <p className="m-0 max-w-[520px] text-[16px] leading-[1.65] text-pretty text-cream/75">
              {pkg.desc}
            </p>

            <a
              href="#aloqa"
              onClick={(event) => {
                event.preventDefault();
                openBooking(`${pkg.title} · ${pkg.days}, ${pkg.price} dan`);
              }}
              className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.12em] text-accent uppercase"
            >
              <span>Batafsil va buyurtma</span>
              <span aria-hidden>→</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
