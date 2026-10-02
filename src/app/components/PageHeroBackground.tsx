import { ReactNode } from "react";

/**
 * Shared page-hero background.
 * When `image` is set (from admin panel), renders it as a cover background
 * with a dark overlay. Otherwise falls back to `fallbackClassName` (e.g. the
 * original brand gradient).
 */
export function PageHeroBackground({
  image,
  fallbackClassName,
  overlayClassName = "bg-black/55",
  children,
}: {
  image?: string;
  fallbackClassName: string;
  overlayClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden text-white ${
        image ? "" : fallbackClassName
      }`}
      style={
        image
          ? {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {image && <div className={`absolute inset-0 ${overlayClassName}`} />}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
