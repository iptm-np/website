import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Training } from './pages/Training';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { EventDetail } from './pages/EventDetail';
import { Contact } from './pages/Contact';
import { Portfolio } from './pages/Portfolio';
import { Team } from './pages/Team';
import { TeamMemberDetail } from './pages/TeamMemberDetail';
import { CompanyProfile } from './pages/CompanyProfile';
import { CompanySector } from './pages/CompanySector';
import { ConsultingService } from './pages/ConsultingService';
import { PortfolioItemDetail } from './pages/PortfolioItemDetail';
import { AdminLayout } from './pages/admin/Dashboard';
import { DashboardHome } from './pages/admin/DashboardHome';
import { PortfolioSection } from './pages/admin/PortfolioSection';
import { PortfolioForm } from './pages/admin/PortfolioForm';
import { TeamSection } from './pages/admin/TeamSection';
import { TeamForm } from './pages/admin/TeamForm';
import { ClientsManagement } from './pages/admin/Clients';
import { ClientForm } from './pages/admin/ClientForm';
import { SectorsManagement } from './pages/admin/Sectors';
import { SectorForm } from './pages/admin/SectorForm';
import { FaqsSection } from './pages/admin/FaqsSection';
import { FaqForm } from './pages/admin/FaqForm';
import { PrivacyPolicySection } from './pages/admin/PrivacyPolicySection';
import { HeroCarouselSection } from './pages/admin/HeroCarouselSection';
import { PageHeroesSection } from './pages/admin/PageHeroesSection';
import { ContactInfoSection } from './pages/admin/ContactInfoSection';
import { AdminLogin } from './components/AdminLogin';
import { NotFound } from './pages/NotFound';
import { Faq } from './pages/Faq'; 
import { ProtectedRoute } from './components/ProtectedRoute';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Gallery } from './pages/Gallery';
import { GalleryDetail } from './pages/GalleryDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'company-sector', Component: CompanySector },
      { path: 'consulting', Component: ConsultingService },
      { path: 'consulting/:slug', element: <PortfolioItemDetail expectedType="consulting" /> },
      { path: 'company-profile', Component: CompanyProfile },
      { path: 'team', Component: Team },
      { path: 'team/:slug', Component: TeamMemberDetail },
      { path: 'training', Component: Training },
      { path: 'training/:slug', Component: EventDetail },
      { path: 'projects', Component: Projects },
      { path: 'projects/:slug', Component: ProjectDetail },
      { path: 'portfolio', Component: Portfolio },
      { path: 'contact', Component: Contact },
      { path: 'gallery', Component: Gallery },
      { path: 'gallery/:slug', Component: GalleryDetail },
      { path: 'faq', Component: Faq },
      { path: 'privacy-policy', Component: PrivacyPolicy },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: DashboardHome },
      { path: 'portfolio', Component: PortfolioSection },
      { path: 'portfolio/add', Component: PortfolioForm },
      { path: 'portfolio/edit/:slug', Component: PortfolioForm },
      { path: 'team', Component: TeamSection },
      { path: 'team/add', Component: TeamForm },
      { path: 'team/edit/:slug', Component: TeamForm },
      { path: 'clients', Component: ClientsManagement },
      { path: 'clients/add', Component: ClientForm },
      { path: 'clients/edit/:slug', Component: ClientForm },
      { path: 'sectors', Component: SectorsManagement },
      { path: 'sectors/add', Component: SectorForm },
      { path: 'sectors/edit/:slug', Component: SectorForm },
      { path: 'faqs', Component: FaqsSection },
      { path: 'faqs/add', Component: FaqForm },
      { path: 'faqs/edit/:slug', Component: FaqForm },
      { path: 'hero-carousel', Component: HeroCarouselSection },
      { path: 'page-heroes', Component: PageHeroesSection },
      { path: 'contact-info', Component: ContactInfoSection },
      { path: 'privacy-policy', Component: PrivacyPolicySection },
      { path: '*', Component: NotFound },
    ],
  },
]);
