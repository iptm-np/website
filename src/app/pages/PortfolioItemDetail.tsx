import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  MapPin,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useContent } from "../contexts/ContentContext";
import { PortfolioItem, PortfolioType } from "../../types/portfolio.types";
import { formatContractAmount } from "../../services/portfolio.service";
import { SanitizedHtml } from "../components/ui/sanitized-html";

const typeLabels: Record<PortfolioType, string> = {
  project: "Project",
  consulting: "Consulting Assignment",
  training: "Training Program",
};

const backLinks: Record<PortfolioType, string> = {
  project: "/portfolio",
  consulting: "/portfolio",
  training: "/portfolio",
};

interface PortfolioItemDetailProps {
  expectedType?: PortfolioType;
}

function getSpecificLabel(item: PortfolioItem) {
  if (item.type === "project") return item.projectType || "Engineering Project";
  if (item.type === "consulting")
    return item.serviceType || "Consulting Service";
  return item.trainingType || "Training & Capacity Building";
}

export function PortfolioItemDetail({
  expectedType,
}: PortfolioItemDetailProps) {
  const { slug } = useParams();
  const { portfolio, clients } = useContent();

  const item = portfolio.find(
    (portfolioItem) =>
      portfolioItem.slug === slug &&
      (!expectedType || portfolioItem.type === expectedType),
  );

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-950">
            Portfolio Item Not Found
          </h1>
          <p className="mt-3 text-slate-600">
            The assignment you are looking for does not exist in the portfolio.
          </p>
          <Link to="/portfolio">
            <Button className="mt-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const gallery = (item.galleryImages || []).filter(Boolean);

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-r from-brand-500 to-brand-700 text-white">
        {item.featuredImage && (
          <> <img
            src={item.featuredImage}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover "
          />
          <div className="absolute inset-0 bg-black/55"></div>
          </>
         
        )}
 
        <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
          <Link to={backLinks[item.type]}>
            <Button variant="secondary" size="sm" className="mb-8 w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-sm font-semibold text-cyan-100 ring-1 ring-cyan-200/30">
                {typeLabels[item.type]}
              </span>
              {item.status && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
                  {item.status}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {item.title}
            </h1>
            <div
             
              className="mt-5 max-w-3xl text-lg leading-8 text-white"
            >{item.shortDescription}</div>
          </div>
        </div>
      </section>

      <section className="border-b bg-slate-50 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <UserRound className="mb-3 h-5 w-5 text-cyan-700" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Client
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {clients.find((c) => c.id === item.clientId)?.name || "-"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <BriefcaseBusiness className="mb-3 h-5 w-5 text-cyan-700" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Category
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {getSpecificLabel(item)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <Calendar className="mb-3 h-5 w-5 text-cyan-700" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fiscal Year
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {item.fiscalYear || "-"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <MapPin className="mb-3 h-5 w-5 text-cyan-700" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </p>
            <p className="mt-1 font-semibold text-slate-950">
              {item.location || "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="min-w-0 overflow-hidden">
          <h2 className="text-3xl font-bold text-slate-950">
            Assignment Overview
          </h2>
          <SanitizedHtml
            html={
              item.overview || item.fullDescription || item.shortDescription
            }
            className="mt-6 text-lg leading-8 text-slate-700"
          />
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-950">
            Project Information
          </h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Sector</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {item.sector || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Contract Amount</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatContractAmount(item.contractAmount || "")}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Partner Firms</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {item.partnerFirms || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Timeline</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {[item.startDate, item.endDate].filter(Boolean).join(" - ") ||
                  "-"}
              </dd>
            </div>
            {item.type === "training" && (
              <div>
                <dt className="text-slate-500">Mode</dt>
                <dd className="mt-1 font-semibold capitalize text-slate-900">
                  {item.mode || "-"}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </section>

      {gallery.length > 0 && (
        <section className="border-t bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-slate-950">
                Project Gallery
              </h2>
              <Link
                to={`/gallery/${item.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                View Full Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.slice(0, 4).map((src, index) => (
                <Link
                  key={index}
                  to={`/gallery/${item.slug}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <img
                    src={src}
                    alt={`${item.title} — gallery photo ${index + 1}`}
                    loading="lazy"
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {index === 3 && gallery.length > 4 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-sm font-semibold text-white">
                      +{gallery.length - 4} more
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
