import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router";
import { useContent } from "../contexts/ContentContext";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { SanitizedHtml } from "../components/ui/sanitized-html";
import { PortfolioFilters as PortfolioFiltersComponent } from "../components/portfolio/PortfolioFilters";
import { PortfolioFiltersState, PortfolioStatus } from "../../types/portfolio.types";
import { formatBSDate } from "../../utils/nepaliDate";
import {
  getMillisecondsUntilNepalMidnight,
  getTrainingStatus,
  sortByStartDateDesc,
} from "../../services/portfolio.service";

interface TrainingProps {
  pageVariant?: "training" | "events-workshops";
  trainingPage?: "upcoming" | "ongoing" | "completed" | "international";
}

const trainingPages = [
  { path: "/training/upcoming", label: "Upcoming Training", page: "upcoming" },
  { path: "/training/ongoing", label: "Ongoing Training", page: "ongoing" },
  { path: "/training/completed", label: "Completed Training", page: "completed" },
  { path: "/training/international", label: "International Training", page: "international" },
] as const;

const trainingStatusLabels: Record<PortfolioStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

const trainingStatusStyles: Record<PortfolioStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
};

export function Training({
  pageVariant = "training",
  trainingPage = "upcoming",
}: TrainingProps) {
  const isEventsWorkshopsPage = pageVariant === "events-workshops";
  const eventDetailsPath = isEventsWorkshopsPage
    ? "/events-workshops"
    : "/training";
  const [now, setNow] = useState(() => new Date());
  const { events, portfolio, clients, pageHeroImages } = useContent();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: "all",
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setNow(new Date()),
      getMillisecondsUntilNepalMidnight(now),
    );
    return () => window.clearTimeout(timer);
  }, [now]);

  const trainingItems = [
    ...(isEventsWorkshopsPage ? events : []).map((event) => ({
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
      mode: undefined as "online" | "physical" | undefined,
      platform: undefined as string | undefined,
      venue: undefined as string | undefined,
      address: undefined as string | undefined,
      registerLink: undefined as string | undefined,
      sector: undefined as string | undefined,
      fiscalYear: undefined as string | undefined,
      clientId: undefined as string | undefined,
      status: undefined as PortfolioStatus | undefined,
      isInternationalTraining: false,
    })),
    ...portfolio
      .filter((item) =>
        item.type === (isEventsWorkshopsPage ? "project" : "training"),
      )
      .map((item) => ({
        id: `portfolio-${item.id}`,
        title: item.title,
        description: item.shortDescription,
        slug: item.slug,
        type:
          item.type === "project"
            ? item.projectType || "Event / Workshop"
            : item.trainingType || "Training",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        duration: "Program",
        topics: [
          item.sector,
          clients.find((c) => c.id === item.clientId)?.name,
          item.venue,
          item.address || item.location,
        ].filter(Boolean) as string[],
        imageUrl: item.featuredImage,
        mode: item.mode === "online" ? "online" as const : "physical" as const,
        platform: item.platform,
        venue: item.venue,
        address: item.address || item.location,
        registerLink: item.registerLink,
        location: item.mode === "online"
          ? item.platform
            ? `Online · ${item.platform}`
            : "Online"
          : [item.venue, item.address || item.location]
              .filter(Boolean)
              .join(", ") ||
            clients.find((c) => c.id === item.clientId)?.name ||
            "",
        sector: item.sector,
        fiscalYear: item.fiscalYear,
        clientId: item.clientId,
        status: item.type === "training"
          ? getTrainingStatus(item.startDate, item.endDate, now)
          : undefined,
        isInternationalTraining: item.isInternationalTraining === true,
      })),
  ];

  const pageItems = isEventsWorkshopsPage
    ? trainingItems
    : trainingItems.filter((item) => {
        if (trainingPage === "international") {
          return item.isInternationalTraining;
        }
        return item.status === trainingPage;
      });

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

  const filteredItems = sortByStartDateDesc(
    pageItems.filter((item) => {
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
    }),
  );

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
              {isEventsWorkshopsPage
                ? "Events & Workshops"
                : trainingPages.find((page) => page.page === trainingPage)?.label}
            </h1>
            <p className="text-xl text-brand-50 max-w-3xl">
              {isEventsWorkshopsPage
                ? "Discover events, workshops, seminars, and learning programs organized by IPTM Nepal."
                : trainingPage === "international"
                  ? "Explore IPTM Nepal's international training programs."
                  : `Explore ${trainingStatusLabels[trainingPage]} programs and professional development opportunities organized by IPTM Nepal.`}
            </p>
            <div className="mt-8">
              <p className="text-3xl font-bold">{pageItems.length}+</p>
              <p className="mt-1 text-sm text-brand-100">
                {isEventsWorkshopsPage
                  ? "Events & Workshops"
                  : trainingPages.find((page) => page.page === trainingPage)?.label}
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
                : trainingPages.find((page) => page.page === trainingPage)?.label}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {isEventsWorkshopsPage
                ? "Explore the events, workshops, seminars, and learning programs organized by IPTM Nepal."
                : trainingPage === "international"
                  ? "International programs, regardless of their current schedule."
                  : `Training programs currently ${trainingPage}.`}
            </p>
          </div>

          {!isEventsWorkshopsPage && (
            <nav
              aria-label="Training categories"
              className="mb-8 flex flex-wrap justify-center gap-2"
            >
              {trainingPages.map((page) => (
                <Link
                  key={page.page}
                  to={page.path}
                  aria-current={trainingPage === page.page ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    trainingPage === page.page
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Filters */}
          <PortfolioFiltersComponent
            filters={filters}
            filterValues={filterValues}
            clients={clients}
            pagination={{
              visibleCount: filteredItems.length,
              filteredCount: pageItems.length,
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
                      : `No ${trainingPage} training programs match the selected filters.`}
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
                    : `No ${trainingPage} training programs are available at the moment. Check back soon!`}
                </p>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {filteredItems.map((event) => (
                <div key={event.id} className="h-full">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full group">
                    <Link
                      to={`${eventDetailsPath}/${event.slug}`}
                      className="flex flex-1 flex-col cursor-pointer"
                    >
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
                      {/* <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 text-white">
                          {event.type}
                        </span>
                      </div> */}
                    </div>
                    <CardContent className="pt-6">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {!isEventsWorkshopsPage && (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              event.status
                                ? trainingStatusStyles[event.status]
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {event.status
                              ? trainingStatusLabels[event.status]
                              : "Dates unavailable"}
                          </span>
                        )}
                        {event.isInternationalTraining && (
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                            International
                          </span>
                        )}
                        <span className="px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full font-medium capitalize">
                          {event.mode ? `${event.mode} training` : event.duration}
                        </span>
                        {event.platform && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                            {event.platform}
                          </span>
                        )}
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
                          {formatBSDate(event.startDate)} -{" "}
                          {formatBSDate(event.endDate)}
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
                  </Link>
                  {event.registerLink && (
                    <CardContent className="pt-0">
                      <Button
                        asChild
                        className="w-full bg-brand-600 text-white hover:bg-brand-700"
                      >
                        <a
                          href={event.registerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register
                        </a>
                      </Button>
                    </CardContent>
                  )}
                  </Card>
                </div>
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
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Fiscal Year
                    </th>
                    {!isEventsWorkshopsPage && (
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                        Status
                      </th>
                    )}
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
                      {!isEventsWorkshopsPage && (
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              event.status
                                ? trainingStatusStyles[event.status]
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {event.status
                              ? trainingStatusLabels[event.status]
                              : "Dates unavailable"}
                          </span>
                        </td>
                      )}
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
