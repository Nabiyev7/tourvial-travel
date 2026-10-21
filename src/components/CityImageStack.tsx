"use client";

import Image from "next/image";

import { CITIES, packagesImage } from "@/data/cities";
import { useKarvon } from "@/lib/store";

type Props = {
  /** "hero" uses the full-bleed image, "packages" the secondary one. */
  variant?: "hero" | "packages";
  /** The hero adds a slow Ken Burns zoom; other sections just crossfade. */
  zoom?: boolean;
  /** Hero and CTA fill the viewport; the packages image fills its box. */
  sizes?: string;
  priority?: boolean;
  /** Decorative stacks (the CTA band) take an empty alt. */
  decorative?: boolean;
};

/**
 * Every city image is rendered at once and only the active one is opaque, so
 * switching city crossfades instead of flashing a blank box while the next
 * photograph loads.
 */
export function CityImageStack({
  variant = "hero",
  zoom = false,
  sizes = "100vw",
  priority = false,
  decorative = false,
}: Props) {
  const { cityIndex } = useKarvon();

  return (
    <>
      {CITIES.map((city, index) => {
        const active = index === cityIndex;
        return (
          <Image
            key={city.key}
            src={variant === "hero" ? city.image : packagesImage(city)}
            alt={decorative ? "" : city.name}
            fill
            sizes={sizes}
            priority={priority && active}
            quality={85}
            className={zoom ? "city-layer object-cover" : "city-layer-soft object-cover"}
            style={{
              objectPosition: variant === "hero" ? city.position : "center",
              opacity: active ? 1 : 0,
              transform: zoom ? `scale(${active ? 1 : 1.06})` : undefined,
            }}
            aria-hidden={active ? undefined : true}
          />
        );
      })}
    </>
  );
}
