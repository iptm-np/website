import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Home, Briefcase, Calendar, FileText, Building2 } from 'lucide-react';

// Construction Crane Animation Component
function ConstructionCrane() {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <style>{`
        @keyframes crane-swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes lift-block {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes build-up {
          0% { height: 0; }
          100% { height: 100%; }
        }

        .crane-arm {
          animation: crane-swing 3s ease-in-out infinite;
          transform-origin: 30% 20%;
        }

        .lifting-block {
          animation: lift-block 3s ease-in-out infinite;
        }

        .building-bar {
          animation: build-up 2s ease-in-out forwards;
          animation-delay: var(--delay);
        }
      `}</style>

      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Ground */}
        <rect x="0" y="180" width="200" height="4" fill="#94a3b8" />

        {/* Building structure being built */}
        <g>
          <rect x="140" y="120" width="8" height="60" fill="#64748b" />
          <rect x="170" y="120" width="8" height="60" fill="#64748b" />

          {/* Building floors with animation */}
          <rect x="138" y="160" width="42" height="8" fill="#6e9cd5" className="building-bar" style={{ '--delay': '0s' } as any} />
          <rect x="138" y="145" width="42" height="8" fill="#5888c4" className="building-bar" style={{ '--delay': '0.5s' } as any} />
          <rect x="138" y="130" width="42" height="8" fill="#4670a8" className="building-bar" style={{ '--delay': '1s' } as any} />
          <rect x="138" y="115" width="42" height="8" fill="#365682" className="building-bar" style={{ '--delay': '1.5s' } as any} />
        </g>

        {/* Crane base */}
        <rect x="35" y="160" width="30" height="20" fill="#fbbf24" />
        <polygon points="40,160 60,160 52,155 48,155" fill="#f59e0b" />

        {/* Crane tower */}
        <rect x="47" y="60" width="6" height="100" fill="#f59e0b" />

        {/* Crane cabin */}
        <rect x="44" y="55" width="12" height="8" fill="#dc2626" />

        {/* Crane arm group with swing animation */}
        <g className="crane-arm">
          {/* Main arm */}
          <rect x="50" y="56" width="80" height="4" fill="#fbbf24" />

          {/* Counterweight */}
          <rect x="15" y="50" width="20" height="12" fill="#64748b" />
          <line x1="35" y1="58" x2="48" y2="58" stroke="#94a3b8" strokeWidth="2" />

          {/* Cable */}
          <line x1="110" y1="60" x2="110" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,2" />

          {/* Lifting block with animation */}
          <g className="lifting-block">
            <rect x="105" y="100" width="10" height="10" fill="#6e9cd5" stroke="#4670a8" strokeWidth="1" />
            <line x1="107" y1="102" x2="113" y2="108" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
            <line x1="113" y1="102" x2="107" y2="108" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
          </g>
        </g>

        {/* Construction worker (optional detail) */}
        <circle cx="155" cy="175" r="3" fill="#fbbf24" />
        <rect x="153" y="178" width="4" height="6" fill="#6e9cd5" />

        {/* Clouds */}
        <ellipse cx="30" cy="30" rx="15" ry="8" fill="#e2e8f0" opacity="0.7" />
        <ellipse cx="170" cy="40" rx="20" ry="10" fill="#e2e8f0" opacity="0.7" />
      </svg>
    </div>
  );
}

export function NotFound() {
  const suggestions = [
    {
      title: 'Explore Portfolio',
      description:
        'Browse our complete portfolio of projects, consulting assignments, training programs, and events',
      icon: Briefcase,
      path: '/portfolio',
      color: 'from-brand-500 to-brand-600',
    },
    {
      title: 'Consulting',
      description:
        'Explore our professional engineering and management consulting services',
      icon: FileText,
      path: '/consulting',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Projects',
      description:
        'View our engineering, infrastructure, and development projects',
      icon: Building2,
      path: '/projects',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Training',
      description:
        'Check out our workshops, training programs, seminars, and events',
      icon: Calendar,
      path: '/training',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-4xl w-full">
        {/* 404 Hero Section */}
        <div className="text-center mb-12">
          {/* Construction Crane Animation */}
          <ConstructionCrane />

          <div className="mb-8">
            <h1 className="text-9xl font-bold text-brand-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oops! This page isn't available. Sorry about that. Try searching for something else.
            </p>
          </div>

          {/* Back to Home Button */}
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm text-gray-500">
              Discover our work, services, and expertise
            </span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <Link key={index} to={suggestion.path}>
                <Card className="h-full hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-brand-300">
                  <CardContent className="pt-6">
                    <div className={`bg-gradient-to-br ${suggestion.color} p-4 rounded-lg w-fit mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Help */}
        <div className="mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#1e3a5f] text-white">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(88,136,196,0.40),transparent_30%),linear-gradient(45deg,rgba(120,160,220,0.18),transparent_50%),radial-gradient(circle_at_top_right,rgba(88,136,196,0.25),transparent_45%)]" />

            <div className="relative px-8 py-12 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Still can't find what you're looking for?
              </h3>

              <p className="mx-auto max-w-2xl text-slate-300 mb-6">
                Our team is here to help. Contact us and we'll point you in the
                right direction.
              </p>

              <Link to="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-medium"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
