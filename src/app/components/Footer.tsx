import { useLocation, Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export function Footer() {
  const location = useLocation();
  const { contactInfo } = useContent();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  const address = contactInfo?.address || '';
  const email = contactInfo?.email || '';
  const phone = contactInfo?.phone || '';

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Diksha Consulting and Projects Pvt. Ltd.</h3>
            <p className="text-gray-400">
              Leading engineering consultancy providing innovative solutions for complex projects.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              {phone && (
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-5 w-5" />
                  <span>
                    <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                      {phone}
                    </a>
                  </span>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5" />
                  <span>
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                      {email}
                    </a>
                  </span>
                </div>
              )}
              {address && (
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5" />
                  <span>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {address}
                    </a>
                  </span>
                </div>
              )}
              {!phone && !email && !address && (
                <p className="text-gray-500 text-sm">Contact information not yet configured.</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/company-profile" className="hover:text-white transition-colors">
                  Company Profile
                </Link>
              </li>
               <li>
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/consulting" className="hover:text-white transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-white transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Diksha Consulting and Projects Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
