
import { Link } from 'react-router';
import {
  Home,
  BriefcaseBusiness,
  GraduationCap,
  CalendarDays,
  MessageCircle,
  ArrowRight,
  BookOpen,
  Building2,
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const suggestions = [
  {
    title: 'Portfolio',
    description: 'Explore our work, projects, and achievements.',
    icon: BriefcaseBusiness,
    path: '/portfolio',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-[#2e3094]',
    hoverBg: 'group-hover:bg-[#2e3094]',
    borderHover: 'group-hover:border-[#2e3094]/40',
  },
  {
    title: 'Training',
    description: 'Discover our professional training programs.',
    icon: GraduationCap,
    path: '/training',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    hoverBg: 'group-hover:bg-amber-500',
    borderHover: 'group-hover:border-amber-300',
  },
  {
    title: 'Events & Workshops',
    description: 'Explore our events, workshops, and learning activities.',
    icon: CalendarDays,
    path: '/events-workshops',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    hoverBg: 'group-hover:bg-sky-500',
    borderHover: 'group-hover:border-sky-300',
  },
  {
  title: 'Company Profile',
  description: 'Learn about IPTM Nepal, our vision, mission, and expertise.',
  icon: Building2,
  path: '/company-profile',
  iconBg: 'bg-teal-50',
  iconColor: 'text-teal-600',
  hoverBg: 'group-hover:bg-teal-600',
  borderHover: 'group-hover:border-teal-300',
},
];

export function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAFAFD] px-4 py-16 sm:py-20">

      {/* Subtle Background Decorations */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-40 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* 404 Hero */}
        <section className="mb-16 text-center">

          {/* Learning-themed Illustration */}
          <div className="relative mx-auto mb-7 flex h-36 w-36 items-center justify-center">

            <div className="absolute inset-0 rounded-full bg-indigo-100/70" />
            <div className="absolute inset-3 rounded-full border border-indigo-200" />

            <div className="absolute right-1 top-5 h-4 w-4 rounded-full bg-amber-400" />
            <div className="absolute bottom-5 left-0 h-3 w-3 rounded-full bg-teal-400" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2e3094] shadow-xl shadow-indigo-900/20">
              <BookOpen
                className="h-10 w-10 text-white"
                strokeWidth={1.5}
              />
              <span className="absolute right-5 top-0 h-5 w-2 rounded-b-sm bg-amber-400" />
            </div>

            <div className="absolute -right-3 bottom-7 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-white shadow-sm">
              <GraduationCap className="h-5 w-5 text-amber-500" />
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-8xl font-extrabold tracking-tight text-[#2e3094] sm:text-9xl">
              404
            </h1>

            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Oops! Learning path not found.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
              The page you're looking for may have been moved, renamed,
              or is temporarily unavailable.
            </p>
          </div>

          <Link to="/">
            <Button
              size="lg"
              className="h-12 gap-2 rounded-xl bg-[#2e3094] px-7 font-semibold text-white shadow-md shadow-indigo-900/15 transition-all hover:bg-[#242675] hover:shadow-lg"
            >
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </section>

        {/* Navigation Suggestions */}
        <section>
          <div className="mb-8 text-center">
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#2e3094]">
              Find Your Way
            </span>

            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Explore IPTM Nepal
            </h3>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Discover our work, learning opportunities, and services.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3094] focus-visible:ring-offset-2"
                >
                  <Card
                    className={`h-full rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${item.borderHover}`}
                  >
                    <CardContent className="flex h-full flex-col p-6">

                      <div
                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${item.iconBg} ${item.iconColor} ${item.hoverBg} group-hover:text-white`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.8} />
                      </div>

                      <h4 className="mb-2 text-lg font-semibold text-gray-900">
                        {item.title}
                      </h4>

                      <p className="flex-1 text-sm leading-relaxed text-gray-500">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2e3094]">
                        Explore
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>

                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Contact Help Section */}
        <section className="relative mt-16 overflow-hidden rounded-2xl bg-[#2e3094] px-6 py-12 text-center text-white sm:px-12">

          {/* Decorative Elements */}
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[25px] border-white/[0.06]" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full border-[25px] border-white/[0.06]" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <MessageCircle className="h-6 w-6 text-amber-300" />
            </div>

            <h3 className="text-xl font-bold sm:text-2xl">
              Still can't find what you're looking for?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
              Our team is happy to help. Get in touch with us
              and we'll point you in the right direction.
            </p>

            <Link to="/contact" className="mt-7 inline-block">
              <Button
                size="lg"
                variant="secondary"
                className="h-11 gap-2 rounded-xl bg-white px-7 font-semibold text-[#2e3094] shadow-sm transition-colors hover:bg-amber-50 hover:text-[#2e3094]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
