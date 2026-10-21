"use client";

import { NAV_LINKS } from "@/data/site";
import { useKarvon } from "@/lib/store";

export function MobileMenu() {
  const { menuOpen, openBooking, scrollTo } = useKarvon();

  if (!menuOpen) return null;

  return (
    <div
      id="karvon-mobile-menu"
      className="fixed inset-0 z-15 flex flex-col justify-between gap-8 bg-ink px-6 pt-[120px] pb-10 dk:hidden"
    >
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(event) => {
              event.preventDefault();
              scrollTo(link.id);
            }}
            className="font-display border-b border-cream/12 py-3 text-[38px] leading-[1.1]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#aloqa"
        onClick={(event) => {
          event.preventDefault();
          openBooking();
        }}
        className="flex justify-center rounded-full bg-accent p-[18px] text-[13px] font-bold tracking-[0.14em] text-ink uppercase"
      >
        Buyurtma berish
      </a>
    </div>
  );
}
