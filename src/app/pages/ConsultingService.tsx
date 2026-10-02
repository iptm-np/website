import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  MapPin,
  Users,
  Target,
  BarChart,
  LayoutGrid,
  Table2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { useContent } from "../contexts/ContentContext";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { PortfolioFilters as PortfolioFiltersComponent } from "../components/portfolio/PortfolioFilters";
import { PortfolioFiltersState } from "../../types/portfolio.types";
import { SanitizedHtml } from "../components/ui/sanitized-html";

export function ConsultingService() {
  const { portfolio, clients, pageHeroImages } = useContent();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [fySortOrder, setFySortOrder] = useState<"desc" | "asc">("desc");
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: "all",
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: "",
  });

  const consultingAssignments = portfolio.filter(
    (item) => item.type === "consulting",
  );

  const filterValues = {
    sectors: [
      ...new Set(consultingAssignments.map((a) => a.sector).filter(Boolean)),
    ] as string[],
    fiscalYears: [
      ...new Set(
        consultingAssignments.map((a) => a.fiscalYear).filter(Boolean),
      ),
    ] as string[],
  };

  const updateFilters = (updates: Partial<PortfolioFiltersState>) => {
    setFilters((current) => ({ ...current, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      sector: undefined,
      fiscalYear: undefined,
      client: undefined,
      search: "",
    });
  };

  const hasActiveFilters =
    Boolean(filters.sector) ||
    Boolean(filters.fiscalYear) ||
    Boolean(filters.client) ||
    Boolean(filters.search);

  const filteredAssignments = consultingAssignments
    .filter((item) => {
      const search = (filters.search || "").toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.shortDescription
          .replace(/<[^>]*>/g, "")
          .toLowerCase()
          .includes(search);
      const matchesSector = !filters.sector || item.sector === filters.sector;
      const matchesFiscalYear =
        !filters.fiscalYear || item.fiscalYear === filters.fiscalYear;
      const matchesClient = !filters.client || item.clientId === filters.client;
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

  const isEmpty = filteredAssignments.length === 0;

  const sectors = [
    "Water Supply & Sanitation",
    "Urban Infrastructure",
    "Transportation",
    "Energy & Power",
    "Building & Construction",
    "Industrial Facilities",
    "Special Economic Zones",
    "Institutional Infrastructure",
  ];

  const whyChooseUs = [
    {
      title: "Multidisciplinary Expertise",
      description:
        "Team of qualified engineers, project managers, and technical specialists",
      icon: Users,
    },
    {
      title: "Proven Track Record",
      description: "100+ successful consulting assignments across Nepal",
      icon: BarChart,
    },
    {
      title: "Quality & Compliance",
      description: "Strong understanding of local and international standards",
      icon: CheckCircle,
    },
    {
      title: "Client-Centric Approach",
      description:
        "Tailored solutions focused on client needs and project success",
      icon: Target,
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
        image={pageHeroImages?.consulting}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Consulting Services</h1>
          <p className="text-xl text-brand-50 max-w-3xl">
            Professional engineering and management consulting services to
            deliver excellence across the project lifecycle
          </p>
          <div className="mt-8">
            <p className="text-3xl font-bold">
              {consultingAssignments.length}+
            </p>
            <p className="mt-1 text-sm text-brand-100">
              Consulting Assignments Delivered
            </p>
          </div>
        </div>
        </div>
       
      </PageHeroBackground>

      {/* Section heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Consulting Assignments</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Selected consulting work delivered for institutional and
          infrastructure clients.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioFiltersComponent
          filters={filters}
          filterValues={filterValues}
          clients={clients}
          pagination={{
            visibleCount: filteredAssignments.length,
            filteredCount: consultingAssignments.length,
            page: 1,
            totalPages: 1,
            itemLabel: "assignments",
          }}
          hasActiveFilters={hasActiveFilters}
          isEmpty={isEmpty}
          showTypeFilter={false}
          extraControls={viewToggle}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
          onDownloadCsv={() => {}}
        />
      </div>

      {/* Assignments */}
      {consultingAssignments.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isEmpty ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No assignments match the selected filters.
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAssignments.map((assignment) => (
                  <Link
                    key={assignment.id}
                    to={`/consulting/${assignment.slug}`}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group">
                      <div className="relative overflow-hidden">
                        {assignment.featuredImage ? (
                          <img
                            src={assignment.featuredImage}
                            alt={assignment.title}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-64 bg-gradient-to-br from-brand-600 via-brand-500 to-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white capitalize">
                            {assignment.status || "completed"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="pt-6">
                        <div className="mb-3">
                          <span className="px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full font-medium capitalize">
                            {assignment.serviceType || "Consulting"}
                          </span>
                        </div>
                        <h3 className="font-semibold text-xl mb-2 group-hover:text-brand-600 transition-colors">
                          {assignment.title}
                        </h3>
                        {assignment.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{assignment.location}</span>
                          </div>
                        )}
                        <SanitizedHtml
                          html={assignment.shortDescription}
                          className="text-sm text-gray-600 line-clamp-3 mb-4 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1 [&_th]:bg-gray-50 [&_table]:border-collapse [&_table]:w-full"
                        />
                        <div className="text-sm text-gray-500 space-y-1 mb-4">
                          {clients.find((c) => c.id === assignment.clientId)
                            ?.name && (
                            <p>
                              Client:{" "}
                              {
                                clients.find(
                                  (c) => c.id === assignment.clientId,
                                )?.name
                              }
                            </p>
                          )}
                          {assignment.fiscalYear && (
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Fiscal Year: {assignment.fiscalYear}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                          <span>View Assignment</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        S.N
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Assignment Title
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
                    {filteredAssignments.map((assignment, index) => (
                      <tr
                        key={assignment.id}
                        className="hover:bg-cyan-50/60 transition-colors"
                      >
                        <td className="px-5 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">
                            {assignment.title}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {clients.find((c) => c.id === assignment.clientId)
                            ?.name || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-700">
                          {assignment.sector || "-"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                          {assignment.fiscalYear || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            to={`/consulting/${assignment.slug}`}
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
        </section>
      )}

      {/* Sectors We Serve
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sectors We Serve</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our consulting expertise spans multiple sectors and industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.map((sector, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-medium text-gray-700">{sector}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose Our Consulting Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-brand-100 p-3 rounded-full mb-4">
                        <Icon className="h-8 w-8 text-brand-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Our Consulting Approach
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {[
                  {
                    step: "1",
                    label: "Understand",
                    desc: "Deep dive into client requirements, project objectives, and constraints",
                  },
                  {
                    step: "2",
                    label: "Deliver",
                    desc: "Execute with technical precision, quality standards, and professional excellence",
                  },
                  {
                    step: "3",
                    label: "Support",
                    desc: "Ongoing support and capacity building for sustained project success",
                  },
                ].map(({ step, label, desc }) => (
                  <div key={step} className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-brand-600">
                        {step}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{label}</h3>
                    <p className="text-sm text-gray-700">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Professional Consulting Services?
          </h2>
          <p className="text-xl mb-8 text-brand-50">
            Let's discuss how we can support your project with our expertise.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
