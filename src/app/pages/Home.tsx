import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../components/ui/carousel";
import { HomeFaqDisplay } from "./admin/FaqsSection";
import {
  CheckCircle,
  Users,
  Award,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { PublicPortfolioItem, PublicPortfolioType } from "../../types/portfolio.types";
import {
  getMillisecondsUntilNepalMidnight,
  getPublicPortfolioItems,
  getTrainingStatus,
} from "../../services/portfolio.service";
import { SanitizedHtml } from "../components/ui/sanitized-html";
import { format, isValid, parseISO } from "date-fns";
const engineering = new URL("../../imports/og-image.webp", import.meta.url)
  .href;
import { Helmet } from "react-helmet-async";
import { slugify } from "../../utils/slug";
import { formatBSDate } from "../../utils/nepaliDate";

const portfolioTypeLabels: Record<PublicPortfolioType, string> = {
  project: "Events & Workshops",
  training: "Training",
  consulting: "Consulting",
};
const formatTrainingDate = (date: string) => {
  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) return date;

  const formattedDate = formatBSDate(date);
  return formattedDate === date ? format(parsedDate, "MMM d, yyyy") : formattedDate;
};

export function Home() {
  const { clients, portfolio, heroImages } = useContent();
  const [heroApi, setHeroApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const featuredMarqueeRef = useRef<HTMLDivElement | null>(null);
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);
  const featuredGroupRef = useRef<HTMLDivElement | null>(null);
  const featuredPauseUntilRef = useRef(0);
  const featuredHoveredRef = useRef(false);
  const [featuredLoopCopies, setFeaturedLoopCopies] = useState(2);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setNow(new Date()),
      getMillisecondsUntilNepalMidnight(now),
    );

    return () => window.clearTimeout(timeout);
  }, [now]);

  // Auto-play carousel
  useEffect(() => {
    if (!heroApi || heroImages.length <= 1) return;

    const interval = setInterval(() => {
      heroApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [heroApi, heroImages.length]);

  // Track current slide for dot indicators
  useEffect(() => {
    if (!heroApi) return;

    const onSelect = () => {
      setCurrentSlide(heroApi.selectedScrollSnap());
    };

    heroApi.on("select", onSelect);
    onSelect();

    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);

  const upcomingTrainingItems = portfolio
    .filter(
      (item) =>
        item.type === "training" &&
        getTrainingStatus(item.startDate, item.endDate, now) === "upcoming",
    )
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  const featuredPortfolioItems = getPublicPortfolioItems(portfolio)
    .filter((item) => item.featuredWork === true)
    .slice(0, 15);

  useEffect(() => {
    const viewport = featuredMarqueeRef.current;
    const group = featuredGroupRef.current;
    if (!viewport || !group) return;

    const updateCopies = () => {
      const groupWidth = group.getBoundingClientRect().width;
      if (!groupWidth) return;
      setFeaturedLoopCopies(
        Math.max(3, Math.ceil(viewport.clientWidth / groupWidth) + 2),
      );
    };

    updateCopies();
    const observer = new ResizeObserver(updateCopies);
    observer.observe(viewport);
    observer.observe(group);

    return () => observer.disconnect();
  }, [featuredPortfolioItems.length]);

  useEffect(() => {
    const viewport = featuredMarqueeRef.current;
    const group = featuredGroupRef.current;
    if (!viewport || !group) return;

    const groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) return;

    if (viewport.scrollLeft < groupWidth || viewport.scrollLeft >= groupWidth * 2) {
      viewport.scrollLeft = groupWidth;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let previousTimestamp = 0;

    const animate = (timestamp: number) => {
      const elapsed = previousTimestamp ? timestamp - previousTimestamp : 0;
      previousTimestamp = timestamp;

      const currentGroupWidth = group.getBoundingClientRect().width;
      if (currentGroupWidth) {
        while (viewport.scrollLeft >= currentGroupWidth * 2) {
          viewport.scrollLeft -= currentGroupWidth;
        }
        while (viewport.scrollLeft < currentGroupWidth) {
          viewport.scrollLeft += currentGroupWidth;
        }

        if (
          !reducedMotion.matches &&
          !featuredHoveredRef.current &&
          timestamp >= featuredPauseUntilRef.current
        ) {
          viewport.scrollLeft += elapsed * 0.018;
        }
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [featuredLoopCopies, featuredPortfolioItems.length]);

  const pauseFeaturedWork = (duration = 1800) => {
    featuredPauseUntilRef.current = Date.now() + duration;
  };

  const moveFeaturedWork = (direction: -1 | 1) => {
    const track = featuredTrackRef.current;
    const firstGroup = track?.firstElementChild;
    const firstCard = firstGroup?.firstElementChild;
    const nextCard = firstCard?.nextElementSibling;
    if (!track || !firstCard || !nextCard) return;

    pauseFeaturedWork(2500);
    const stepWidth =
      nextCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;
    featuredMarqueeRef.current?.scrollBy({
      left: direction * stepWidth,
      behavior: "smooth",
    });
  };

  const getPortfolioLink = (item: PublicPortfolioItem) => {
    if (item.type === "project") return `/events-workshops/${item.slug}`;
    if (item.type === "training") return `/training/${item.slug}`;
    return `/consulting/${item.slug}`;
  };

  const getClientPortfolioLink = (clientId: string) =>
    `/portfolio?client=${encodeURIComponent(
      clients.find((client) => client.id === clientId)?.slug ||
      slugify(
        clients.find((client) => client.id === clientId)?.name || clientId,
      ),
    )}`;

  return (
    <>
      <Helmet>
        {/* Basic meta tags — highest SEO priority */}
        <title>
          IPTM Nepal | Capacity Building Company in Nepal | Training Solutions
        </title>
        <meta
          name="description"
          content="IPTM Nepal is a Nepal-based capacity building organization specializing in infrastructure development, project management, water supply engineering, structural design, and technical training solutions."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="capacity building Nepal, infrastructure development Nepal, project management Nepal, structural engineering Nepal, water supply engineering Nepal, DPR preparation Nepal"
        />
        <link rel="canonical" href="https://www.iptmnepal.com" />

        {/* Open Graph — for social sharing previews */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.iptmnepal.com" />
        <meta
          property="og:title"
          content="IPTM Nepal | Capacity Building Company in Nepal | Training Solutions"
        />
        <meta
          property="og:description"
          content="Expert capacity building and training solutions across Nepal."
        />
        <meta
          property="og:image"
          content="https://www.iptmnepal.com/og-image.webp"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CapacityBuildingOrganization",
            name: "IPTM Nepal",
            url: "https://www.iptmnepal.com",
            logo: "https://www.iptmnepal.com/iptm-nepal_logo.webp",
            image: "https://www.iptmnepal.com/og-image.webp",
            description:
              "Capacity building and training solutions provider in Nepal.",
            telephone: "+977-9841531682",
            email: "iptmnepal@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Tripureshwor",
              addressLocality: "Kathmandu",
              addressRegion: "Bagmati Province",
              postalCode: "44600",
              addressCountry: "NP",
            },
            areaServed: "Nepal",
            sameAs: [
              // add your LinkedIn, Facebook etc.
            ],
          })}
        </script>
      </Helmet>

      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center text-white overflow-hidden">
          {heroImages.length > 0 ? (
            /* Dynamic Carousel */
            <>
              <Carousel
                className="absolute inset-0"
                opts={{ loop: true, align: "start" }}
                setApi={setHeroApi}
              >
                <CarouselContent className="-ml-0">
                  {heroImages
                    .sort((a, b) => a.order - b.order)
                    .map((image) => (
                      <CarouselItem key={image.id} className="pl-0 basis-full">
                        <div className="relative w-full h-screen">
                          <img
                            src={image.url}
                            alt="Hero slide"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 z-[1]" />

              {/* Navigation Arrows */}
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={() => heroApi?.scrollPrev()}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[3] w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/30"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() => heroApi?.scrollNext()}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[3] w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/30"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {heroImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => heroApi?.scrollTo(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer border-0 ${currentSlide === index
                          ? "bg-white scale-110"
                          : "bg-white/40 hover:bg-white/60"
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Fallback: Static hero image */
            <div className="absolute inset-0">
              <img
                src={engineering}
                alt="Infrastructure Development"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Professional Training & Capacity Building in Nepal
              </h1>

              <p className="text-lg md:text-xl mb-6 text-gray-100">
               IPTM Nepal is a professional training and consulting institute providing expert-led training, institutional capacity building, research, and consulting services for professionals and organizations across Nepal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/portfolio">
                  <Button
                    size="lg"
                    className="
        w-full sm:w-auto
        px-6 py-2
        rounded-full
        bg-transparent
        hover:bg-white/10
        text-white
        border border-white/30
        transition-all duration-300
        backdrop-blur-sm
        cursor-pointer
      "
                  >
                    Explore Our Portfolio
                  </Button>
                </Link>
                 <Link to="/contact">
                  <Button
                    size="lg"
                    className="
        w-full sm:w-auto
        px-6 py-2
        rounded-full
        bg-white/10
        hover:bg-white/20
        text-white
        border border-white/30
        transition-all duration-300
        backdrop-blur-sm
        cursor-pointer
      "
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
{upcomingTrainingItems.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
                  Learn with IPTM Nepal
                </p>
                <h2 className="mb-3 text-3xl font-bold text-gray-900">
                  Upcoming Training
                </h2>
                <p className="mx-auto max-w-2xl text-gray-600">
                  Build practical skills and strengthen your professional
                  expertise with our upcoming programs.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingTrainingItems.map((training) => (
                  <Card
                    key={training.id}
                    className="h-full overflow-hidden border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <img
                      src={training.featuredImage || engineering}
                      alt={training.title}
                      className="h-52 w-full object-cover"
                    />
                    <CardContent className="flex h-full flex-col p-6">
                      <h3 className="mb-3 text-xl font-semibold text-gray-900">
                        {training.title}
                      </h3>

                      <div className="mb-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-start gap-2">
                          <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand-600" />
                          <span>
                            {training.startDate
                              ? formatTrainingDate(training.startDate)
                              : "Date to be announced"}
                            {" – "}
                            {training.endDate
                              ? formatTrainingDate(training.endDate)
                              : "Date to be announced"}
                          </span>
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" />
                          <span>
                            {training.mode === "online"
                              ? `Online${training.platform ? ` · ${training.platform}` : ""}`
                              : [training.venue, training.address || training.location]
                                  .filter(Boolean)
                                  .join(", ") || "Location to be announced"}
                          </span>
                        </p>
                      </div>

                      <SanitizedHtml
                        html={training.shortDescription}
                        className="mb-6 line-clamp-3 text-sm text-gray-600 [&_p]:mb-1 [&_a]:text-brand-600 [&_a]:underline [&_strong]:font-semibold [&_em]:italic"
                      />

                      <Link
                        to={`/training/${training.slug}`}
                        className="mt-auto"
                      >
                        <Button className="w-full bg-brand-600 text-white hover:bg-brand-700">
                          View Details
                        </Button>
                      </Link>
                      {training.registerLink && (
                        <a
                          href={training.registerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-brand-600 px-4 py-2 font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                        >
                          Register
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/training">
                  <Button variant="outline">View All Training</Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-brand-100 p-3 rounded-full mb-4">
                      <Award className="h-8 w-8 text-brand-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Proven Track Record</h3>
                    <p className="text-sm text-gray-600">
                      100+ successful projects delivered across Nepal
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
                      Multidisciplinary Expertise
                    </h3>
                    <p className="text-sm text-gray-600">
                      All engineering and management services under one roof
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-brand-100 p-3 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-brand-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality Standards</h3>
                    <p className="text-sm text-gray-600">
                      Strong understanding of local and international standards
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-brand-100 p-3 rounded-full mb-4">
                      <Lightbulb className="h-8 w-8 text-brand-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Client Satisfaction</h3>
                    <p className="text-sm text-gray-600">
                      Commitment to quality, timeliness, and client satisfaction
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Work */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
                <p className="text-gray-600">
                  Explore our training, events & workshops and consulting services
                </p>
              </div>
              {featuredPortfolioItems.length > 1 && (
                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <button
                    type="button"
                    onClick={() => moveFeaturedWork(-1)}
                    aria-label="Previous featured work"
                    title="Previous featured work"
                    className="flex size-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFeaturedWork(1)}
                    aria-label="Next featured work"
                    title="Next featured work"
                    className="flex size-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>

            {featuredPortfolioItems.length > 0 ? (
              <div
                ref={featuredMarqueeRef}
                className="featured-work-viewport overflow-x-auto"
                onMouseEnter={() => {
                  featuredHoveredRef.current = true;
                }}
                onMouseLeave={() => {
                  featuredHoveredRef.current = false;
                  pauseFeaturedWork();
                }}
                onPointerDown={() => pauseFeaturedWork()}
                onTouchStart={() => pauseFeaturedWork()}
                onTouchMove={() => pauseFeaturedWork()}
                onPointerMove={(event) => {
                  if (event.buttons > 0) pauseFeaturedWork();
                }}
                onWheel={() => pauseFeaturedWork()}
                onKeyDown={() => pauseFeaturedWork()}
                tabIndex={0}
                aria-label="Featured work. Scroll horizontally to browse."
              >
                <div
                  ref={featuredTrackRef}
                  className="flex w-max"
                >
                  {Array.from({ length: featuredLoopCopies }, (_, copy) => (
                    <div
                      key={`featured-copy-${copy}`}
                      ref={copy === 0 ? featuredGroupRef : undefined}
                      className="flex shrink-0 gap-8 pr-8"
                      aria-hidden={copy > 0}
                      inert={copy > 0}
                    >
                      {featuredPortfolioItems.map((item) => (
                        <Link
                          key={`${copy}-${item.id}`}
                          to={getPortfolioLink(item)}
                          tabIndex={copy === 0 ? undefined : -1}
                          className="group w-[85vw] max-w-sm shrink-0 md:w-[38vw] lg:w-[30vw]"
                        >
                          <Card className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl">
                            <div className="overflow-hidden">
                              {item.featuredImage ? (
                                <img
                                  src={item.featuredImage}
                                  alt={item.title}
                                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="h-48 w-full bg-gradient-to-br from-brand-600 via-brand-500 to-slate-800" />
                              )}
                            </div>

                            <CardContent className="pt-6">
                              <div className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-600">
                                {item.sector || portfolioTypeLabels[item.type]}
                              </div>

                              <h3 className="mb-2 font-semibold transition-colors group-hover:text-brand-600">
                                {item.title}
                              </h3>

                              <SanitizedHtml
                                html={item.shortDescription}
                                className="line-clamp-3 text-sm text-gray-600 [&_p]:mb-1 [&_a]:text-brand-600 [&_a]:underline [&_strong]:font-semibold [&_em]:italic [&_table]:my-1 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-xs [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1 [&_td]:text-xs"
                              />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600">No featured work available.</p>
            )}

            <div className="text-center mt-8">
              <Link to="/portfolio">
                <Button variant="outline">View All Portfolio</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        {clients.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Valued Clients</h2>
                <p className="text-gray-600">
                  Trusted by leading organizations across Nepal
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
                {clients.map((client) => (
                  <Link
                    key={client.id}
                    to={getClientPortfolioLink(client.id)}
                    className="flex items-center justify-center p-6 bg-white rounded-lg hover:shadow-lg transition-shadow duration-200"
                  >
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <HomeFaqDisplay />

        {/* CTA Section */}
        <section className="py-16 bg-brand-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>

            <p className="text-xl mb-8 text-brand-50">
              Let's work together to bring your engineering vision to life.
            </p>

            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Contact Us Today
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
