import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router';
import { CheckCircle, Building2, Factory, Droplet, Zap, Home, Hammer } from 'lucide-react';
import { slugify } from '../../utils/slug';
import { useContent } from '../contexts/ContentContext';
import { PageHeroBackground } from '../components/PageHeroBackground';

export function CompanySector() {
  const { pageHeroImages } = useContent();
  const sectors = [
    {
      title: 'Water Supply & Sanitation',
      icon: Droplet,
      description: 'Comprehensive water supply and wastewater management solutions',
      services: [
        'Water treatment plant design',
        'Distribution network planning',
        'Wastewater collection systems',
        'Sanitation infrastructure',
        'Pumping station design',
        'Reservoir and storage facilities',
      ],
    },
    {
      title: 'Infrastructure Development',
      icon: Building2,
      description: 'Large-scale infrastructure planning and development',
      services: [
        'Urban infrastructure planning',
        'Master planning services',
        'Transportation infrastructure',
        'Public facilities design',
        'Special Economic Zones (SEZ)',
        'Institutional infrastructure',
      ],
    },
    {
      title: 'Energy & Industrial',
      icon: Factory,
      description: 'Energy infrastructure and industrial facility design',
      services: [
        'Fuel depot design',
        'Pipeline systems',
        'Storage facility planning',
        'Industrial plant design',
        'Energy infrastructure',
        'Safety and compliance systems',
      ],
    },
    {
      title: 'Building & Construction',
      icon: Home,
      description: 'Structural, architectural, and MEP design services',
      services: [
        'Structural engineering design',
        'Architectural design',
        'MEP (Mechanical, Electrical, Plumbing)',
        'Building retrofitting',
        'Earthquake-resistant design',
        'Green building design',
      ],
    },
    {
      title: 'Project Management',
      icon: Hammer,
      description: 'End-to-end project supervision and management',
      services: [
        'Construction supervision',
        'Contract administration',
        'Quality assurance & control',
        'Third-party inspection',
        'Project scheduling',
        'Risk management',
      ],
    },
    {
      title: 'Power & Utilities',
      icon: Zap,
      description: 'Power distribution and utility infrastructure',
      services: [
        'Electrical network design',
        'Power distribution planning',
        'Substation design',
        'Street lighting systems',
        'Renewable energy integration',
        'Utility mapping and GIS',
      ],
    },
  ];

  const projectTypes = [
    {
      title: 'Government Projects',
      description: 'Infrastructure development for government ministries and departments',
      count: '50+',
    },
    {
      title: 'International Organizations',
      description: 'Projects funded by UNICEF, UNDP, and other development partners',
      count: '25+',
    },
    {
      title: 'Private Sector',
      description: 'Commercial and industrial facility design and consulting',
      count: '30+',
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <PageHeroBackground
        image={pageHeroImages?.companySector}
        fallbackClassName="bg-gradient-to-r from-brand-500 to-brand-700 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Company Sectors</h1>
          <p className="text-xl text-brand-50 max-w-3xl">
            We serve diverse sectors with specialized engineering and consulting expertise
          </p>
        </div>
      </PageHeroBackground>

      {/* Sectors We Serve Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sectors We Serve</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our multidisciplinary team provides comprehensive services across multiple sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Link key={index} to={`/portfolio?sector=${slugify(sector.title)}`} className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="pt-6">
                      <div className="bg-brand-100 p-3 rounded-full w-fit mb-4">
                        <Icon className="h-8 w-8 text-brand-600" />
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{sector.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{sector.description}</p>
                      <ul className="space-y-2">
                        {sector.services.map((service, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Distribution Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Project Distribution</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Successfully delivered over 100+ projects across various client segments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-brand-600 mb-2">{type.count}</div>
                  <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Achievements Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sector Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-brand-50 to-brand-100">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-brand-600 mb-2">140 MLD</div>
                <p className="text-sm text-gray-700">Water Treatment Plant Designed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-50 to-brand-100">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-brand-600 mb-2">1.4M+</div>
                <p className="text-sm text-gray-700">People Served by Projects</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-50 to-brand-100">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-brand-600 mb-2">100+</div>
                <p className="text-sm text-gray-700">Projects Delivered</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-50 to-brand-100">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-brand-600 mb-2">15+</div>
                <p className="text-sm text-gray-700">Years of Experience</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
