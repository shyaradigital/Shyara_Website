import React, { useEffect, useRef, useState, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Target, Users, Award, Zap, TrendingUp } from 'lucide-react';
import FancyText from '../components/FancyText';
import { waitForHydration, hasValidDimensions } from '../utils/hydration';

let splineScriptPromise = null;

const loadSplineViewerScript = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.__splineViewerLoaded) return Promise.resolve();
  if (!splineScriptPromise) {
    splineScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js';
      script.onload = () => {
        window.__splineViewerLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  return splineScriptPromise;
};

const Home = () => {
  const [fadeIn, setFadeIn] = React.useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const mainContentRef = useRef(null);
  const location = useLocation();
  const splineRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [robotFadeIn, setRobotFadeIn] = useState(false);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const [splineScriptLoaded, setSplineScriptLoaded] = useState(false);
  const [containerValid, setContainerValid] = useState(false);
  const heroSectionRef = useRef(null);
  const containerRef = useRef(null);

  // Custom hook for IntersectionObserver-based animations
  const useScrollAnimation = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Unobserve after animation triggers to prevent re-triggering
            observer.unobserve(element);
          }
        },
        {
          threshold: options.threshold || 0.1,
          rootMargin: options.rootMargin || '50px',
        }
      );

      observer.observe(element);

      return () => {
        if (element) {
          observer.unobserve(element);
        }
        observer.disconnect();
      };
    }, []);

    return [ref, isVisible];
  };

  // Animation refs for each section
  const [section1Ref, section1Visible] = useScrollAnimation();
  const [section2Ref, section2Visible] = useScrollAnimation();
  const [section3Ref, section3Visible] = useScrollAnimation();
  const [section4Ref, section4Visible] = useScrollAnimation();
  const [section5Ref, section5Visible] = useScrollAnimation();
  const [section6Ref, section6Visible] = useScrollAnimation();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver to load Spline only when hero section is visible
  useEffect(() => {
    if (isMobile) {
      return undefined;
    }

    // Only load once
    if (shouldLoadSpline || splineScriptLoaded) {
      return undefined;
    }

    // Wait for hydration before setting up observer
    let retryTimeout;
    let observer;
    let interactionTimeout;
    let handleInteraction;
    let hydrationReady = false;

    const setupObserver = async () => {
      // Wait for hydration (DOM + fonts) before proceeding
      if (!hydrationReady) {
        try {
          await waitForHydration();
          hydrationReady = true;
        } catch (error) {
          // Fallback: continue after delay if hydration check fails
          await new Promise(resolve => setTimeout(resolve, 200));
          hydrationReady = true;
        }
      }

      const heroSection = heroSectionRef.current || mainContentRef.current;
      if (!heroSection) {
        // Retry after a short delay if ref not available
        retryTimeout = setTimeout(setupObserver, 50);
        return;
      }

      // Ensure container has valid dimensions before proceeding
      if (!hasValidDimensions(heroSection)) {
        retryTimeout = setTimeout(setupObserver, 50);
        return;
      }

      // Check if already visible on mount
      const checkVisibility = () => {
        const rect = heroSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !shouldLoadSpline) {
          setShouldLoadSpline(true);
          return true;
        }
        return false;
      };

      // Check immediately (in case already visible)
      if (checkVisibility()) {
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // When hero section becomes visible, trigger Spline loading
            if (entry.isIntersecting && !shouldLoadSpline) {
              setShouldLoadSpline(true);
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 10% of hero is visible
          rootMargin: '50px', // Start loading slightly before it's fully visible
        }
      );

      observer.observe(heroSection);

      // Fallback: Load on user interaction (scroll or mouse move) if not visible yet
      handleInteraction = () => {
        if (!shouldLoadSpline && !splineScriptLoaded) {
          clearTimeout(interactionTimeout);
          interactionTimeout = setTimeout(() => {
            if (!shouldLoadSpline) {
              setShouldLoadSpline(true);
            }
          }, 500); // Small delay to avoid loading on every scroll
        }
      };

      window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
      window.addEventListener('mousemove', handleInteraction, { passive: true, once: true });
    };

    setupObserver();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (observer) observer.disconnect();
      if (interactionTimeout) clearTimeout(interactionTimeout);
      if (handleInteraction) {
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('mousemove', handleInteraction);
      }
    };
  }, [isMobile, shouldLoadSpline, splineScriptLoaded]);

  // Load Spline script only when shouldLoadSpline is true
  useEffect(() => {
    if (!shouldLoadSpline || isMobile || splineScriptLoaded) {
      return undefined;
    }

    // Load script with error handling
    loadSplineViewerScript()
      .then(() => {
        setSplineScriptLoaded(true);
      })
      .catch((err) => {
        // Silently fail - don't block page rendering
        console.warn('Spline viewer failed to load (non-critical):', err);
        setSplineScriptLoaded(false);
      });
  }, [shouldLoadSpline, isMobile, splineScriptLoaded]);

  // Original loading screen behavior - always show for 3 seconds
  useEffect(() => {
    // Always show loader on mount
    setShowLoading(true);
  }, []);

  // Fade in main content after loading is done
  useEffect(() => {
    if (loadingDone) {
      setFadeIn(true);
    }
  }, [loadingDone]);

  // Memoize the onFinish callback to prevent re-renders
  const handleLoadingFinish = useCallback(() => {
    setLoadingDone(true);
    setShowLoading(false);
  }, []);

  // Check container dimensions and visibility before initializing WebGL
  useEffect(() => {
    if (isMobile || !splineScriptLoaded || !loadingDone) {
      setContainerValid(false);
      return;
    }

    let hydrationReady = false;

    const checkContainerSize = async () => {
      // Wait for hydration before checking dimensions
      if (!hydrationReady) {
        try {
          await waitForHydration();
          hydrationReady = true;
        } catch (error) {
          // Fallback: continue after delay if hydration check fails
          await new Promise(resolve => setTimeout(resolve, 200));
          hydrationReady = true;
        }
      }

      const container = containerRef.current || heroSectionRef.current || mainContentRef.current;
      if (!container) {
        setContainerValid(false);
        return;
      }

      // Use hydration utility to check dimensions
      if (!hasValidDimensions(container)) {
        setContainerValid(false);
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Check if container is visible and has valid dimensions
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      const hasValidSize = width > 0 && height > 0;
      const isNotHidden = container.offsetParent !== null;
      
      const isValid = isVisible && hasValidSize && isNotHidden;
      setContainerValid(isValid);
    };

    // Initial check (async)
    checkContainerSize();

    // Set up ResizeObserver to monitor container size changes
    const container = containerRef.current || heroSectionRef.current || mainContentRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      checkContainerSize();
    });

    resizeObserver.observe(container);

    // Also check on scroll and window resize
    const handleResize = () => {
      checkContainerSize();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isMobile, splineScriptLoaded, loadingDone]);

  // Initialize robot fade-in when loading is done AND Spline script is loaded AND container is valid
  useEffect(() => {
    if (loadingDone && !isMobile && splineScriptLoaded && containerValid) {
      // Start robot fade-in animation after Spline is ready
      setTimeout(() => {
        setRobotFadeIn(true);
      }, 100); // Small delay to ensure smooth transition
    } else {
      setRobotFadeIn(false);
    }
  }, [loadingDone, isMobile, splineScriptLoaded, containerValid]);


  // Handle scroll arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <>
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}
      </style>
      {showLoading && !loadingDone && <LoadingScreen onFinish={handleLoadingFinish} />}
      <div
        id="main-content"
        className={`main-content home-entrance${fadeIn ? ' home-entrance-active' : ''}`}
        ref={(node) => {
          mainContentRef.current = node;
          heroSectionRef.current = node;
          containerRef.current = node;
        }}
        style={{
          opacity: fadeIn ? 1 : 0,
          pointerEvents: 'auto', // Always allow interaction - loader is non-blocking
        }}
      >
        <img className="image-gradient" src={process.env.PUBLIC_URL + '/gradient.png'} alt="" />
        <div className="layer-blur"></div>
        <div className="container">

          <main>
            <div 
              className="content home-content-entrance" 
              style={{
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)',
                marginTop: '-20rem',
                paddingTop: '2rem'
              }}
            >
              <h1>Creative Digital Solutions for Growing Brands.</h1>
              <p className="description">
                We combine data-driven strategy with creative storytelling to help
                your business stand out in a crowded digital world.
              </p>
              <div className="buttons">
                <div className="tag-box">
                  <Link to="/portfolio" className="tag">View our work &gt;</Link>
                </div>
                <Link to="/services" className="btn-sign-in-main">Get Started &gt;</Link>
              </div>
            </div>
                    </main>
           {/* Scroll Down Arrow - Only visible at top */}
           {showScrollArrow && (
             <div 
               className="scroll-arrow"
               style={{
                 position: 'absolute',
                 bottom: '10rem',
                 left: '50%',
                 transform: 'translateX(-50%)',
                 zIndex: 5,
                 animation: 'bounce 2s infinite',
                 cursor: 'pointer',
                 opacity: fadeIn ? 1 : 0,
                 transition: 'opacity 0.8s ease'
               }}
               onClick={() => {
                 window.scrollTo({
                   top: window.innerHeight,
                   behavior: 'smooth'
                 });
               }}
             >
               <svg 
                 width="32" 
                 height="32" 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 style={{
                   color: 'rgba(255, 255, 255, 0.8)',
                   filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                 }}
               >
                 <path d="M7 13l5 5 5-5"/>
                 <path d="M7 6l5 5 5-5"/>
               </svg>
             </div>
           )}
           
           {/* Subtitle text below the arrow */}
           <div 
             style={{
               position: 'absolute',
               bottom: '6rem',
               left: '50%',
               transform: 'translateX(-50%)',
               zIndex: 5,
               textAlign: 'center',
               opacity: fadeIn ? 1 : 0,
               transition: 'opacity 0.8s ease'
             }}
           >
             <p style={{
               color: 'rgba(255, 255, 255, 0.7)',
               fontSize: '1.5rem',
               fontWeight: '400',
               margin: 0,
               letterSpacing: '0.5px',
               textShadow: '0 2px 4px rgba(0,0,0,0.5)'
             }}>
               Discover how we transform brands through creative digital solutions
             </p>
           </div>
           
                      {/* Desktop 3D Robot - Loads only when hero section is visible and container has valid size */}
           {!isMobile && splineScriptLoaded && containerValid && (
             <spline-viewer 
              ref={splineRef}
              className="cbot robot-quick-fade" 
              url="https://prod.spline.design/7Xyc-4Wtw5VI1PDk/scene.splinecode"
              style={{
                width: '100%',
                height: '100%',
                minWidth: '1px',
                minHeight: '1px',
                zIndex: 0, // Ensure it's behind the main content
                marginTop: '-15rem', // Move robot up with the hero content
                opacity: (loadingDone && robotFadeIn) ? 1 : 0,
                transform: (loadingDone && robotFadeIn) ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                visibility: (loadingDone && containerValid) ? 'visible' : 'hidden', // Hide completely during loading or if container invalid
                filter: 'brightness(1.8) contrast(1.15)' // Brighten the robot's face
              }}
            />
           )}
           {/* Fallback placeholder for Spline (shows nothing, but maintains layout) */}
           {!isMobile && !splineScriptLoaded && (
             <div
               style={{
                 width: '100%',
                 height: '100%',
                 minWidth: '1px',
                 minHeight: '1px',
                 zIndex: 0,
                 marginTop: '-15rem',
                 opacity: 0,
                 pointerEvents: 'none',
               }}
               aria-hidden="true"
             />
           )}

          {/* Mobile Alternative Content */}
          {isMobile && (
            <div className="mobile-home-features" style={{
              position: 'absolute',
              top: '60%',
              right: '5%',
              width: '90%',
              maxWidth: '400px',
              zIndex: 2,
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              animationDelay: '0.3s'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                background: 'rgba(30, 30, 40, 0.8)',
                backdropFilter: 'blur(15px)',
                borderRadius: '20px',
                padding: '1.5rem',
                border: '1px solid rgba(127, 66, 167, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(127, 66, 167, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(127, 66, 167, 0.2)'
                }}>
                  <Sparkles style={{ width: 24, height: 24, color: '#7f42a7', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Creative Design</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(127, 66, 167, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(127, 66, 167, 0.2)'
                }}>
                  <Target style={{ width: 24, height: 24, color: '#7f42a7', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Strategic Growth</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(127, 66, 167, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(127, 66, 167, 0.2)'
                }}>
                  <Users style={{ width: 24, height: 24, color: '#7f42a7', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Client Focus</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  background: 'rgba(127, 66, 167, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(127, 66, 167, 0.2)'
                }}>
                  <Award style={{ width: 24, height: 24, color: '#7f42a7', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#fff' }}>Quality Results</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Additional Scrollable Sections with Enhanced Animations */}
        
        {/* Section 1 - Brand Value Proposition */}
        <section 
          ref={section1Ref}
          className="scroll-section value-proposition"
          style={{
            opacity: 1, // Always visible - no flicker
            transform: section1Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section1Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <div className="container">
            <div className="section-content">
              <h2 className="section-headline">
                Your Brand Deserves More Than Just "Online Presence"
              </h2>
              <p className="section-description">
                The digital space is crowded and fast-moving—generic templates won't help you stand out.
              </p>
                             <div className="value-points-grid">
                                 <div className="value-card">
                  <div className="value-card-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="tickGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                        </linearGradient>
                      </defs>
                      <path d="M20,6 L9,17 L4,12" stroke="url(#tickGradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Creative Content</h3>
                  <p>Content that captures attention and drives engagement</p>
                </div>
                <div className="value-card" 
 
 


                >
                  <div className="value-card-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="tickGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                        </linearGradient>
                      </defs>
                      <path d="M20,6 L9,17 L4,12" stroke="url(#tickGradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Converting Campaigns</h3>
                  <p>Campaigns that turn followers into loyal customers</p>
                </div>
                <div className="value-card">
                  <div className="value-card-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="tickGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="0.6"/>
                          <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                        </linearGradient>
                      </defs>
                      <path d="M20,6 L9,17 L4,12" stroke="url(#tickGradient3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Growth Solutions</h3>
                  <p>Web & app solutions that scale with your business</p>
                </div>
               </div>
              <div className="value-promise">
                <strong>Shyara gives you the expertise of a digital team with the flexibility of a freelance team, delivering real results without inflated costs.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Services */}
        <div 
          ref={section2Ref}
          className="scroll-animate" 
          style={{ 
            marginBottom: '6rem',
            opacity: 1, // Always visible - no flicker
            transform: section2Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section2Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="Your Brand, Supercharged – All Under One Roof" />
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto'
          }}>
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
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
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Social Media Management</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>From posts to reels, we handle it all.</p>
            </div>
            
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
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
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Festive Post Designs</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Ready-to-share festival creatives for instant visibility.</p>
            </div>
            
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
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
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Ads Campaign Management</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>High-ROI campaigns with free creatives, for your targeted Audience.</p>
            </div>
            
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
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
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Web Development</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Fast, responsive, SEO-ready sites.</p>
            </div>
            
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
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
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>App Development</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Custom Android & iOS apps.</p>
            </div>
            
            <div className="service-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="service-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Video & Reels Editing</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Professional edits for viral content.</p>
            </div>
          </div>
        </div>

        {/* Section 3 - Why Choose Shyara */}
        <div 
          ref={section3Ref}
          className="scroll-animate" 
          style={{ 
            marginBottom: '6rem',
            opacity: 1, // Always visible - no flicker
            transform: section3Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section3Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="The Shyara Advantage" />
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto',
            marginBottom: '3rem'
          }}>
            <div className="advantage-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="advantage-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Users size={40} />
              </div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Freelancer-Driven</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Agile, creative, and handpicked experts.</p>
            </div>
            
            <div className="advantage-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="advantage-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Zap size={40} />
              </div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Modular & Scalable</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Pay only for what you need.</p>
            </div>
            
            <div className="advantage-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="advantage-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <TrendingUp size={40} />
              </div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>Results-Obsessed</h3>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>Focused on sales, engagement, and measurable growth.</p>
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            maxWidth: 700,
            margin: '0 auto'
          }}>
            <div className="stat-item" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 16,
                padding: '1rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <span className="stat-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </span>
              <span className="stat-text" style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>100+ Brands Served</span>
            </div>
            
            <div className="stat-item" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 16,
                padding: '1rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <span className="stat-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </span>
              <span className="stat-text" style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>Avg. 35% Engagement Boost</span>
            </div>
            
            <div className="stat-item" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 16,
                padding: '1rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <span className="stat-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <span className="stat-text" style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}>4.9/5 Client Rating</span>
            </div>
          </div>
        </div>

        {/* Section 4 - Client Testimonials */}
        <div 
          ref={section4Ref}
          className="scroll-animate" 
          style={{ 
            marginBottom: '6rem',
            opacity: 1, // Always visible - no flicker
            transform: section4Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section4Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="What Our Clients Say" />
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto'
          }}>
            <div className="testimonial-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="testimonial-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p style={{ 
                color: 'var(--color-text-primary)', 
                lineHeight: 1.6,
                fontSize: '1.1rem',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>"Shyara's ads turned our slow season into our busiest quarter yet!"</p>
              <div className="testimonial-author" style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>— Priya S., Startup Founder</div>
            </div>
            
            <div className="testimonial-card" 
 
 


              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                textAlign: 'center'
              }}
            >
              <div className="testimonial-icon" style={{
                background: 'rgba(162,89,247,0.15)',
                color: 'var(--color-primary)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p style={{ 
                color: 'var(--color-text-primary)', 
                lineHeight: 1.6,
                fontSize: '1.1rem',
                marginBottom: '1rem',
                fontStyle: 'italic'
              }}>"Their festive posts made our brand instantly recognizable in local markets."</p>
              <div className="testimonial-author" style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>— Rahul M., Business Owner</div>
            </div>
          </div>
        </div>


        {/* Section 5 - Contact */}
        <div 
          ref={section5Ref}
          className="scroll-animate" 
          style={{ 
            marginBottom: '6rem',
            opacity: 1, // Always visible - no flicker
            transform: section5Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section5Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontWeight: '700', 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="Have Questions? Let's Talk." />
          </h2>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/contact" 
 
 


              style={{
                background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '1.1rem',
                border: 'none',
                borderRadius: 16,
                padding: '1.5rem 3rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 24px rgba(162,89,247,0.3)',
                transform: 'scale(1)',
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                maxWidth: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(162,89,247,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(162,89,247,0.3)';
              }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 9.5V5a2.5 2.5 0 0 1 5 0v4.5"/>
                  <path d="M9.5 9.5V5a2.5 2.5 0 0 1 5 0v4.5"/>
                  <path d="M14.5 9.5V5a2.5 2.5 0 0 1 5 0v4.5"/>
                  <path d="M19.5 9.5V5a2.5 2.5 0 0 1 5 0v4.5"/>
                  <path d="M4.5 9.5v9a2.5 2.5 0 0 0 5 0v-9"/>
                  <path d="M9.5 9.5v9a2.5 2.5 0 0 0 5 0v-9"/>
                  <path d="M14.5 9.5v9a2.5 2.5 0 0 0 5 0v-9"/>
                  <path d="M19.5 9.5v9a2.5 2.5 0 0 0 5 0v-9"/>
                </svg>
              </span>
              Send Message & Get a Reply Within 24 Hours
            </Link>
          </div>
        </div>

        {/* Section 6 - Final Trust Close */}
        <div 
          ref={section6Ref}
          className="scroll-animate" 
          style={{ 
            marginBottom: '6rem',
            opacity: 1, // Always visible - no flicker
            transform: section6Visible ? 'translateY(0)' : 'translateY(20px)',
            transition: section6Visible ? 'transform 0.6s ease-out' : 'none',
          }}
        >
          <div style={{
            background: 'rgba(30,30,30,0.55)',
            borderRadius: 28,
            padding: '3rem',
            boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
            border: '1.5px solid rgba(127,66,167,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)', 
              marginBottom: '2rem',
              lineHeight: 1.3
            }}>
              Not Just a Service – A Growth Partner
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              At Shyara, we don't just deliver work; we invest in your success. Whether you're a startup, creator, or growing business, we're here to scale your digital presence—fast.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home; 
