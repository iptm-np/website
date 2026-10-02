import { useParams, Link, useNavigate } from 'react-router';
import { useContent } from '../contexts/ContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

export function TeamMemberDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { teamMembers } = useContent();
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
          <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
          <Link to="/team">
            <Button>Back to Team</Button>
          </Link>
        </div>
      </div>
    );
  }

  const otherMembers = teamMembers.filter((m) => m.id !== member.id).slice(0, 3);

  return (
    <div>
      {/* Back Button */}
      <section className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate('/team')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </div>
      </section>

      {/* Team Member Profile */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-full rounded-lg shadow-lg object-cover"
              />
            </div>

            <div>
              <div className="inline-block px-3 py-1 bg-brand-100 text-brand-600 text-xs rounded-full mb-4">
                {member.position}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{member.name}</h1>
              <p className="text-xl text-gray-600 mb-8">{member.bio}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-brand-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href="mailto:consultingdiksha@gmail.com" className="text-brand-600 hover:underline">
                      consultingdiksha@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-brand-100 p-2 rounded-full">
                    <Phone className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href="tel:+977-9841707077" className="text-brand-600 hover:underline">
                      +977-9841707077
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Other Team Members</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherMembers.map((otherMember) => (
                <Link key={otherMember.id} to={`/team/${otherMember.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                    <img
                      src={otherMember.imageUrl}
                      alt={otherMember.name}
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-1">{otherMember.name}</h3>
                      <p className="text-brand-600 text-sm mb-3">{otherMember.position}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{otherMember.bio}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/team">
                <Button variant="outline">View All Team Members</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl mb-8 text-brand-50">
            Ready to start your project? Contact us today.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
