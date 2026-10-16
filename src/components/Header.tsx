"use client";

import { NAV_LINKS } from "@/data/site";
import { useKarvon } from "@/lib/store";

export function Header() {
  const { menuOpen, toggleMenu, openBooking, scrollTo } = useKarvon();

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-6 px-gutter py-header-y">
      <div className="font-display text-[30px] font-semibold tracking-[0.02em]">
        KARVON
      </div>

      <nav className="hidden flex-wrap gap-[clamp(16px,2.4vw,32px)] text-[13px] tracking-[0.08em] text-cream/82 uppercase dk:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(event) => {
              event.preventDefault();
              scrollTo(link.id);
            }}
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
        className="hidden items-center gap-2.5 rounded-full border border-cream/40 px-[22px] py-3 text-[13px] tracking-[0.06em] uppercase dk:flex"
      >
        Buyurtma berish
      </a>

      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-controls="karvon-mobile-menu"
        className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-cream/40 bg-ink/35 px-[18px] text-[12px] font-semibold tracking-[0.14em] text-cream uppercase dk:hidden"
      >
        {menuOpen ? "Yopish" : "Menyu"}
      </button>
    </header>
  );
}
