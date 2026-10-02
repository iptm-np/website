import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useContent } from '../../contexts/ContentContext';
import {
  Briefcase,
  Building2,
  GraduationCap,
  Users,
  Landmark,
  Factory,
  Image as ImageIcon,
} from 'lucide-react';
import { Section } from './types';

const SECTION_ROUTES: Record<Section, string> = {
  dashboard: '/admin',
  portfolio: '/admin/portfolio',
  team: '/admin/team',
  clients: '/admin/clients',
  sectors: '/admin/sectors',
  faqs: '/admin/faqs',
  'privacy-policy': '/admin/privacy-policy',
  'hero-carousel': '/admin/hero-carousel',
  'contact-info': '/admin/contact-info',
  'page-heroes': '/admin/page-heroes',
};

export function DashboardHome() {
  const navigate = useNavigate();
  const { teamMembers, clients, portfolio, sectors, heroImages } = useContent();

  const consultingCount = portfolio.filter(
    (item) => item.type === 'consulting'
  ).length;

  const projectCount = portfolio.filter(
    (item) => item.type === 'project'
  ).length;

  const trainingCount = portfolio.filter(
    (item) => item.type === 'training'
  ).length;

  const stats: {
    label: string;
    value: number;
    icon: React.ElementType;
    section: Section;
  }[] = [
    {
      label: 'Projects',
      value: projectCount,
      icon: Building2,
      section: 'portfolio',
    },
    {
      label: 'Consultings',
      value: consultingCount,
      icon: Briefcase,
      section: 'portfolio',
    },
    {
      label: 'Trainings',
      value: trainingCount,
      icon: GraduationCap,
      section: 'portfolio',
    },
    {
      label: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      section: 'team',
    },
    {
      label: 'Clients',
      value: clients.length,
      icon: Landmark,
      section: 'clients',
    },
    {
      label: 'Sectors',
      value: sectors.length,
      icon: Factory,
      section: 'sectors',
    },
    {
      label: 'Hero Images',
      value: heroImages.length,
      icon: ImageIcon,
      section: 'hero-carousel',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            onClick={() => navigate(SECTION_ROUTES[stat.section])}
            className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>

              <Icon className="h-5 w-5 text-brand-600" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold text-brand-600">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
