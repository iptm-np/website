import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Home,
  CircleHelp,
  ShieldCheck,
  Landmark,
  Factory,
  ClipboardList,
  Image as ImageIcon,
  Contact,
} from 'lucide-react';
import { Section } from './types';

const NAV_ITEMS: { id: Section; label: string; to: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', to: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'portfolio', label: 'Portfolio', to: '/admin/portfolio', icon: <ClipboardList className="h-5 w-5" /> },
  { id: 'team', label: 'Team', to: '/admin/team', icon: <Users className="h-5 w-5" /> },
  { id: 'clients', label: 'Clients', to: '/admin/clients', icon: <Landmark className="h-5 w-5" /> },
  { id: 'sectors', label: 'Sectors', to: '/admin/sectors', icon: <Factory className="h-5 w-5" /> },
  { id: 'faqs', label: 'FAQs', to: '/admin/faqs', icon: <CircleHelp className="h-5 w-5" /> },
  { id: 'hero-carousel', label: 'Hero Carousel', to: '/admin/hero-carousel', icon: <ImageIcon className="h-5 w-5" /> },
  { id: 'page-heroes', label: 'Hero Backgrounds', to: '/admin/page-heroes', icon: <ImageIcon className="h-5 w-5" /> },
  { id: 'contact-info', label: 'Contact Info', to: '/admin/contact-info', icon: <Contact className="h-5 w-5" /> },
  { id: 'privacy-policy', label: 'Privacy Policy', to: '/admin/privacy-policy', icon: <ShieldCheck className="h-5 w-5" /> },
];

const SECTION_LABELS: Record<Section, string> = {
  dashboard: 'Dashboard',
  portfolio: 'Portfolio',
  team: 'Team',
  clients: 'Clients',
  sectors: 'Sectors',
  faqs: 'FAQs',
  'hero-carousel': 'Hero Carousel',
  'page-heroes': 'Hero Backgrounds',
  'contact-info': 'Contact Info',
  'privacy-policy': 'Privacy Policy',
};

// Determines the header title even on nested routes like /admin/portfolio/add
const getActiveSectionLabel = (pathname: string) => {
  const segments = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const sectionId = (segments[0] as Section) || 'dashboard';
  return SECTION_LABELS[sectionId] ?? 'Dashboard';
};

export function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-brand-600">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, to, icon }) => (
            <NavLink
              key={id}
              to={to}
              end={id === 'dashboard'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer font-semibold ${
                  isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link to="/" className="block">
            <Button variant="outline" size="sm" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Website
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-6">
          <h2 className="text-2xl font-bold text-brand-800">{getActiveSectionLabel(pathname)}</h2>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
