import { Link, useLocation } from 'react-router';
import { Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { SiInstagram, SiFacebook, SiYoutube, SiTiktok, SiX } from 'react-icons/si';
import logoImage from '../../imports/DCP_logo-1.webp';

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { contactInfo } = useContent();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null; // Don't show main header in admin area
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/company-profile', label: 'Company Profile' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/consulting', label: 'Consulting' },
    { path: '/projects', label: 'Projects' },
    { path: '/training', label: 'Training' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: contactInfo?.instagram, icon: SiInstagram },
    { label: 'Facebook', href: contactInfo?.facebook, icon: SiFacebook },
    { label: 'YouTube', href: contactInfo?.youtube, icon: SiYoutube },
    { label: 'TikTok', href: contactInfo?.tiktok, icon: SiTiktok },
    { label: 'X', href: contactInfo?.x, icon: SiX },
  ].filter((social) => social.href?.trim());

  const externalUrl = (url: string) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="DCP Logo" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600'
                    : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {(contactInfo?.email || socialLinks.length > 0) && (
            <div className="hidden md:flex items-center gap-3 text-gray-600">
              {contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  aria-label="Email us"
                  title="Email us"
                  className="hover:text-brand-600 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={externalUrl(href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="hover:text-brand-600 transition-colors"
                >
                  <Icon fontSize="small" />
                </a>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium ${
                    isActive(link.path) ? 'text-brand-600' : 'text-gray-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {(contactInfo?.email || socialLinks.length > 0) && (
              <div className="flex items-center gap-4 border-t mt-4 pt-4 text-gray-600">
                {contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    aria-label="Email us"
                    title="Email us"
                    className="hover:text-brand-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={externalUrl(href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="hover:text-brand-600 transition-colors"
                  >
                    <Icon fontSize="small" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
