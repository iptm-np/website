import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useContent } from "../contexts/ContentContext";
import { SanitizedHtml } from "../components/ui/sanitized-html";
import {
  MapPin,
  Calendar,
  ArrowRight,
  LayoutGrid,
  Table2,
  Layers,
  MapPinned,
  ShieldCheck,
  Handshake,
  Clock,
  Leaf,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { PortfolioFilters as PortfolioFiltersComponent } from "../components/portfolio/PortfolioFilters";
import { PortfolioFiltersState } from "../../types/portfolio.types";
import project1 from "../../imports/iptm-nepal_logo.webp";
import project2 from "../../imports/iptm-nepal_logo.webp";
import project3 from "../../imports/iptm-nepal_logo.webp";
import project4 from "../../imports/iptm-nepal_logo.webp";
import project5 from "../../imports/iptm-nepal_logo.webp";
import project6 from "../../imports/iptm-nepal_logo.webp";
import { PageHeroBackground } from "../components/PageHeroBackground";

type ProjectStatus = "upcoming" | "ongoing" | "completed";

export function Projects() {
  const { projects, galleryImages, portfolio, clients, pageHeroImages } =
    useContent();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [fySortOrder, setFySortOrder] = useState<"desc" | "asc">("desc");
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: "all",
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: "",
  });
  const [visibleCount, setVisibleCount] = useState(6);

  const projectItems = [
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      description: project.description,
      projectType: project.projectType,
      imageUrl: project.imageUrl,
      status: project.status as ProjectStatus,
      slug: project.slug,
      location: project.location,
      completionDate: project.completionDate,
      sector: undefined as string | undefined,
      fiscalYear: undefined as string | undefined,
      clientId: undefined as string | undefined,
    })),
    ...portfolio
      .filter((item) => item.type === "project")
      .map((item) => ({
        id: `portfolio-${item.id}`,
        title: item.title,
        description: item.shortDescription,
        projectType: item.projectType || "Project",
        imageUrl: item.featuredImage,
        status: (item.status || "ongoing") as ProjectStatus,
        slug: item.slug,
        location: item.location,
        completionDate: item.endDate,
        sector: item.sector,
        fiscalYear: item.fiscalYear,
        clientId: item.clientId,
      })),
  ];

  const filterValues = {
    sectors: [
      ...new Set(projectItems.map((p) => p.sector).filter(Boolean)),
    ] as string[],
    fiscalYears: [
      ...new Set(projectItems.map((p) => p.fiscalYear).filter(Boolean)),
    ] as string[],
  };

  const resetVisibleCount = () => setVisibleCount(6);

  const updateFilters = (updates: Partial<PortfolioFiltersState>) => {
    setFilters((current) => ({ ...current, ...updates }));
    resetVisibleCount();
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      sector: undefined,
      fiscalYear: undefined,
      client: undefined,
      search: "",
    });
    resetVisibleCount();
  };

  const filteredProjects = projectItems
    .filter((project) => {
      const search = (filters.search || "").toLowerCase();
      const matchesSearch =
        !search ||
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        (project.location || "").toLowerCase().includes(search);
      const matchesSector =
        !filters.sector || project.sector === filters.sector;
      const matchesFiscalYear =
        !filters.fiscalYear || project.fiscalYear === filters.fiscalYear;
      const matchesClient =
        !filters.client || project.clientId === filters.client;
      return (
        matchesSearch && matchesSector && matchesFiscalYear && matchesClient
      );
    })
    .sort((a, b) => {
      const yearA = a.fiscalYear || "0000";
      const yearB = b.fiscalYear || "0000";
      return fySortOrder === "desc"
        ? yearB.localeCompare(yearA)
        : yearA.localeCompare(yearB);
    });

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const hasActiveFilters =
    Boolean(filters.sector) ||
    Boolean(filters.fiscalYear) ||
    Boolean(filters.client) ||
    Boolean(filters.search);

  const isEmpty = filteredProjects.length === 0;

  const statusLabel = (status: ProjectStatus) => {
    if (status === "upcoming") return "Upcoming";
    if (status === "ongoing") return "Ongoing";
    return "Completed";
  };

  const statusClass = (status: ProjectStatus) => {
    if (status === "upcoming") return "bg-blue-500 text-white";
    if (status === "ongoing") return "bg-green-500 text-white";
    return "bg-gray-800 text-white";
  };

  const heroImages = [
    project1,
    project2,
    project3,
    project4,
    project5,
    project6,
  ];

  const whyIptmNepal = [
    {
      icon: Layers,
      title: "End-to-End Delivery",
      description:
        "We handle every phase — design, procurement, supervision, and handover — so you deal with one trusted team throughout.",
    },
    {
      icon: MapPinned,
      title: "Deep Local Knowledge",
      description:
        "Decades of on-the-ground experience across Nepal means we understand the terrain, regulations, and stakeholders that others don't.",
    },
    {
      icon: ShieldCheck,
      title: "Technical Rigor",
      description:
        "Our engineers apply international standards to every BOQ, drawing, and quality check — no shortcuts, no compromises.",
    },
    {
      icon: Handshake,
      title: "Client-First Approach",
      description:
        "We align our success with yours. Transparent communication, realistic timelines, and accountability at every milestone.",
    },
    {
      icon: Clock,
      title: "On-Time, On-Budget",
      description:
        "Rigorous project scheduling and cost control mean our clients consistently receive what was promised, when it was promised.",
    },
    {
      icon: Leaf,
      title: "Sustainable Impact",
      description:
        "Every project we deliver is designed to serve communities for decades — environmentally sound and socially responsible.",
    },
  ];

  const viewToggle = (
    <div className="flex items-center rounded-md border border-slate-200 overflow-hidden">
      <button
        onClick={() => setView("grid")}
        className={`p-2 transition-colors ${view === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
        title="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setView("table")}
        className={`p-2 transition-colors ${view === "table" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
        title="Table view"
      >
        <Table2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <PageHeroBackground
        image={pageHeroImages?.projects}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              Projects Built Across Nepal
            </h1>

            <p className="text-xl text-brand-50 max-w-3xl">
              Infrastructure, design-build, and contract projects delivered on time
              and at scale across Nepal.
            </p>

            <div className="mt-8 flex flex-wrap gap-10">
              <div>
                <p className="text-3xl font-bold">{projectItems.length}+</p>
                <p className="mt-1 text-sm text-brand-100">
                  Projects Delivered
                </p>
              </div>

            </div>
          </div>
        </div>

      </PageHeroBackground>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Projects Portfolio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the diverse projects successfully implemented by IPTM Nepal
              across various sectors, delivering innovative solutions and
              sustainable impact.
            </p>
          </div>

          {/* Filters */}
          <PortfolioFiltersComponent
            filters={filters}
            filterValues={filterValues}
            clients={clients}
            pagination={{
              visibleCount:
                view === "grid"
                  ? visibleProjects.length
                  : filteredProjects.length,
              filteredCount: filteredProjects.length,
              page: 1,
              totalPages: 1,
              itemLabel: "projects",
            }}
            hasActiveFilters={hasActiveFilters}
            isEmpty={isEmpty}
            showTypeFilter={false}
            extraControls={viewToggle}
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
            onDownloadCsv={() => { }}
          />

          {/* Content */}
          <div className="mt-8">
            {isEmpty ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No projects found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : view === "grid" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleProjects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group">
                        <div className="relative overflow-hidden">
                          {project.imageUrl ? (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-64 bg-gradient-to-br from-brand-600 via-brand-500 to-slate-800" />
                          )}
                          <div className="absolute top-4 right-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass(project.status)}`}
                            >
                              {statusLabel(project.status)}
                            </span>
                          </div>
                        </div>
                        <CardContent className="pt-6">
                          <div className="mb-3">
                            <span className="px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full font-medium capitalize">
                              {project.projectType}
                            </span>
                          </div>
                          <h3 className="font-semibold text-xl mb-2 group-hover:text-brand-600 transition-colors">
                            {project.title}
                          </h3>
                          {project.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <MapPin className="h-4 w-4" />
                              <span>{project.location}</span>
                            </div>
                          )}
                          <SanitizedHtml
                            html={project.description}
                            className="text-sm text-gray-600 line-clamp-3 mb-4 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1 [&_th]:bg-gray-50 [&_table]:border-collapse [&_table]:w-full"
                          />
                          {project.completionDate && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Completed:{" "}
                                {new Date(
                                  project.completionDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                            <span>View Project</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                    >
                      Load More Projects
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        S.N
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Project Title
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Sector
                      </th>
                      <th
                        onClick={() =>
                          setFySortOrder((prev) =>
                            prev === "desc" ? "asc" : "desc",
                          )
                        }
                        className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          Fiscal Year
                          {fySortOrder === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUp className="h-3 w-3" />
                          )}
                        </div>
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map((project, index) => (
                      <tr
                        key={project.id}
                        className="hover:bg-cyan-50/60 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {project.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {project.description}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {clients.find((c) => c.id === project.clientId)
                            ?.name || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {project.sector || "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                          {project.fiscalYear || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to={`/projects/${project.slug}`}
                            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:gap-2 transition-all"
                          >
                            View <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Project Gallery</h2>
              <p className="text-gray-600">
                A glimpse into our work and achievements
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.slice(0, 6).map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow group"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-semibold">{image.title}</h3>
                      <p className="text-xs text-gray-300">{image.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why IPTM Nepal */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From feasibility to handover, we bring technical precision and
              local expertise to every project we undertake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyIptmNepal.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-100 p-3 rounded-full w-fit mb-4">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-xl mb-8 text-brand-50">
            Let's collaborate to turn your vision into reality
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
