import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Globe, ExternalLink, MessageCircle } from 'lucide-react';

const footerLinks = {
  Services: [
    { label: 'House Help / Maid', to: '/services' },
    { label: 'Cook Services', to: '/services' },
    { label: 'Nanny / Babysitter', to: '/services' },
    { label: 'Elder Caregiver', to: '/services' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Contact', to: '/contact' },
  ],
  Account: [
    { label: 'Sign Up', to: '/signup' },
    { label: 'Login', to: '/login' },
    { label: 'For Workers', to: '/signup' },
    { label: 'For Societies', to: '/signup' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--gray-900)', color: 'var(--gray-400)', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={16} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>HomeHelp<span style={{ color: '#60A5FA' }}>+</span></span>
            </Link>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 220, color: 'var(--gray-500)' }}>
              India's trusted recurring domestic help platform. Reliable, verified, and affordable.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[Globe, ExternalLink, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', textDecoration: 'none' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-300)', marginBottom: '1rem' }}>{section}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} style={{ fontSize: '0.875rem', color: 'var(--gray-500)', textDecoration: 'none' }}
                      onMouseEnter={e => e.target.style.color = 'white'}
                      onMouseLeave={e => e.target.style.color = 'var(--gray-500)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray-300)', marginBottom: '1rem' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { Icon: MapPin, text: 'Mumbai, Maharashtra, India' },
                { Icon: Phone, text: '+91 98765 43210' },
                { Icon: Mail, text: 'hello@homehelp.in' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <Icon size={14} style={{ color: 'var(--gray-500)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--gray-500)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>© {new Date().getFullYear()} HomeHelp+ Technologies Pvt. Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(t => (
              <a key={t} href="#" style={{ fontSize: '0.8rem', color: 'var(--gray-600)', textDecoration: 'none' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
