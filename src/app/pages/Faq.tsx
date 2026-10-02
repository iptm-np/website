import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowLeft } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

/* ─────────────────────────────────────────────
   Custom diamond-chevron SVG icon
───────────────────────────────────────────── */
function FaqIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{
        width: 20,
        height: 20,
        flexShrink: 0,
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
        color: isOpen ? 'var(--brand-600)' : '#6B7280',
      }}
    >
      <path
        d="M12 2L22 12L12 22L2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={isOpen ? 'currentColor' : 'none'}
        opacity={isOpen ? 0.15 : 1}
        style={{ transition: 'fill 0.3s ease, opacity 0.3s ease' }}
      />
      <path
        d="M10 9L14 12L10 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Accordion answer — always in DOM for SEO
───────────────────────────────────────────── */
function AccordionAnswer({ answer, isOpen }: { answer: string; isOpen: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [answer]);

  return (
    <div
      style={{
        maxHeight: isOpen ? `${height + 32}px` : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
        opacity: isOpen ? 1 : 0,
      }}
      aria-hidden={!isOpen}
    >
      <div
        ref={ref}
        style={{
          padding: '0 1rem 1.25rem 2.75rem',
          fontSize: '0.9375rem',
          lineHeight: 1.8,
          color: '#4B5563',
          borderLeft: '2px solid var(--brand-600)',
          marginLeft: '0.5rem',
          paddingLeft: '1.25rem',
        }}
      >
        {answer}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single FAQ accordion item
───────────────────────────────────────────── */
function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { id: string; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      style={{
        borderBottom: '1px solid #E5E7EB',
        background: isOpen ? 'color-mix(in srgb, var(--brand-600) 4%, transparent)' : 'transparent',
        transition: 'background 0.2s ease',
        animation: `fadeSlideIn 0.35s ease both`,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '1.125rem 1rem',
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isOpen ? 'var(--brand-600)' : '#111827',
          fontWeight: 600,
          fontSize: '0.9375rem',
          transition: 'color 0.2s ease',
          fontFamily: 'inherit',
        }}
      >
        <FaqIcon isOpen={isOpen} />
        <span style={{ flex: 1 }}>{faq.question}</span>
      </button>
      <AccordionAnswer answer={faq.answer} isOpen={isOpen} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   JSON-LD schema injection
───────────────────────────────────────────── */
function useFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  useEffect(() => {
    if (!faqs.length) return;
    const existing = document.querySelector('#faq-page-schema-ld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'faq-page-schema-ld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [faqs]);
}

/* ─────────────────────────────────────────────
   /faq page
───────────────────────────────────────────── */
export function Faq() {
  const { homeFaqs } = useContent();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useFaqSchema(homeFaqs);

  const filtered = query.trim()
    ? homeFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
      )
    : homeFaqs;

  const highlightCount = query.trim() ? filtered.length : null;

  return (
    <>
      <Helmet>
        <title>FAQ | Diksha Consulting and Projects</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Diksha Consulting and Projects — engineering consultancy, project management, and training services in Nepal."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.dikshacp.com.np/faq" />
      </Helmet>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Page hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-600) 55%, #000) 0%, var(--brand-600) 60%, color-mix(in srgb, var(--brand-600) 0%, transparent) 100%)',
          padding: '4rem 1.5rem 3.5rem',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              marginBottom: '1.5rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#fff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)')}
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '0.75rem',
            }}
          >
            Help Centre
          </p>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              margin: '0 0 1rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Frequently Asked Questions
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.0625rem', maxWidth: '520px' }}>
            Everything you need to know about our engineering consultancy, project support, and
            training services.
          </p>

          {/* Search bar inside hero */}
          <div style={{ position: 'relative', marginTop: '2rem', maxWidth: '520px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                pointerEvents: 'none',
              }}
              aria-hidden
            />
            <input
              type="search"
              placeholder={`Search ${homeFaqs.length} questions…`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpenId(null);
              }}
              aria-label="Search all FAQs"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                paddingLeft: '2.75rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                fontSize: '0.9375rem',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                outline: 'none',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              }}
            />
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section style={{ background: '#FAFAF9', minHeight: '60vh', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Result count when searching */}
          {highlightCount !== null && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '1.25rem',
                animation: 'fadeSlideIn 0.2s ease both',
              }}
            >
              {highlightCount === 0
                ? 'No results found.'
                : `${highlightCount} result${highlightCount !== 1 ? 's' : ''} for "${query}"`}
            </p>
          )}

          {filtered.length === 0 && query.trim() ? (
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #E5E7EB',
                padding: '3rem',
                textAlign: 'center',
                color: '#9CA3AF',
              }}
            >
              <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
                No questions match "{query}"
              </p>
              <p style={{ fontSize: '0.875rem' }}>Try a different keyword or browse all questions below.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{
                  marginTop: '1.25rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1.5px solid var(--brand-600)',
                  color: 'var(--brand-600)',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1.5px solid #E5E7EB',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
              }}
            >
              {filtered.map((faq, i) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  index={i}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          )}

          {/* Still have questions CTA */}
          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--brand-900, color-mix(in srgb, var(--brand-600) 55%, #000)), var(--brand-600))',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              Still have questions?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Our team is happy to help with anything not covered here.
            </p>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                padding: '0.6875rem 1.75rem',
                borderRadius: '9999px',
                background: '#fff',
                color: 'var(--brand-600)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.9')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faq;
