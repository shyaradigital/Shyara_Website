import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Sparkles, Megaphone, Globe, Smartphone, Film } from 'lucide-react';
import FancyText from '../components/FancyText';
import AnimatedHeading from '../components/AnimatedHeading';

const services = [
  {
    icon: <Share2 className="w-8 h-8 text-primary" />,
    title: 'Social Media Management',
    desc: 'Creative content and community engagement across all platforms.',
    price: 'Starting at ₹5,000/month',
    route: '/services/social-media-management',
    basePrice: 5000,
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'Festive Post Designs',
    desc: 'Branded festival creatives with your logo and contact info.',
    price: '₹5,000/year',
    route: '/services/festive-posts',
    basePrice: 5000,
  },
  {
    icon: <Megaphone className="w-8 h-8 text-primary" />,
    title: 'Ads Campaign Management',
    desc: 'High-ROI ads on Meta & Google with free creatives and reporting.',
    price: '₹0/month',
    route: '/services/ads-campaign-management',
    basePrice: 0,
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: 'Website Development',
    desc: 'Fast, responsive websites for portfolios, businesses, and e-commerce.',
    price: 'Custom Quote',
    route: '/services/website-development',
    basePrice: 0,
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'App Development',
    desc: 'Mobile apps for Android & iOS with UI/UX design and deployment.',
    price: 'Custom Quote',
    route: '/services/app-development',
    basePrice: 0,
  },
  {
    icon: <Film className="w-8 h-8 text-primary" />,
    title: 'Video & Reels Editing',
    desc: 'High-performing reels and video content from your raw footage.',
    price: 'Starting at ₹15,000/month',
    route: '/services/video-editing-reels',
    basePrice: 15000,
  },
];

const ServiceCard = ({ service }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="service-card"
      tabIndex={0}
      role="button"
      aria-label={service.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => navigate(service.route)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(service.route); }}
      style={{
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
        padding: '0.5rem 0',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 370,
        maxWidth: 440,
        minHeight: 120,
        height: '100%',
        position: 'relative',
        transition: hovered ? 'transform 0.38s cubic-bezier(.22,1.5,.36,1)' : 'transform 0.32s cubic-bezier(.4,2,.6,1)',
        transform: hovered ? 'scale(1.035)' : 'none',
        zIndex: 1,
      }}
    >
      {/* Softer glass card background on hover */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-12px',
          right: '-12px',
          bottom: '-10px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1.045)' : 'scale(0.98)',
          transition: 'opacity 0.32s cubic-bezier(.4,2,.6,1), transform 0.48s cubic-bezier(.22,1.5,.36,1)',
          background: 'linear-gradient(120deg, rgba(162,89,247,0.08) 0%, rgba(30,30,40,0.38) 100%)',
          borderRadius: 22,
          boxShadow: hovered ? '0 4px 24px 0 #a259f755, 0 1px 8px 0 #0002' : 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid',
          borderImage: 'linear-gradient(90deg, #a259f7 0%, #7f42a7 100%) 1',
          filter: hovered ? 'brightness(1.01)' : 'none',
        }}
      />
      <div style={{ marginBottom: 18, position: 'relative', zIndex: 2 }}>{service.icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: hovered ? '#a259f7' : 'var(--color-primary)', marginBottom: 10, letterSpacing: '-0.01em', textDecoration: 'none', transition: 'color 0.2s', position: 'relative', zIndex: 2, textShadow: hovered ? '0 2px 8px #a259f733' : 'none' }}>
        <FancyText text={service.title} />
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.97rem', fontWeight: 400, marginBottom: 14, flexGrow: 1, position: 'relative', zIndex: 2, textShadow: hovered ? '0 1px 6px #0003' : 'none' }}>{service.desc}</p>
    </div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', color: 'var(--color-text-primary)', padding: '2rem 0 4rem 0', fontFamily: 'inherit', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', marginTop: '-7rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <AnimatedHeading text="Our Services" />
          <p style={{ fontSize: '1.08rem', fontWeight: 400, color: '#a7a7a7', marginBottom: '3rem' }}>
            Smart, scalable, and freelancer-powered digital solutions for every brand. Choose what you need.
          </p>
        </div>
        <div className="services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 48,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1rem',
          marginBottom: 64,
          justifyContent: 'center',
          background: 'none',
          boxShadow: 'none',
          border: 'none',
        }}>
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}>
          <div style={{
            background: 'rgba(30,30,30,0.55)',
            border: '1.5px solid rgba(127,66,167,0.18)',
            boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 32,
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', background: '#181818', borderRadius: '50%', padding: 10, boxShadow: '0 2px 12px #0006', border: '2px solid #a259f7' }}>
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l-1.41-1.41M6.34 6.34L4.93 4.93" stroke="#a259f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a259f7', marginBottom: 10, marginTop: 24, letterSpacing: '-0.01em', textAlign: 'center' }}>Want something truly unique?</h2>
            <p style={{ fontSize: '0.97rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>
              Check out our <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Personalized Services</span> for custom solutions, one-on-one consulting, and more. Let us bring your vision to life!
            </p>
            <button
              onClick={() => navigate('/services/personalized')}
              style={{
                background: 'rgba(162,89,247,0.12)',
                color: '#a259f7',
                fontWeight: 700,
                fontSize: '1.08rem',
                padding: '0.9rem 2.5rem',
                borderRadius: 999,
                boxShadow: '0 2px 12px #0004',
                border: '2px solid #a259f7',
                marginTop: 8,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Explore Personalized Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage; 