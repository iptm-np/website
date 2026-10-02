import { useParams, Link } from 'react-router';
import { useContent } from '../contexts/ContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Clock, CheckCircle, ArrowLeft, Tag } from 'lucide-react';
import { PortfolioItemDetail } from './PortfolioItemDetail';
import { SanitizedHtml } from '../components/ui/sanitized-html';

export function EventDetail() {
  const { slug } = useParams();
  const { events } = useContent();

  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return <PortfolioItemDetail expectedType="training" />;
  }

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/training">
            <Button variant="secondary" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <SanitizedHtml
            html={event.description}
            className="text-xl text-brand-50 mb-6 [&_a]:text-cyan-200 [&_a]:underline [&_strong]:text-white [&_em]:text-brand-100 [&_table]:text-sm [&_th]:text-brand-100 [&_td]:text-brand-100 [&_th]:border-brand-400 [&_td]:border-brand-400 [&_p]:mb-2"
          />
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
              <Tag className="h-3 w-3" />
              {event.type}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {event.startDate} - {event.endDate}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {event.duration}
            </span>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-6">Key Topics Covered</h2>
              {event.topics && event.topics.length > 0 ? (
                <ul className="space-y-4">
                  {event.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-brand-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-lg text-gray-900">{topic}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No topics listed yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Training Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Training Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Calendar className="h-8 w-8 text-brand-600 mb-3" />
                <h3 className="font-semibold mb-2">Dates</h3>
                <p className="text-sm text-gray-600">
                  {event.startDate}
                  <br />
                  to
                  <br />
                  {event.endDate}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-brand-600 mb-3" />
                <h3 className="font-semibold mb-2">Duration</h3>
                <p className="text-sm text-gray-600">{event.duration}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Tag className="h-8 w-8 text-brand-600 mb-3" />
                <h3 className="font-semibold mb-2">Type</h3>
                <p className="text-sm text-gray-600">{event.type}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in This Training?</h2>
          <p className="text-xl mb-8 text-brand-50 max-w-2xl mx-auto">
            Contact us for more information or to register for this {event.type.toLowerCase()}.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>

      {/* Related Training */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">More Training</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events
              .filter((e) => e.id !== event.id)
              .slice(0, 3)
              .map((relatedEvent) => (
                <Link key={relatedEvent.id} to={`/training/${relatedEvent.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold line-clamp-2">{relatedEvent.title}</h3>
                        <span className="px-2 py-1 bg-brand-100 text-brand-600 text-xs rounded-full whitespace-nowrap ml-2">
                          {relatedEvent.type}
                        </span>
                      </div>
                      <SanitizedHtml
                        html={relatedEvent.description}
                        className="text-sm text-gray-600 mb-3 line-clamp-2 [&_p]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-1 [&_td]:px-1 [&_th]:py-0.5 [&_td]:py-0.5 [&_th]:bg-gray-50 [&_table]:border-collapse"
                      />
                      <div className="flex items-center text-xs text-gray-500 gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{relatedEvent.startDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
          {events.filter((e) => e.id !== event.id).length === 0 && (
            <p className="text-gray-500 text-center">No other training programs available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
