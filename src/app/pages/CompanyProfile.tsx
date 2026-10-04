import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router';
import { CheckCircle, Users, Award, Lightbulb, ChevronRightCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { slugify } from '../../utils/slug';

export function CompanyProfile() {
  const { clients, sectors, pageHeroImages } = useContent();
  const getClientPortfolioLink = (clientId: string) =>
    `/portfolio?client=${encodeURIComponent(
      clients.find((client) => client.id === clientId)?.slug ||
      slugify(clients.find((client) => client.id === clientId)?.name || clientId)
    )}`;

  const getSectorPortfolioLink = (sectorName: string) => {
    const sector = sectors.find((item) => item.name === sectorName);
    return `/portfolio?sector=${encodeURIComponent(sector?.slug || slugify(sectorName))}`;
  };

  const services = [
    {
      category: 'Civil Engineering & Infrastructure Projects',
      href: '/portfolio',
      items: [
        'Roads, Bridges & Urban Infrastructure',
        'Water Supply & Sanitation Projects',
        'Structural & Building Design Projects',
        'Construction Supervision Projects',
      ],
    },
    {
      category: 'Design & Build Projects',
      href: '/portfolio',
      items: [
        'Turnkey Infrastructure Solutions',
        'Detailed Engineering Design Projects',
        'Cost Estimation & BOQ Projects',
        'Quality Assurance Projects',
      ],
    },
    {
      category: 'Research & Development Programs',
      href: '/training',
      items: [
        'Socio-economic Studies',
        'Policy & Institutional Framework Development',
        'Environmental & Impact Assessments',
      ],
    },
    {
      category: 'Training & Capacity Building',
      href: '/training',
      items: [
        'Public Procurement & Contract Management',
        'Project Planning & Management Tools (Primavera, etc.)',
        'Organizational Development & Technical Training',
      ],
    },
  ];

  return (
    <div>
      
      {/* Header Section */}
      <PageHeroBackground
        image={pageHeroImages?.companyProfile}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white"
      >
       <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
          <h1 className="text-4xl font-bold mb-4">Company Profile</h1>
          <p className="text-xl text-brand-50 max-w-3xl">
            A comprehensive overview of our services, experience, and capabilities
          </p>
        </div>

        
      
      </PageHeroBackground>

      {/* Core Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We deliver engineering, infrastructure, and professional training services across multiple disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link key={index} to={service.href} className="block h-full">
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-4 text-brand-600">
                      {service.category}
                    </h3>

                    <ul className="space-y-2">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Experience Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Experience</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We have successfully delivered <span className="font-bold text-brand-600">100+ assignments</span> across Nepal,
              working with government agencies, development partners, and private sector clients.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-center">Our Portfolio Sectors Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...sectors]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((sector) => (
                  <Link key={sector.id} to={getSectorPortfolioLink(sector.name)} className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <ChevronRightCircle className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{sector.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Clients</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have collaborated with a wide range of reputable organizations
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

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="font-semibold mb-2">Proven Track Record</h3>
                <p className="text-sm text-gray-600">
                  100+ successful projects delivered across Nepal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="font-semibold mb-2">Multidisciplinary Expertise</h3>
                <p className="text-sm text-gray-600">
                  All engineering and management services under one roof
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="font-semibold mb-2">Quality Standards</h3>
                <p className="text-sm text-gray-600">
                  Strong understanding of local and international standards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="font-semibold mb-2">Client Satisfaction</h3>
                <p className="text-sm text-gray-600">
                  Commitment to quality, timeliness, and client satisfaction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
