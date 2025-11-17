import React, { useEffect, useRef, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, Sparkles, Target, Users, Award, Zap, TrendingUp } from 'lucide-react';
import FancyText from '../components/FancyText';
import AnimatedHeading from '../components/AnimatedHeading';

const HomeTablet = () => {
  const [fadeIn, setFadeIn] = React.useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const mainContentRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if page is ready - only show loader if React is still mounting
  useEffect(() => {
    // Check if document is already ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Page is already loaded, skip loader
      setShowLoading(false);
      setLoadingDone(true);
      setFadeIn(true);
      return;
    }

    // Show loader only while page is loading
    setShowLoading(true);
    
    const handleReady = () => {
      setShowLoading(false);
      setLoadingDone(true);
      setFadeIn(true);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleReady);
      return () => document.removeEventListener('DOMContentLoaded', handleReady);
    } else {
      handleReady();
    }
  }, []);

  // Fade in main content after loading is done
  useEffect(() => {
    if (loadingDone) {
      setFadeIn(true);
    }
  }, [loadingDone]);

  // Initialize AOS after fade-in
  useEffect(() => {
    if (fadeIn) {
      AOS.init({ 
        once: true,
        duration: 800,
        easing: 'ease-out',
        offset: 60,
        delay: 0,
        anchorPlacement: 'top-bottom'
      });
      AOS.refresh();
    }
  }, [fadeIn]);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      {showLoading && !loadingDone && <LoadingScreen onFinish={() => { setLoadingDone(true); setShowLoading(false); }} />}
      
      <div
        id="main-content"
        style={{
          opacity: fadeIn ? 1 : 0,
          pointerEvents: 'auto', // Always allow interaction - loader is non-blocking
          position: 'relative',
          overflow: 'visible',
          minHeight: '100vh'
        }}
      >
        {/* Main Container */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 2rem',
          maxWidth: '768px',
          margin: '0 auto'
        }}>
          
          {/* Hero Section */}
          <section style={{ 
            marginTop: '-4rem',
            paddingBottom: '2rem',
            textAlign: 'center'
          }}>
            <div 
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="800"
              style={{
                animation: fadeIn ? 'fadeInUp 0.8s ease-out' : 'none'
              }}
            >
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '1.5rem',
                lineHeight: 1.2,
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '-0.02em'
              }}>
                Creative Digital Solutions for Growing Brands
              </h1>
              
              <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                We combine data-driven strategy with creative storytelling to help
                your business stand out in a crowded digital world.
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link to="/portfolio" style={{
                  display: 'inline-block',
                  padding: '0.875rem 1.75rem',
                  background: 'rgba(127, 66, 167, 0.2)',
                  color: '#7f42a7',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  border: '1px solid rgba(127, 66, 167, 0.3)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}>
                  View our work →
                </Link>
                
                <Link to="/services" style={{
                  display: 'inline-block',
                  padding: '1.125rem 2.25rem',
                  background: 'linear-gradient(90deg, #7f42a7, #6600c5)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '18px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(127,66,167,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  Get Started →
                </Link>
              </div>
            </div>
          </section>

          {/* Section 1 - Brand Value Proposition */}
          <section style={{
            paddingTop: '4rem',
            paddingBottom: '3rem',
            textAlign: 'center'
          }}>
            <div 
              data-aos="fade-in" 
              data-aos-duration="1200"
              data-aos-easing="ease-out"
            >
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '1.5rem',
                lineHeight: 1.3,
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '-0.01em'
              }}>
                Your Brand Deserves More Than Just "Online Presence"
              </h2>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '3rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                The digital space is crowded and fast-moving—generic templates won't help you stand out.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}>
                <div 
                  data-aos="flip-left" 
                  data-aos-delay="600" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20,6 L9,17 L4,12" stroke="#7f42a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Creative Content</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Content that captures attention and drives engagement</p>
                </div>
                
                <div 
                  data-aos="flip-left" 
                  data-aos-delay="800" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20,6 L9,17 L4,12" stroke="#7f42a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Converting Campaigns</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Campaigns that turn followers into loyal customers</p>
                </div>
                
                <div 
                  data-aos="flip-left" 
                  data-aos-delay="1000" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20,6 L9,17 L4,12" stroke="#7f42a7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Growth Solutions</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Web & app solutions that scale with your business</p>
                </div>
              </div>
              
              <div 
                data-aos="zoom-in" 
                data-aos-delay="1200" 
                data-aos-duration="1000"
                data-aos-easing="ease-out-back"
                style={{
                  background: 'rgba(127, 66, 167, 0.15)',
                  border: '1px solid rgba(127, 66, 167, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: '600',
                  lineHeight: 1.5,
                  margin: 0,
                  textAlign: 'center'
                }}>
                  <strong>Shyara gives you the expertise of a digital team with the flexibility of a freelance team, delivering real results without inflated costs.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - Services */}
          <section style={{
            paddingTop: '4rem',
            paddingBottom: '3rem',
            textAlign: 'center'
          }}>
            <div 
              data-aos="fade-in" 
              data-aos-duration="1200"
              data-aos-easing="ease-out"
            >
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#7f42a7',
                marginBottom: '2.5rem',
                textAlign: 'center',
                letterSpacing: '-0.01em'
              }}>
                Your Brand, Supercharged – All Under One Roof
              </h2>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '3rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                We offer a comprehensive suite of digital services to help your brand thrive.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                marginBottom: '2.5rem'
              }}>
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="300" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>Social Media Management</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>From posts to reels, we handle it all.</p>
                </div>
                
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="400" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>Festive Post Designs</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>Ready-to-share festival creatives for instant visibility.</p>
                </div>
                
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="500" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>Ads Campaign Management</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>High-ROI campaigns with free creatives, for your targeted Audience.</p>
                </div>
                
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="600" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>Web Development</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>Fast, responsive, SEO-ready sites.</p>
                </div>
                
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="700" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12.01" y2="18"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>App Development</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>Native and cross-platform mobile applications.</p>
                </div>
                
                <div 
                  data-aos="zoom-in-up" 
                  data-aos-delay="800" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out-back"
                  style={{
                    background: 'rgba(30,30,30,0.55)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1.5px solid rgba(127,66,167,0.18)',
                    boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    background: 'rgba(162,89,247,0.15)',
                    color: '#7f42a7',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>Video Editing & Reels</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    fontSize: '1rem',
                    margin: 0
                  }}>Engaging video content that drives views and engagement.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 - Why Choose Us */}
          <section style={{
            paddingTop: '4rem',
            paddingBottom: '3rem',
            textAlign: 'center'
          }}>
            <div 
              data-aos="fade-in" 
              data-aos-duration="1200"
              data-aos-easing="ease-out"
            >
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#7f42a7',
                marginBottom: '1.5rem',
                lineHeight: 1.3,
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '-0.01em'
              }}>
                Why Choose Shyara?
              </h2>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '3rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                We're not just another digital team. Here's what makes us different.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}>
                <div 
                  data-aos="fade-up" 
                  data-aos-delay="200" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Award size={28} color="#7f42a7" />
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Proven Results</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Track record of delivering measurable growth and ROI for our clients.</p>
                </div>
                
                <div 
                  data-aos="fade-up" 
                  data-aos-delay="400" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <Zap size={28} color="#7f42a7" />
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Fast Turnaround</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Quick delivery without compromising on quality or attention to detail.</p>
                </div>
                
                <div 
                  data-aos="fade-up" 
                  data-aos-delay="600" 
                  data-aos-duration="1000"
                  data-aos-easing="ease-out"
                  style={{
                    background: 'rgba(30, 30, 40, 0.8)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1px solid rgba(127, 66, 167, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    background: 'rgba(127, 66, 167, 0.2)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <TrendingUp size={28} color="#7f42a7" />
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '0.75rem'
                  }}>Scalable Growth</h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.5,
                    margin: 0
                  }}>Solutions that grow with your business, from startup to enterprise.</p>
                </div>
              </div>
              
              <div 
                data-aos="zoom-in" 
                data-aos-delay="800" 
                data-aos-duration="1000"
                data-aos-easing="ease-out-back"
                style={{
                  background: 'rgba(127, 66, 167, 0.15)',
                  border: '1px solid rgba(127, 66, 167, 0.3)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{
                  fontSize: '1.1rem',
                  color: '#fff',
                  fontWeight: '600',
                  lineHeight: 1.5,
                  margin: 0,
                  textAlign: 'center'
                }}>
                  <strong>Ready to transform your digital presence? Let's discuss how we can help your brand thrive.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 - Call to Action */}
          <section style={{
            paddingTop: '4rem',
            paddingBottom: '4rem',
            textAlign: 'center'
          }}>
            <div 
              data-aos="fade-in" 
              data-aos-duration="1200"
              data-aos-easing="ease-out"
            >
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '1.5rem',
                lineHeight: 1.3,
                textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                letterSpacing: '-0.01em'
              }}>
                Ready to Transform Your Brand?
              </h2>
              
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                Let's discuss how we can help your business grow and stand out in the digital world.
              </p>
              
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1.5rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '2.5rem'
              }}>
                <Link to="/contact" style={{
                  display: 'inline-block',
                  padding: '1.125rem 2.25rem',
                  background: 'linear-gradient(90deg, #7f42a7, #6600c5)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '18px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(127,66,167,0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  Get Started Today →
                </Link>
                
                <Link to="/portfolio" style={{
                  display: 'inline-block',
                  padding: '0.875rem 1.75rem',
                  background: 'rgba(127, 66, 167, 0.2)',
                  color: '#7f42a7',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  border: '1px solid rgba(127, 66, 167, 0.3)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}>
                  View Our Portfolio →
                </Link>
              </div>
              
              <div style={{
                background: 'rgba(127, 66, 167, 0.15)',
                border: '1px solid rgba(127, 66, 167, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.5,
                  margin: '0 0 1rem 0',
                  textAlign: 'center'
                }}>
                  <strong>Have questions?</strong>
                </p>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.5,
                  margin: 0,
                  textAlign: 'center'
                }}>
                  Reach out to us at{' '}
                  <a 
                    href="mailto:hello@shyara.digital" 
                    style={{
                      color: '#7f42a7',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    hello@shyara.digital
                  </a>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

    </>
  );
};

export default HomeTablet;
