import { useParams, Link } from "react-router";
import { useContent } from "../contexts/ContentContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Calendar,
  ArrowLeft,
  MapPin,
  Ruler,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { PortfolioItemDetail } from "./PortfolioItemDetail";
import { SanitizedHtml } from "../components/ui/sanitized-html";

export function ProjectDetail() {
  const { slug } = useParams();
  const { projects, clients } = useContent();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <PortfolioItemDetail expectedType="project" />;
  }

  // Get related projects (same type or category, excluding current)
  const relatedProjects = projects
    .filter(
      (p) =>
        p.id !== project.id &&
        (p.projectType === project.projectType ||
          p.category === project.category),
    )
    .slice(0, 3);

  const clientName =
    clients.find((c) => c.id === project.clientId)?.name || project.clientName;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-900">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
            <Link to="/projects">
              <Button variant="secondary" size="sm" className="mb-6 w-fit">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-500 text-white rounded-full text-sm font-medium">
                {project.projectType}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.status === "ongoing"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {project.status === "ongoing" ? "Ongoing" : "Completed"}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">
              {project.title}
            </h1>
            <SanitizedHtml
              html={project.description}
              className="text-xl text-gray-200 max-w-3xl [&_a]:text-cyan-300 [&_a]:underline [&_strong]:text-white [&_em]:text-gray-200 [&_table]:text-sm [&_th]:text-gray-200 [&_td]:text-gray-200 [&_th]:border-gray-600 [&_td]:border-gray-600 [&_p]:mb-2"
            />
          </div>
        </div>
      </section>

      {/* Quick Info Grid */}

      {(clientName ||
        project.location ||
        project.area ||
        project.completionDate) && (
        <section className="py-12 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clientName && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Client</p>
                  <p className="font-semibold text-lg">{clientName}</p>
                </div>
              )}
              {project.location && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    <p className="font-semibold text-lg">{project.location}</p>
                  </div>
                </div>
              )}
              {project.area && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Project Area</p>
                  <div className="flex items-center justify-center gap-1">
                    <Ruler className="h-4 w-4 text-brand-600" />
                    <p className="font-semibold text-lg">{project.area}</p>
                  </div>
                </div>
              )}
              {project.completionDate && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4 text-brand-600" />
                    <p className="font-semibold text-lg">
                      {new Date(project.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project Overview */}
      {project.overview && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto min-w-0 overflow-hidden">
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <SanitizedHtml
                html={project.overview || ""}
                className="text-gray-700 leading-relaxed text-lg"
              />

              {project.servicesProvided &&
                project.servicesProvided.filter(Boolean).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Services Provided
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.servicesProvided
                        .filter(Boolean)
                        .map((service, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{service}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}

      {/* Project Gallery */}
      {project.galleryImages &&
        project.galleryImages.filter(Boolean).length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.galleryImages
                  .filter(Boolean)
                  .map((imageUrl, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

      {/* Results Section */}
      {project.result && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Results & Impact</h2>
              <div className="bg-brand-50 border-l-4 border-brand-600 p-6 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {project.result}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {project.keyFeatures &&
        project.keyFeatures.filter(Boolean).length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.keyFeatures.filter(Boolean).map((feature, index) => (
                    <Card
                      key={index}
                      className="border-2 hover:border-brand-300 transition-colors"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-brand-100 rounded-full p-2 flex-shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-brand-600" />
                          </div>
                          <p className="text-gray-700 pt-1">{feature}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Before & After */}
      {(project.beforeImage || project.afterImage) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Before & After
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.beforeImage && (
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold z-10">
                    Before
                  </div>
                  <img
                    src={project.beforeImage}
                    alt="Before"
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              {project.afterImage && (
                <div className="relative">
                  <div className="absolute top-4 left-4 bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold z-10">
                    After
                  </div>
                  <img
                    src={project.afterImage}
                    alt="After"
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Client Testimonial */}
      {project.clientTestimonial && (
        <section className="py-16 bg-brand-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <svg
                className="w-12 h-12 mx-auto text-brand-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-xl md:text-2xl italic leading-relaxed mb-6">
              "{project.clientTestimonial}"
            </p>
            {project.clientName && (
              <p className="font-semibold text-brand-100">
                — {project.clientName}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  to={`/projects/${relatedProject.slug}`}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full group">
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProject.imageUrl}
                        alt={relatedProject.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <span className="px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full font-medium capitalize">
                        {relatedProject.projectType}
                      </span>
                      <h3 className="font-semibold text-lg mt-3 mb-2 group-hover:text-brand-600 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <SanitizedHtml
                        html={relatedProject.description}
                        className="text-sm text-gray-600 line-clamp-2 mb-3 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-1 [&_td]:px-1 [&_th]:py-0.5 [&_td]:py-0.5 [&_th]:bg-gray-50 [&_table]:border-collapse"
                      />
                      <div className="flex items-center text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                        <span>View Project</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {project.faqs && project.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {project.faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    className="w-full text-left"
                  >
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-lg pr-8">
                          {faq.question}
                        </h3>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-brand-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      {expandedFaq === index && (
                        <p className="text-gray-600 mt-4 leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </CardContent>
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 text-brand-50">
            Let our experienced team bring your vision to life with the same
            dedication and expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="secondary">
                Get in Touch
              </Button>
            </Link>
            <Link to="/projects">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                View More Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
