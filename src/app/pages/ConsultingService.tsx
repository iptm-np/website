import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart,
  Calendar,
  CheckCircle,
  LayoutGrid,
  MapPin,
  Table2,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PortfolioFilters as PortfolioFiltersComponent } from "../components/portfolio/PortfolioFilters";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { SanitizedHtml } from "../components/ui/sanitized-html";
import { useContent } from "../contexts/ContentContext";
import { PortfolioFiltersState } from "../../types/portfolio.types";
import {
  filterPortfolioItems,
  getUniqueFilterValues,
  sortByStartDateDesc,
} from "../../services/portfolio.service";

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
    description:
      "Strong understanding of local and international standards",
    icon: CheckCircle,
  },
  {
    title: "Client-Centric Approach",
    description:
      "Tailored solutions focused on client needs and project success",
    icon: Target,
  },
];

export function ConsultingService() {
  const { portfolio, clients, pageHeroImages } = useContent();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: "all",
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: "",
  });

  const consultingAssignments = useMemo(
    () => portfolio.filter((item) => item.type === "consulting"),
    [portfolio],
  );
  const filterValues = useMemo(
    () => getUniqueFilterValues(consultingAssignments),
    [consultingAssignments],
  );

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

  const filteredAssignments = useMemo(() => {
    const filtered = filterPortfolioItems(consultingAssignments, filters);
    return sortByStartDateDesc(filtered);
  }, [consultingAssignments, filters]);

  const handleDownloadCsv = () => {
    const escapeCsvValue = (value?: string) =>
      `"${(value || "").replace(/"/g, '""')}"`;
    const rows = [
      ["Assignment", "Type", "Fiscal Year", "Client", "Sector"],
      ...filteredAssignments.map((assignment) => [
        assignment.title,
        assignment.serviceType || "Consulting",
        assignment.fiscalYear || "",
        clients.find((client) => client.id === assignment.clientId)?.name || "",
        assignment.sector || "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "iptmNepal-consulting.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isEmpty = filteredAssignments.length === 0;
  const viewToggle = (
    <div className="flex items-center overflow-hidden rounded-md border border-slate-200">
      <button
        type="button"
        onClick={() => setView("grid")}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        className={`p-2 transition-colors ${view === "grid" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setView("table")}
        aria-label="Table view"
        aria-pressed={view === "table"}
        className={`p-2 transition-colors ${view === "table" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
      >
        <Table2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div>
      <PageHeroBackground
        image={pageHeroImages?.consulting || ""}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold">Consulting Services</h1>
          <p className="max-w-3xl text-xl text-brand-50">
            Professional engineering and management consulting services to
            deliver excellence across the project lifecycle.
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
      </PageHeroBackground>

      <div className="mx-auto max-w-7xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold">
          Our Consulting Assignments
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600">
          Selected consulting work delivered for institutional and
          infrastructure clients.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          onDownloadCsv={handleDownloadCsv}
        />
      </div>

      {consultingAssignments.length > 0 ? (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {isEmpty ? (
              <div className="py-12 text-center">
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
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssignments.map((assignment) => {
                  const clientName = clients.find(
                    (client) => client.id === assignment.clientId,
                  )?.name;

                  return (
                    <Link
                      key={assignment.id}
                      to={`/consulting/${assignment.slug}`}
                      className="group h-full"
                    >
                      <Card className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative overflow-hidden">
                          {assignment.featuredImage ? (
                            <img
                              src={assignment.featuredImage}
                              alt={assignment.title}
                              loading="lazy"
                              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-64 bg-gradient-to-br from-brand-600 via-brand-500 to-slate-800" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute right-4 top-4">
                            <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold capitalize text-white">
                              {assignment.status || "completed"}
                            </span>
                          </div>
                        </div>
                        <CardContent className="pt-6">
                          <div className="mb-3">
                            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600">
                              {assignment.serviceType || "Consulting"}
                            </span>
                          </div>
                          <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-brand-600">
                            {assignment.title}
                          </h3>
                          {assignment.location && (
                            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="h-4 w-4" />
                              <span>{assignment.location}</span>
                            </div>
                          )}
                          <SanitizedHtml
                            html={assignment.shortDescription}
                            className="mb-4 line-clamp-3 text-sm text-gray-600 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1"
                          />
                          <div className="mb-4 space-y-1 text-sm text-gray-500">
                            {clientName && <p>Client: {clientName}</p>}
                            {assignment.fiscalYear && (
                              <p className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Fiscal Year: {assignment.fiscalYear}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center text-sm font-medium text-brand-600 transition-all group-hover:gap-2">
                            <span>View Assignment</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Fiscal Year
                      </th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAssignments.map((assignment, index) => (
                      <tr
                        key={assignment.id}
                        className="transition-colors hover:bg-brand-50"
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
                          {clients.find(
                            (client) => client.id === assignment.clientId,
                          )?.name || "-"}
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
                            className="flex items-center gap-1 text-sm font-medium text-brand-600 transition-all hover:gap-2"
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
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-gray-500 sm:px-6 lg:px-8">
          No consulting assignments are available at the moment. Check back
          soon.
        </div>
      )}

      {/* <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Sectors We Serve</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our consulting expertise spans multiple sectors and industries.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {sectors.map((sector) => (
              <Card key={sector}>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-medium text-gray-700">{sector}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Why Choose Our Consulting Services
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ title, description, icon: Icon }) => (
              <Card key={title}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-brand-100 p-3">
                      <Icon className="h-8 w-8 text-brand-600" />
                    </div>
                    <h3 className="mb-2 font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 p-8 md:p-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-3xl font-bold">
                Our Consulting Approach
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    label: "Understand",
                    description:
                      "Deep dive into client requirements, project objectives, and constraints",
                  },
                  {
                    step: "2",
                    label: "Deliver",
                    description:
                      "Execute with technical precision, quality standards, and professional excellence",
                  },
                  {
                    step: "3",
                    label: "Support",
                    description:
                      "Ongoing support and capacity building for sustained project success",
                  },
                ].map(({ step, label, description }) => (
                  <div key={step} className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                      <span className="text-2xl font-bold text-brand-600">
                        {step}
                      </span>
                    </div>
                    <h3 className="mb-2 font-semibold">{label}</h3>
                    <p className="text-sm text-gray-700">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">
            Need Professional Consulting Services?
          </h2>
          <p className="mb-8 text-xl text-brand-50">
            Let&apos;s discuss how we can support your project with our
            expertise.
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
