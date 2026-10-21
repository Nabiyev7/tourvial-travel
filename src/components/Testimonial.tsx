"use client";

import { useKarvon } from "@/lib/store";

export function Testimonial() {
  const { city } = useKarvon();

  return (
    <section className="flex flex-col items-center gap-8 border-t border-cream/12 px-gutter py-section-sm text-center">
      <span
        aria-hidden
        className="font-display text-glyph leading-[0.5] text-accent"
      >
        &ldquo;
      </span>
      <blockquote className="font-display m-0 max-w-[900px] text-quote leading-[1.25] font-normal text-balance italic">
        {city.testimonial.quote}
      </blockquote>
      <span className="text-[13px] tracking-[0.16em] text-cream/60 uppercase">
        {city.testimonial.author}
      </span>
    </section>
  );
}
