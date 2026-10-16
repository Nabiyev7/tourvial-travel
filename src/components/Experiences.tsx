"use client";

import { useKarvon } from "@/lib/store";

export function Experiences() {
  const { city } = useKarvon();

  return (
    <section
      id="tajriba"
      className="bg-accent-dim px-gutter py-section-sm"
    >
      <div className="mb-[clamp(40px,6vw,64px)] flex flex-wrap items-end justify-between gap-8">
        <h2 className="font-display m-0 max-w-[720px] text-display-md leading-[1.05] font-medium text-balance">
          {city.name}da faqat siz uchun ochiladigan eshiklar
        </h2>
        <p className="m-0 max-w-[360px] text-[15px] leading-[1.65] text-cream/72">
          Har bir tajriba istalgan paketga qo&apos;shiladi yoki alohida band
          qilinadi.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
        {city.experiences.map((experience) => (
          <div
            key={experience.title}
            className="flex flex-col gap-3.5 rounded-card border border-cream/14 bg-ink px-7 pt-9 pb-11"
          >
            <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
            <h3 className="font-display m-0 text-[28px] leading-[1.1] font-medium">
              {experience.title}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-cream/70">
              {experience.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
