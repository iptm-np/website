import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, Images } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { PortfolioItem } from "../../types/portfolio.types";

const typeBadgeLabels: Record<PortfolioItem["type"], string> = {
  project: "Project",
  consulting: "Consulting",
  training: "Training",
};

export function Gallery() {

  const { pageHeroImages } = useContent();
  const { portfolio } = useContent();

  // Only items that actually have photos appear in the gallery.
  const groups = useMemo(
    () => portfolio.filter((item) => (item.galleryImages || []).length > 0),
    [portfolio],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeroBackground
        image={pageHeroImages?.gallery || ""}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-brand-50 max-w-3xl">
            Photos from our projects, consulting assignments, and training
            programs — grouped by work.
          </p>
          </div>

      </PageHeroBackground>
     

      {groups.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Images className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg text-gray-500">
            No gallery photos have been added yet.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const images = group.galleryImages || [];
              const cover = images[0];

              return (
                <Link
                  key={group.id}
                  to={`/gallery/${group.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={cover}
                      alt={`${group.title} gallery cover`}
                      loading="lazy"
                      className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {images.length} {images.length === 1 ? "photo" : "photos"}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 ring-1 ring-cyan-200">
                      {typeBadgeLabels[group.type]}
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-slate-950 line-clamp-2">
                      {group.title}
                    </h2>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                      View gallery
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
