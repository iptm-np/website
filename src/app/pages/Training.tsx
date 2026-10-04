import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  CheckCircle,
  Calendar,
  GraduationCap,
  MapPin,
  LayoutGrid,
  Table2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Link } from "react-router";
import { useContent } from "../contexts/ContentContext";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { SanitizedHtml } from "../components/ui/sanitized-html";
import { PortfolioFilters as PortfolioFiltersComponent } from "../components/portfolio/PortfolioFilters";
import { PortfolioFiltersState } from "../../types/portfolio.types";

interface TrainingProps {
  pageVariant?: "training" | "events-workshops";
}

export function Training({ pageVariant = "training" }: TrainingProps) {
  const isEventsWorkshopsPage = pageVariant === "events-workshops";
  const eventDetailsPath = isEventsWorkshopsPage
    ? "/events-workshops"
    : "/training";
  const { events, portfolio, clients, pageHeroImages } = useContent();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [fySortOrder, setFySortOrder] = useState<"desc" | "asc">("desc");
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: "all",
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: "",
  });

  const trainingItems = [
    ...events.map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      description: event.description,
      slug: event.slug,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      duration: event.duration,
      topics: event.topics,
      imageUrl: "",
      location: "",
      sector: undefined as string | undefined,
      fiscalYear: undefined as string | undefined,
      clientId: undefined as string | undefined,
    })),
    ...portfolio
      .filter((item) => item.type === "training")
      .map((item) => ({
        id: `portfolio-${item.id}`,
        title: item.title,
        description: item.shortDescription,
        slug: item.slug,
        type: item.trainingType || "Training",
        startDate: item.startDate || item.fiscalYear || "",
        endDate: item.endDate || "",
        duration: item.mode ? `${item.mode} mode` : "Program",
        topics: [
          item.sector,
          clients.find((c) => c.id === item.clientId)?.name,
          item.location,
        ].filter(Boolean) as string[],
        imageUrl: item.featuredImage,
        location:
          item.location ||
          clients.find((c) => c.id === item.clientId)?.name ||
          "",
        sector: item.sector,
        fiscalYear: item.fiscalYear,
        clientId: item.clientId,
      })),
  ];

  const filterValues = {
    sectors: [
      ...new Set(trainingItems.map((t) => t.sector).filter(Boolean)),
    ] as string[],
    fiscalYears: [
      ...new Set(trainingItems.map((t) => t.fiscalYear).filter(Boolean)),
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

  const filteredItems = trainingItems
    .filter((item) => {
      const search = (filters.search || "").toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
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

  const isEmpty = filteredItems.length === 0;

  return (
    <div>
      {/* Hero */}
      <PageHeroBackground
        image={
          isEventsWorkshopsPage
            ? pageHeroImages?.projects
            : pageHeroImages?.training
        }
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {isEventsWorkshopsPage ? "Events & Workshops" : "Training"}
            </h1>
            <p className="text-xl text-brand-50 max-w-3xl">
              {isEventsWorkshopsPage
                ? "Discover events, workshops, seminars, and learning programs organized by IPTM Nepal."
                : "Professional development programs, workshops, and training sessions organized by IPTM Nepal to enhance skills and knowledge in various sectors."}
            </p>
            <div className="mt-8">
              <p className="text-3xl font-bold">{trainingItems.length}+</p>
              <p className="mt-1 text-sm text-brand-100">
                {isEventsWorkshopsPage
                  ? "Events & Workshops"
                  : "Training Programs Conducted"}
              </p>
            </div>
          </div>
        </div>

      </PageHeroBackground>

      {/* Programs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {isEventsWorkshopsPage
                ? "Events & Workshops"
                : "Training & Capacity Building Programs"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isEventsWorkshopsPage
                ? "Explore the events, workshops, seminars, and learning programs organized by IPTM Nepal."
                : "Explore the training programs, workshops, and professional development courses organized and delivered by IPTM Nepal across various sectors"}
            </p>
          </div>

          {/* Filters */}
          <PortfolioFiltersComponent
            filters={filters}
            filterValues={filterValues}
            clients={clients}
            pagination={{
              visibleCount: filteredItems.length,
              filteredCount: trainingItems.length,
              page: 1,
              totalPages: 1,
              itemLabel: isEventsWorkshopsPage
                ? "events and workshops"
                : "programs",
            }}
            hasActiveFilters={hasActiveFilters}
            isEmpty={isEmpty}
            showTypeFilter={false}
            extraControls={
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
            }
            onUpdateFilters={updateFilters}
            onClearFilters={clearFilters}
            onDownloadCsv={() => { }}
          />

          {/* Content */}
          {isEmpty ? (
            <div className="text-center py-12 mt-6">
              {hasActiveFilters ? (
                <>
                  <p className="text-gray-500">
                    {isEventsWorkshopsPage
                      ? "No events or workshops match the selected filters."
                      : "No training programs match the selected filters."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <p className="text-gray-500">
                  {isEventsWorkshopsPage
                    ? "No events or workshops are available at the moment. Check back soon!"
                    : "No training programs available at the moment. Check back soon!"}
                </p>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {filteredItems.map((event) => (
                <Link key={event.id} to={`${eventDetailsPath}/${event.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group">
                    <div className="relative overflow-hidden">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-64 bg-gradient-to-br from-brand-600 via-brand-500 to-slate-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full font-medium capitalize">
                          {event.duration}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-brand-600 transition-colors">
                        {event.title}
                      </h3>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <SanitizedHtml
                        html={event.description}
                        className="text-sm text-gray-600 line-clamp-3 mb-4 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1 [&_th]:bg-gray-50 [&_table]:border-collapse [&_table]:w-full"
                      />
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {event.startDate} - {event.endDate}
                        </span>
                      </div>
                      {event.topics.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {event.topics.slice(0, 3).map((topic, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                        <span>
                          {isEventsWorkshopsPage ? "View Event" : "View Training"}
                        </span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm mt-8">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      S.N
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      {isEventsWorkshopsPage
                        ? "Event / Workshop"
                        : "Training Title"}
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
                  {filteredItems.map((event, index) => (
                    <tr
                      key={event.id}
                      className="hover:bg-cyan-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {event.title}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {event.sector || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                        {event.fiscalYear || "-"}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`${eventDetailsPath}/${event.slug}`}
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

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {isEventsWorkshopsPage
                ? "Why Join Our Events & Workshops"
                : "Why Train With Us"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isEventsWorkshopsPage
                ? "Our events and workshops bring professionals together to share practical knowledge and ideas."
                : "Our training programs are designed by industry experts to provide practical, real-world knowledge"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Instructors</h3>
                  <p className="text-sm text-gray-600">
                    Learn directly from experienced professionals working in
                    real-world infrastructure and projects.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <Users className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Practical Hands-on Training
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gain real project experience through applied workshops and
                    field-based learning.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <GraduationCap className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-2">
                    Comprehensive Learning Support
                  </h3>
                  <p className="text-sm text-gray-600">
                    Well-structured programs with all necessary resources made
                    easily accessible to participants.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-brand-100 p-3 rounded-full mb-4">
                    <Award className="h-8 w-8 text-brand-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Certification</h3>
                  <p className="text-sm text-gray-600">
                    Receive industry-recognized certificates upon completion
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isEventsWorkshopsPage
              ? "Join an Upcoming Event"
              : "Ready to Advance Your Career?"}
          </h2>
          <p className="text-xl mb-8 text-brand-50 max-w-2xl mx-auto">
            {isEventsWorkshopsPage
              ? "Join our events and workshops to build knowledge, exchange ideas, and connect with professionals."
              : "Join our training programs and gain the skills you need to excel in the engineering industry."}
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact Us for More Information
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
