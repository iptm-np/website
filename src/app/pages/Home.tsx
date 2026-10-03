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
import { CheckCircle, Users, Award, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { PortfolioItem, PortfolioType } from "../../types/portfolio.types";
import { SanitizedHtml } from "../components/ui/sanitized-html";
const engineering = new URL("../../imports/engineering.webp", import.meta.url)
  .href;
import { Helmet } from "react-helmet-async";
import { slugify } from "../../utils/slug";

const portfolioTypeLabels: Record<PortfolioType, string> = {
  project: "Project",
  consulting: "Consulting",
  training: "Training",
};
const FEATURED_WORK_SCROLL_DURATION = 80_000;

export function Home() {
  const { clients, portfolio, heroImages } = useContent();
  const [heroApi, setHeroApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredWorkPaused, setFeaturedWorkPaused] = useState(false);
  const featuredMarqueeRef = useRef<HTMLDivElement | null>(null);
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);

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

  const featuredPortfolioItems = portfolio.filter((item) => item.displayOnHome);
  const featuredItemsPerLoop =
    featuredPortfolioItems.length > 0
      ? Math.max(1, Math.ceil(4 / featuredPortfolioItems.length))
      : 1;
  const featuredLoopItems = Array.from(
    { length: featuredItemsPerLoop },
    () => featuredPortfolioItems,
  ).flat();

  const moveFeaturedWork = (direction: -1 | 1) => {
    const track = featuredTrackRef.current;
    const group = track?.firstElementChild;
    const firstCard = group?.firstElementChild;
    const nextCard = firstCard?.nextElementSibling;
    if (!track || !group || !firstCard || !nextCard) return;

    const stepWidth =
      nextCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;
    const animation = track.getAnimations()[0];

    if (!animation) {
      featuredMarqueeRef.current?.scrollBy({ left: direction * stepWidth });
      return;
    }

    const stepDuration =
      (FEATURED_WORK_SCROLL_DURATION * stepWidth) /
      group.getBoundingClientRect().width;
    const currentTime = Number(animation.currentTime ?? 0);
    animation.currentTime =
      ((currentTime + direction * stepDuration) % FEATURED_WORK_SCROLL_DURATION +
        FEATURED_WORK_SCROLL_DURATION) %
      FEATURED_WORK_SCROLL_DURATION;
  };

  const getPortfolioLink = (item: PortfolioItem) => {
    if (item.type === "project") return `/projects/${item.slug}`;
    if (item.type === "consulting") return `/consulting/${item.slug}`;
    return `/training/${item.slug}`;
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
          content="capacity building Nepal, infrastructure development Nepal, project management Nepal, structural engineering Nepal, water supply engineering Nepal, DPR consultant Nepal"
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
                alt="Engineering Consultancy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Capacity Building Company in Nepal
              </h1>

              <p className="text-lg md:text-xl mb-6 text-gray-100">
                IPTM Nepal delivers expert capacity building, project support, and industry-driven
                training solutions.
              </p>

              <p className="text-lg md:text-xl mb-8 text-gray-200">
                We empower organizations and professionals through **practical training, expert consultancy, and capacity-building solutions**, delivered with the guidance of **experienced expert trainers** to drive professional growth, organizational performance, and lasting impact.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about">
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
                    Learn More
                  </Button>
                </Link>

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
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

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
          <style>{`
            @keyframes featured-work-scroll {
              to { transform: translateX(-50%); }
            }
            .featured-work-track {
              animation: featured-work-scroll ${FEATURED_WORK_SCROLL_DURATION / 1000}s linear infinite;
            }
            .featured-work-track.featured-work-paused {
              animation-play-state: paused;
            }
            .featured-work-marquee:hover .featured-work-track,
            .featured-work-marquee:focus-within .featured-work-track {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .featured-work-marquee { overflow-x: auto; }
              .featured-work-track { animation: none; }
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
                <p className="text-gray-600">
                  Explore our featured projects, consulting services, and training.
                </p>
              </div>
              <div
                className="flex items-center gap-2 self-center sm:self-auto"
                onMouseLeave={() => setFeaturedWorkPaused(false)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setFeaturedWorkPaused(false);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedWorkPaused(true);
                    moveFeaturedWork(-1);
                  }}
                  aria-label="Previous featured work"
                  title="Previous featured work"
                  className="flex size-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedWorkPaused(true);
                    moveFeaturedWork(1);
                  }}
                  aria-label="Next featured work"
                  title="Next featured work"
                  className="flex size-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {featuredPortfolioItems.length > 0 ? (
              <div
                ref={featuredMarqueeRef}
                className="featured-work-marquee overflow-hidden"
              >
                <div
                  ref={featuredTrackRef}
                  className={`featured-work-track flex w-max${featuredWorkPaused ? " featured-work-paused" : ""
                    }`}
                >
                  {[0, 1].map((copy) => (
                    <div
                      key={copy}
                      className="flex shrink-0 gap-8 pr-8"
                      aria-hidden={copy === 1}
                      inert={copy === 1}
                    >
                      {featuredLoopItems.map((item, index) => (
                        <Link
                          key={`${copy}-${item.id}-${index}`}
                          to={getPortfolioLink(item)}
                          className="group w-[85vw] max-w-sm shrink-0 md:w-[38vw] lg:w-[30vw]"
                          tabIndex={copy === 1 ? -1 : undefined}
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
