"use client";

import { SITE } from "@/data/site";
import { useKarvon } from "@/lib/store";

export function Footer() {
  const { scrollTo } = useKarvon();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 px-gutter py-14 text-[13px] text-cream/55">
      <span className="font-display text-[24px] text-cream">{SITE.name}</span>
      <span>
        {SITE.address} · {SITE.phone}
      </span>
      <div className="flex gap-6">
        <a
          href="#yonalish"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("yonalish");
          }}
        >
          Yuqoriga ↑
        </a>
      </div>
    </footer>
  );
}
