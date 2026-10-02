import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { SanitizedHtml } from '../components/ui/sanitized-html';

function formatDate(value?: string) {
  if (!value) return 'Not yet published';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function PrivacyPolicy() {
  const { privacyPolicy } = useContent();
  const isPublished = Boolean(privacyPolicy?.isPublished && privacyPolicy.content?.trim());
  const lastUpdated = formatDate(privacyPolicy?.publishedAt || privacyPolicy?.updatedAt);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Diksha Consulting and Projects</title>
        <meta
          name="description"
          content="Read the privacy policy for Diksha Consulting and Projects Pvt. Ltd."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.dikshacp.com.np/privacy-policy" />
      </Helmet>

      <section
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-600) 55%, #000) 0%, var(--brand-600) 62%, #f7fafc 100%)',
          color: '#fff',
          padding: '4rem 1.5rem 3.5rem',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255,255,255,0.78)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              marginBottom: '1.5rem',
            }}
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
              color: 'rgba(255,255,255,0.68)',
              marginBottom: '0.75rem',
            }}
          >
            Website Policy
          </p>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 1rem',
            }}
          >
            Privacy Policy
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            Last Updated: {isPublished ? lastUpdated : 'Not yet published'}
          </p>
        </div>
      </section>

      <section style={{ background: '#FAFAF9', minHeight: '55vh', padding: '3rem 1.5rem 5rem' }}>
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          {isPublished ? (
            <SanitizedHtml html={privacyPolicy?.content || ''} />
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6B7280' }}>
              <h2 style={{ color: '#111827', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                Privacy policy coming soon
              </h2>
              <p style={{ maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                We are preparing our privacy policy. Please contact us if you have questions about
                how your information is handled.
              </p>
              <Link
                to="/contact"
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  color: 'var(--brand-600)',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>


    </>
  );
}

export default PrivacyPolicy;
