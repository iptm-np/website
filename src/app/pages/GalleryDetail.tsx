import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Images } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { Lightbox } from "../components/Lightbox";
import { PortfolioItem } from "../../types/portfolio.types";

const typeBadgeLabels: Record<PortfolioItem["type"], string> = {
  project: "Project",
  consulting: "Consulting",
  training: "Training",
};

export function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { portfolio } = useContent();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const item = useMemo(
    () => portfolio.find((p) => p.slug === slug),
    [portfolio, slug],
  );

  const images = useMemo(
    () => (item?.galleryImages || []).filter(Boolean),
    [item],
  );

  if (!item || images.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <Images className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h1 className="text-2xl font-bold text-slate-950">
            Gallery not found
          </h1>
          <p className="mt-2 text-slate-600">
            This gallery does not exist or has no photos yet.
          </p>
          <Link to="/gallery">
            <button className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700">
              Back to Gallery
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Link
            to="/gallery"
            className="mb-6 inline-flex items-center gap-2 text-sm text-brand-100 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold sm:text-4xl">{item.title}</h1>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/25">
              {typeBadgeLabels[item.type]}
            </span>
          </div>
          <p className="mt-2 text-brand-100">
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </section>

      {/* Photo grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label={`Open photo ${index + 1} of ${images.length}`}
            >
              <img
                src={src}
                alt={`${item.title} — photo ${index + 1}`}
                loading="lazy"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
