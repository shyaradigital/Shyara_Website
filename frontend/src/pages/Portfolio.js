import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import FancyText from '../components/FancyText';
import DriveMockupModal from '../components/portfolio/DriveMockupModal';

const IMAGE_EXTENSION_REGEX = /\.(png|jpe?g)$/i;
const PICS_PREFIX = '/pics/';
const PREFETCH_INITIAL_COUNT = 6;
const MIN_LOADER_DURATION = 800; // ms

const prefetchSingleMedia = (sample, signal) => {
  if (signal?.aborted || typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (sample.mediaType === 'image') {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'eager';
      img.src = sample.img;
      img.onload = img.onerror = () => resolve();
    });
  }

  return fetch(sample.img, {
    mode: 'no-cors',
    cache: 'force-cache',
    signal
  }).catch(() => {}).then(() => undefined);
};

const prefetchMediaAssets = async (samples, { signal, onProgress } = {}) => {
  let completed = 0;
  for (const sample of samples) {
    if (signal?.aborted) break;
    await prefetchSingleMedia(sample, signal);
    completed += 1;
    onProgress?.(completed);
  }
};

const resolveMediaSources = (originalUrl) => {
  const normalized = (originalUrl || '').replace(/\\/g, '/');
  const picsIndex = normalized.indexOf(PICS_PREFIX);

  if (picsIndex === -1) {
    return {
      optimized: normalized,
      fallback: normalized,
      mediaType: IMAGE_EXTENSION_REGEX.test(normalized) ? 'image' : 'video',
    };
  }

  const relativePath = normalized.slice(picsIndex + PICS_PREFIX.length);
  const fallback = `${process.env.PUBLIC_URL}${PICS_PREFIX}${relativePath}`;

  if (IMAGE_EXTENSION_REGEX.test(relativePath)) {
    return {
      optimized: `${process.env.PUBLIC_URL}/pics-optimized/${relativePath}`.replace(
        IMAGE_EXTENSION_REGEX,
        '.webp',
      ),
      fallback,
      mediaType: 'image',
    };
  }

  return {
    optimized: `${process.env.PUBLIC_URL}/pics-optimized/${relativePath}`,
    fallback,
    mediaType: 'video',
  };
};

const attachOptimizedMedia = (services) =>
  services.map((service) => ({
    ...service,
    samples: (service.samples || []).map((sample) => {
      const sources = resolveMediaSources(sample.img);
      return {
        ...sample,
        img: sources.optimized,
        fallbackImg: sources.fallback,
        mediaType: sources.mediaType,
      };
    }),
  }));

// Lazy Image Component with Intersection Observer
const LazyImage = ({ src, fallbackSrc, alt, style, onLoad, onError, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      setCurrentSrc(src);
    }
  }, [isInView, src]);

  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    if (onError) onError(event);
  };

  return (
    <img
      ref={imgRef}
      src={isInView ? currentSrc : undefined}
      alt={alt}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease-in-out',
      }}
      loading="lazy"
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  );
};

// Lazy Video Component with Intersection Observer
const LazyVideo = ({ src, fallbackSrc, style, onLoadedData, onError, ...props }) => {
  const [isInView, setIsInView] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const currentRef = videoRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      setCurrentSrc(src);
    }
  }, [isInView, src]);

  const handleError = (event) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    if (onError) onError(event);
  };

  return (
    <video
      ref={videoRef}
      src={isInView ? currentSrc : undefined}
      style={style}
      preload="metadata"
      onLoadedData={onLoadedData}
      onError={handleError}
      {...props}
    />
  );
};

const rawPortfolioServices = [
  {
    service: 'Social Media Management',
    description: 'Creative content, engaging posts, and strategic social media campaigns',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/smm-thumbnail.png',
    results: 'Average 60% increase in followers, 45% boost in engagement'
  },
  {
    service: 'Website Development',
    description: 'Modern, responsive websites that convert visitors into customers',
    samples: [
      { img: process.env.PUBLIC_URL + '/mockups/Shyara_premium_restaurant_sample_1.PNG', title: 'Premium Restaurant', description: 'Elegant fine-dining experience with curated menus', mockup: process.env.PUBLIC_URL + '/mockups/Shyara_premium_restaurant_sample_1.html' },
      { img: process.env.PUBLIC_URL + '/mockups/Shyara_BurgerCafe.PNG', title: 'Burger Cafe Concept', description: 'Playful landing page for a quick-service cafe brand', mockup: process.env.PUBLIC_URL + '/mockups/Shyara_BurgerCafe.html' },
      { img: process.env.PUBLIC_URL + '/mockups/Shyara_Restaurant_Sample_1.PNG', title: 'Corporate Restaurant', description: 'Upscale dining website with reservation flow', mockup: process.env.PUBLIC_URL + '/mockups/Shyara_Restaurant_Sample_1.html' },
      { img: process.env.PUBLIC_URL + '/mockups/Shyara_Banquete_Website.PNG', title: 'Banquete Experience', description: 'Multi-page banquet showcase with CTA driven sections', mockup: process.env.PUBLIC_URL + '/mockups/Shyara_Banquete_Website.html' },
    ],
    results: '40% more bookings, improved lead generation and conversion rates'
  },
  {
    service: 'App Development',
    description: 'Cross-platform mobile applications that solve real problems',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/app-dev-thumbnail.png',
    results: 'Launched within 8 weeks, secured initial funding'
  },
  {
    service: 'Video Editing & Reels',
    description: 'Engaging video content that captures attention and drives engagement',
    samples: [], // Now using Google Drive - videos loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/video-reels-thumbnail.png',
    results: 'Tripled follower count, boosted engagement significantly'
  },
  {
    service: 'Ad Campaign Management',
    description: 'Strategic advertising campaigns that deliver measurable results',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/ads-thumbnail.png',
    results: '30% increase in sales, 25% reduction in acquisition cost'
  },
  {
    service: 'Festive Posts',
    description: 'Special occasion content and festive celebrations for brands',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/festive-thumbnail.png',
    results: 'Enhanced brand engagement during special occasions and festivals'
  }
];

const portfolioServices = attachOptimizedMedia(rawPortfolioServices);

// Portfolio category types
const PortfolioCategory = {
  SMM: 'SMM',
  ADS: 'ADS',
  APP_DEV: 'APP_DEV',
  REELS: 'REELS',
  FESTIVE: 'FESTIVE',
  WEBSITE_DEV: 'WEBSITE_DEV'
};

// Google Drive folder IDs mapping
const DRIVE_FOLDER_IDS = {
  [PortfolioCategory.SMM]: '1AUVLMsKOhDkiE4gzPPI84cY19Wo5BVvT',
  [PortfolioCategory.ADS]: '1gpUYQ2CwvVpaR-rBc082en8yHoMIbeW7',
  [PortfolioCategory.APP_DEV]: '1I9qFffnhctJwVEprMa0u4PerZJUhMHwU',
  [PortfolioCategory.REELS]: '1EMh6UMcshbub8A-g2ZyH8-6oQNSgQ3op',
  [PortfolioCategory.FESTIVE]: '1YojPkvfm2s_PjG2ZwimarcJZmggGKwvj',
  [PortfolioCategory.WEBSITE_DEV]: null // Keep existing behavior
};

const HERO_METRICS = [
  { label: 'Brand lifts delivered', value: '140+', accent: '#a259f7', title: 'Projects Delivered' },
  { label: 'Avg. engagement jump', value: '+45%', accent: '#66e4a8', title: 'Engagement Growth' },
  { label: 'Time to first delivery', value: '72 hrs', accent: '#7bd3ff', title: 'Delivery Speed' },
  { label: 'Average client rating', value: '4.9/5', accent: '#ffd93d', title: 'Client Satisfaction' },
];

// Helper function to get category from service name
const getCategoryFromService = (serviceName) => {
  const name = serviceName.toLowerCase();
  if (name.includes('social media')) return PortfolioCategory.SMM;
  if (name.includes('ad campaign') || name.includes('ads')) return PortfolioCategory.ADS;
  if (name.includes('app development')) return PortfolioCategory.APP_DEV;
  if (name.includes('video editing') || name.includes('reels')) return PortfolioCategory.REELS;
  if (name.includes('festive')) return PortfolioCategory.FESTIVE;
  if (name.includes('website')) return PortfolioCategory.WEBSITE_DEV;
  return null;
};

// Helper functions to get portfolio metadata
const getPortfolioTitle = (category) => {
  if (!category) return '';
  const service = portfolioServices.find(s => getCategoryFromService(s.service) === category);
  return service?.service || '';
};

const getPortfolioSubtitle = (category) => {
  if (!category) return '';
  const service = portfolioServices.find(s => getCategoryFromService(s.service) === category);
  return service?.description || '';
};

const getPortfolioBadge = (category) => {
  if (!category) return '';
  const service = portfolioServices.find(s => getCategoryFromService(s.service) === category);
  return service?.results || '';
};

const PortfolioModal = ({ isOpen, onClose, service }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMockup, setShowMockup] = useState(false);
  const mockupHistoryAddedRef = useRef(false);

  const samples = service?.samples ?? [];
  const sampleCount = samples.length || 1;
  const currentSample = samples[currentImageIndex] ?? samples[0];
  const hasContent = Boolean(isOpen && service && currentSample);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sampleCount);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sampleCount) % sampleCount);
  };

  // Handle browser back button/swipe back for mockup view
  useEffect(() => {
    const handlePopState = () => {
      // Close mockup view when user swipes back
      if (showMockup && mockupHistoryAddedRef.current) {
        mockupHistoryAddedRef.current = false;
        setShowMockup(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showMockup]);

  // Push history state when mockup opens
  useEffect(() => {
    if (showMockup && !mockupHistoryAddedRef.current) {
      window.history.pushState({ mockup: true }, '');
      mockupHistoryAddedRef.current = true;
    }
  }, [showMockup]);

  useEffect(() => {
    setShowMockup(false);
    mockupHistoryAddedRef.current = false;
  }, [service, currentImageIndex]);

  if (!hasContent) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '0',
        paddingTop: '85px',
        paddingBottom: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
      onClick={handleBackdropClick}
    >
      <div className="portfolio-modal" style={{
        background: 'rgba(18,18,24,0.94)',
        borderRadius: 18,
        padding: '1.5rem',
        maxWidth: 900,
        width: '92%',
        maxHeight: 'calc(90vh - 85px)',
        overflow: 'auto',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        position: 'relative',
        scrollbarWidth: 'thin',
        scrollbarColor: '#a259f7 #1e1e28'
      }}>
        <style>
          {`
            .portfolio-modal::-webkit-scrollbar {
              width: 8px;
            }
            .portfolio-modal::-webkit-scrollbar-track {
              background: #1e1e28;
              border-radius: 4px;
            }
            .portfolio-modal::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #a259f7 0%, #7f42a7 100%);
              border-radius: 4px;
            }
          `}
        </style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#d4d4d8',
              cursor: 'pointer',
              borderRadius: 10,
              padding: '8px 10px',
              minWidth: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
          <div style={{ flex: 1, textAlign: 'right', color: '#c6c8d5', fontSize: 14 }}>
            {currentImageIndex + 1} / {samples.length}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ color: '#f7f8fb', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.2 }}>
            {service.service}
          </h2>
          <p style={{ color: '#c7c9d4', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
            {service.description}
          </p>
          {service.results && (
            <div style={{
              marginTop: 10,
              background: 'rgba(15, 24, 18, 0.7)',
              border: '1px solid rgba(29, 59, 38, 0.8)',
              borderRadius: 12,
              padding: '10px 12px',
              color: '#4ade80',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              {service.results.split(', ').map((part, index) => (
                <div key={index} style={{ marginBottom: index < service.results.split(', ').length - 1 ? '4px' : 0 }}>
                  {part}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{
            width: '100%',
            maxHeight: 'min(70vh, 520px)',
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            background: '#0f0f15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentSample.mediaType === 'video' ? (
              <LazyVideo
                src={currentSample.img}
                fallbackSrc={currentSample.fallbackImg}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 'min(70vh, 520px)',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <LazyImage
                src={currentSample.img}
                fallbackSrc={currentSample.fallbackImg}
                alt={currentSample.title}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 'min(70vh, 520px)',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            )}
            
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: 10,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={18} />
            </button>
            
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: 10,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(30,30,40,0.5)', 
          borderRadius: 12, 
          padding: '14px 16px', 
          marginBottom: 16,
          border: '1px solid rgba(162,89,247,0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#e7e7e7', fontSize: '1.2rem', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
            {currentSample.title}
          </h3>
          <p style={{ color: '#bdbdbd', fontSize: '0.95rem', lineHeight: 1.5, textAlign: 'center', margin: 0 }}>
            {currentSample.description}
          </p>
          {currentSample.mockup && (
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowMockup(true)}
                style={{
                  background: 'linear-gradient(90deg,#7f42a7,#a259f7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.55rem 1.3rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(162,89,247,0.35)'
                }}
              >
                Interactive Preview
              </button>
              <button
                onClick={() => window.open(currentSample.mockup, '_blank', 'noopener,noreferrer')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e7e7e7',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 999,
                  padding: '0.55rem 1.3rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Open →
              </button>
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 10, 
          justifyContent: 'flex-start', 
          marginTop: 12,
          flexWrap: 'wrap',
          padding: '12px 0',
          borderTop: '1px solid rgba(162,89,247,0.08)'
        }}>
          {samples.map((sample, index) => {
            const isVideo = sample.mediaType === 'video';
            return (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: currentImageIndex === index ? '2px solid #a259f7' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                  position: 'relative'
                }}
              >
                {isVideo ? (
                  <LazyVideo
                    src={sample.img}
                    fallbackSrc={sample.fallbackImg}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    muted
                    playsInline
                  />
                ) : (
                  <LazyImage
                    src={sample.img}
                    fallbackSrc={sample.fallbackImg}
                    alt={sample.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      if (process.env.NODE_ENV === 'development') {
                        console.warn(`Failed to load thumbnail: ${sample.img}`);
                      }
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                {isVideo && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(162,89,247,0.8)',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid white',
                      borderTop: '3px solid transparent',
                      borderBottom: '3px solid transparent',
                      marginLeft: 1
                    }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {currentSample.mockup && showMockup && (
        <div 
          onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) {
              if (mockupHistoryAddedRef.current) {
                mockupHistoryAddedRef.current = false;
                window.history.back();
              } else {
                setShowMockup(false);
              }
            }
          }}
          style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 20000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '4rem 2rem 2rem'
        }}>
          <div style={{
            background: '#05050b',
            borderRadius: 16,
            border: '1px solid rgba(162,89,247,0.3)',
            width: '100%',
            maxWidth: '1100px',
            height: '90vh',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button
              onClick={() => {
                // If we added a history state, go back to remove it
                if (mockupHistoryAddedRef.current) {
                  mockupHistoryAddedRef.current = false;
                  window.history.back();
                } else {
                  setShowMockup(false);
                }
              }}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: 999,
                color: '#fff',
                padding: '0.4rem 0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              Close
            </button>
            <iframe
              title={currentSample.title}
              src={currentSample.mockup}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 'inherit',
                marginTop: '2.25rem',
                background: '#fff'
              }}
              sandbox="allow-same-origin allow-scripts allow-forms allow-pointer-lock allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceCard = ({ service, onOpenModal, index }) => {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if service has samples (like Website Development)
  const hasSamples = service.samples && service.samples.length > 0;
  const thumbnail = hasSamples ? service.samples[0] : null;
  const thumbnailUrl = thumbnail ? thumbnail.img : service.thumbnail;
  const isVideo = thumbnail && thumbnail.mediaType === 'video';

  return (
    <div
      className="portfolio-card-modern"
      tabIndex={0}
      style={{
        animationDelay: `${index * 0.08}s`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onOpenModal(service)}
    >
      {/* Image Container */}
      <div style={{
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        {/* Loading Skeleton */}
        {!imageLoaded && thumbnailUrl && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }} />
        )}
        
        {thumbnailUrl ? (
          <>
            {isVideo ? (
              <LazyVideo
                src={thumbnail.img}
                fallbackSrc={thumbnail.fallbackImg}
                className="portfolio-card-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                muted
                loop
                playsInline
                onLoadedData={() => setImageLoaded(true)}
              />
            ) : (
              <img
                src={thumbnailUrl}
                alt={service.service}
                className="portfolio-card-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: imageLoaded ? 1 : 0.8,
                  transition: 'opacity 0.3s ease-in-out'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to load thumbnail:', thumbnailUrl);
                  }
                  setImageLoaded(true);
                }}
              />
            )}

            {/* Sample Count Badge - Only show for services with multiple samples */}
            {hasSamples && service.samples.length > 1 && (
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {service.samples.length} items
              </div>
            )}
            
            {/* Gallery Badge - Show for services using Google Drive */}
            {!hasSamples && thumbnailUrl && (
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(162, 89, 247, 0.85)',
                backdropFilter: 'blur(8px)',
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(162, 89, 247, 0.3)',
                boxShadow: '0 2px 8px rgba(162, 89, 247, 0.3)'
              }}>
                Gallery
              </div>
            )}

            {/* Hover Overlay */}
            {hovered && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.25rem',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <span style={{
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  opacity: 0.9
                }}>
                  View Gallery →
                </span>
              </div>
            )}
          </>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.75rem',
            color: 'rgba(162,89,247,0.4)'
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.5 }}>📁</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', padding: '0 1rem', color: 'rgba(255,255,255,0.4)' }}>
              View Gallery
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="portfolio-card-content">
        <h3 style={{ 
          fontWeight: 600, 
          fontSize: 'clamp(1rem, 2vw, 1.1rem)', 
          color: '#f5f5f7', 
          margin: '0 0 0.5rem 0',
          lineHeight: 1.3
        }}>
          {service.service}
        </h3>
        <p style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)', 
          margin: 0,
          lineHeight: 1.5
        }}>
          {service.results}
        </p>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  
  // Drive modal state
  const [activeCategory, setActiveCategory] = useState(null);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Track if we added a history state for modals
  const modalHistoryAdded = useRef(false);

  // Prevent Spline from loading on Portfolio page
  useEffect(() => {
    // Remove any Spline scripts that might have been loaded
    const splineScripts = document.querySelectorAll('script[src*="spline"]');
    splineScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // Remove any Spline viewer elements
    const splineViewers = document.querySelectorAll('spline-viewer');
    splineViewers.forEach(viewer => {
      if (viewer.parentNode) {
        viewer.parentNode.removeChild(viewer);
      }
    });

    // Clean up WebGL contexts that might be interfering
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (gl) {
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    });

    // Prevent Spline script from loading if it hasn't loaded yet
    const originalAppendChild = document.body.appendChild;
    document.body.appendChild = function(node) {
      if (node.tagName === 'SCRIPT' && node.src && node.src.includes('spline')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Blocked Spline script from loading on Portfolio page');
        }
        return node; // Return without appending
      }
      return originalAppendChild.call(document.body, node);
    };

    return () => {
      // Restore original appendChild on unmount
      document.body.appendChild = originalAppendChild;
    };
  }, []);

  // Only Website Development uses local images now (all others use Google Drive)
  const allSamples = useMemo(
    () => portfolioServices.flatMap((service) => service.samples),
    []
  );
  const initialPrefetchSamples = useMemo(
    () => allSamples.slice(0, PREFETCH_INITIAL_COUNT),
    [allSamples]
  );

  // Skip loader if no local images to prefetch (all services use Drive)
  useEffect(() => {
    if (!initialPrefetchSamples.length) {
      setShowLoader(false);
      return undefined;
    }

    let isMounted = true;
    const controller = new AbortController();
    const startTime = performance.now();

    prefetchMediaAssets(initialPrefetchSamples, {
      signal: controller.signal,
      onProgress: (count) => {
        if (isMounted) {
          setPrefetchProgress(count);
        }
      }
    }).finally(() => {
      const elapsed = performance.now() - startTime;
      const wait = Math.max(MIN_LOADER_DURATION - elapsed, 0);
      setTimeout(() => {
        if (isMounted) {
          setShowLoader(false);
        }
      }, wait);
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [initialPrefetchSamples]);

  useEffect(() => {
    if (showLoader || allSamples.length <= PREFETCH_INITIAL_COUNT) return undefined;

    const remainingSamples = allSamples.slice(PREFETCH_INITIAL_COUNT);
    let cancelled = false;
    let idleId;

    const runPrefetch = () => {
      if (cancelled) return;
      prefetchMediaAssets(remainingSamples);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(runPrefetch, { timeout: 2000 });
    } else {
      idleId = setTimeout(runPrefetch, 600);
    }

    return () => {
      cancelled = true;
      if (typeof idleId === 'number') {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
    };
  }, [showLoader, allSamples]);

  // Handle browser back button/swipe back
  useEffect(() => {
    const handlePopState = () => {
      // If modal is open, close it when user swipes back
      if (isModalOpen) {
        setIsModalOpen(false);
        setSelectedService(null);
        modalHistoryAdded.current = false;
      }
      if (driveModalOpen) {
        setDriveModalOpen(false);
        setActiveCategory(null);
        modalHistoryAdded.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModalOpen, driveModalOpen]);

  const handleOpenModal = (service) => {
    if (!service) return;
    
    const category = getCategoryFromService(service.service);
    
    // Push state to history BEFORE opening modal for back button handling
    if (!modalHistoryAdded.current) {
      window.history.pushState({ modal: true }, '');
      modalHistoryAdded.current = true;
    }
    
    // If Website Development, use existing gallery modal
    if (category === PortfolioCategory.WEBSITE_DEV) {
      setSelectedService(service);
      setIsModalOpen(true);
      return;
    }
    
    // For all other categories, use Drive modal
    if (category && DRIVE_FOLDER_IDS[category]) {
      setActiveCategory(category);
      setDriveModalOpen(true);
    } else {
      // Fallback: if no category or folder ID, try to use regular modal if service has samples
      if (service.samples && service.samples.length > 0) {
        setSelectedService(service);
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    // If we added a history state, go back to remove it
    if (modalHistoryAdded.current) {
      modalHistoryAdded.current = false;
      window.history.back();
    }
  };

  const handleDriveModalClose = (open) => {
    setDriveModalOpen(open);
    if (!open) {
      setActiveCategory(null);
      // If we added a history state, go back to remove it
      if (modalHistoryAdded.current) {
        modalHistoryAdded.current = false;
        window.history.back();
      }
    }
  };

  const handleCategoryPreview = (category) => {
    const folderId = DRIVE_FOLDER_IDS[category];
    if (!folderId) return;
    setActiveCategory(category);
    setDriveModalOpen(true);
  };

  const loaderProgress = initialPrefetchSamples.length
    ? Math.min(
        Math.round((prefetchProgress / initialPrefetchSamples.length) * 100),
        100
      )
    : 100;

  // Filter services based on selected category
  const filteredServices = selectedCategory === 'all' 
    ? portfolioServices 
    : portfolioServices.filter(service => getCategoryFromService(service.service) === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: PortfolioCategory.SMM, label: 'Social Media' },
    { id: PortfolioCategory.WEBSITE_DEV, label: 'Websites' },
    { id: PortfolioCategory.APP_DEV, label: 'Apps' },
    { id: PortfolioCategory.REELS, label: 'Video & Reels' },
    { id: PortfolioCategory.ADS, label: 'Campaigns' },
    { id: PortfolioCategory.FESTIVE, label: 'Festive' }
  ];

  return (
  <div className="portfolio-page-wrapper" style={{ minHeight: '100vh', color: '#f5f5f7', padding: '0', paddingTop: '82px', marginTop: '-110px', fontFamily: 'inherit', background: 'transparent' }}>
    
    {/* Compact Hero Section */}
    <div className="portfolio-hero" style={{
      width: '100%',
      padding: '0 clamp(1rem, 5vw, 2rem) clamp(1rem, 2vw, 1.25rem)',
      textAlign: 'center',
      background: 'transparent',
      margin: '0',
      marginTop: '-100px'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        marginBottom: '0.625rem',
        padding: 0,
        lineHeight: 1.05,
        letterSpacing: '-0.02em'
      }}>
        Our Work
      </h1>
      <p style={{
        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
        color: 'rgba(255, 255, 255, 0.6)',
        lineHeight: 1.4,
        margin: '0 auto',
        maxWidth: '600px',
        fontWeight: 400
      }}>
        Transforming brands through creative digital experiences
      </p>
    </div>

    <style>
      {`
        /* Modern Portfolio Styles - Override site-main padding */
        .portfolio-page-wrapper {
          margin-top: -110px !important;
          padding-top: 82px !important;
        }
        
        /* Hero Section - Aggressive Negative Margin to Push Up */
        .portfolio-hero {
          margin: 0 !important;
          margin-top: -100px !important;
          padding-top: 0 !important;
        }
        
        .portfolio-hero h1 {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        
        .portfolio-hero p {
          margin-top: 0 !important;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .portfolio-page-wrapper {
            margin-top: -80px !important;
            padding-top: 82px !important;
          }
          .portfolio-hero {
            padding: 0 1rem 0.875rem !important;
            margin: 0 !important;
            margin-top: -90px !important;
          }
          .portfolio-hero h1 {
            font-size: 1.75rem !important;
            line-height: 1 !important;
            margin: 0 0 0.5rem 0 !important;
          }
          .portfolio-hero p {
            font-size: 0.9rem !important;
            line-height: 1.3 !important;
            margin: 0 !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .portfolio-page-wrapper {
            margin-top: -80px !important;
            padding-top: 82px !important;
          }
          .portfolio-hero {
            padding: 0 1.5rem 1rem !important;
            margin: 0 !important;
            margin-top: -95px !important;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        /* Category Tabs Wrapper */
        .category-tabs-wrapper {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }
        
        /* Category Filter Tabs - Scrollable */
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          padding: 0 1rem 0.5rem 1rem;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(162, 89, 247, 0.3) transparent;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
        }
        
        .category-tabs::-webkit-scrollbar {
          height: 4px;
        }
        
        .category-tabs::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .category-tabs::-webkit-scrollbar-thumb {
          background: rgba(162, 89, 247, 0.3);
          border-radius: 2px;
        }
        
        .category-tabs::-webkit-scrollbar-thumb:hover {
          background: rgba(162, 89, 247, 0.5);
        }
        
        /* Desktop - Centered */
        @media (min-width: 1025px) {
          .category-tabs {
            justify-content: center;
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }
        
        /* Tablet - Scrollable */
        @media (min-width: 641px) and (max-width: 1024px) {
          .category-tabs {
            justify-content: flex-start;
            scrollbar-width: thin;
            padding-bottom: 0.75rem;
          }
          
          .category-tabs::-webkit-scrollbar {
            height: 6px;
          }
        }
        
        /* Mobile - Scrollable with visible scrollbar */
        @media (max-width: 640px) {
          .category-tabs {
            justify-content: flex-start;
            padding: 0 0.75rem 0.75rem 0.75rem;
            gap: 0.625rem;
          }
          
          .category-tabs::-webkit-scrollbar {
            height: 5px;
          }
        }
        
        .category-tab {
          flex-shrink: 0;
          padding: 0.625rem 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          scroll-snap-align: start;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        /* Mobile specific tab styling */
        @media (max-width: 640px) {
          .category-tab {
            padding: 0.5rem 1rem;
            font-size: 0.8125rem;
          }
        }
        
        .category-tab:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(162, 89, 247, 0.3);
        }
        
        .category-tab.active {
          background: rgba(162, 89, 247, 0.15);
          border-color: rgba(162, 89, 247, 0.5);
          color: #c4b5fd;
        }
        
        /* Modern Gallery Grid */
        .portfolio-grid-modern {
          display: grid;
          gap: 1rem;
          padding: 0 1rem;
          animation: fadeInUp 0.5s ease-out;
        }
        
        @media (max-width: 640px) {
          .portfolio-grid-modern {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .portfolio-grid-modern {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
            padding: 0 1.5rem;
          }
        }
        
        @media (min-width: 1025px) {
          .portfolio-grid-modern {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            padding: 0 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }
        }
        
        /* Modern Card Styles */
        .portfolio-card-modern {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: slideIn 0.4s ease-out;
          animation-fill-mode: both;
        }
        
        .portfolio-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(162, 89, 247, 0.2);
          border-color: rgba(162, 89, 247, 0.3);
        }
        
        .portfolio-card-image {
          width: 100%;
          height: 240px;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .portfolio-card-modern:hover .portfolio-card-image {
          transform: scale(1.05);
        }
        
        .portfolio-card-content {
          padding: 1.25rem;
        }
        
        /* Stats Section */
        .stats-container {
          display: grid;
          gap: 1rem;
          padding: 0 1rem;
          margin-bottom: 1.75rem;
        }
        
        @media (max-width: 640px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            padding: 0 0.75rem;
            margin-bottom: 1.5rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            padding: 0 1.5rem;
            margin-bottom: 1.75rem;
          }
        }
        
        @media (min-width: 1025px) {
          .stats-container {
            grid-template-columns: repeat(4, 1fr);
            max-width: 1400px;
            margin: 0 auto 1.75rem;
            padding: 0 2rem;
          }
        }
        
        /* Loading Screen */
        .portfolio-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeInUp 0.3s ease-out;
        }
      `}
    </style>
    
    <div className="portfolio-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 0 4rem', position: 'relative', minHeight: '100vh' }}>
        
        {/* Subtle Stats Section */}
        <div className="stats-container" style={{ marginBottom: '1.75rem' }}>
          {HERO_METRICS.map((item, idx) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: 'clamp(0.875rem, 2vw, 1.25rem) clamp(0.875rem, 2vw, 1.25rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              transition: 'all 0.3s ease',
              cursor: 'default',
              animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`,
              minHeight: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = `${item.accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}>
              {item.title && (
                <span style={{ 
                  fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', 
                  color: 'rgba(255,255,255,0.6)', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  marginBottom: '0.25rem',
                  lineHeight: 1.2
                }}>{item.title}</span>
              )}
              <span style={{ 
                fontSize: 'clamp(1.25rem, 4vw, 2rem)', 
                fontWeight: 700, 
                color: item.accent, 
                lineHeight: 1,
                marginBottom: '0.125rem'
              }}>{item.value}</span>
              <span style={{ 
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
                color: 'rgba(255,255,255,0.5)', 
                fontWeight: 500,
                lineHeight: 1.3
              }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Category Filter Tabs - Scrollable Container */}
        <div style={{ 
          marginBottom: '2rem',
          position: 'relative',
          width: '100%'
        }}>
          <div 
            className="category-tabs-wrapper"
          >
            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Screen */}
        {showLoader && (
          <div className="portfolio-loader">
            <div style={{
              background: 'rgba(15,15,20,0.95)',
              border: '1px solid rgba(162,89,247,0.2)',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                border: '3px solid rgba(162,89,247,0.2)', 
                borderTop: '3px solid #a259f7', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem'
              }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.25rem', fontWeight: 600 }}>
                Loading Portfolio
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
                Preparing your experience...
              </p>
              <div style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${loaderProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7f42a7, #a259f7)',
                  transition: 'width 0.3s ease',
                  borderRadius: '999px'
                }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'block' }}>
                {loaderProgress}%
              </span>
            </div>
          </div>
        )}
        
        {/* Modern Portfolio Grid */}
        <div className="portfolio-grid-modern">
          {filteredServices.map((service, idx) => (
            <ServiceCard key={idx} service={service} onOpenModal={handleOpenModal} index={idx} />
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '0 1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: 1.6 }}>
            Interested in working with us?{' '}
            <Link to="/contact" style={{ color: '#c4b5fd', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(196, 181, 253, 0.3)' }}>
              Get in touch
            </Link>
          </p>
        </div>
    </div>
    
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Portfolio Modal (Website Dev) - Responsive */
        @media (max-width: 640px) {
          .portfolio-modal {
            padding: 1rem !important;
            max-height: calc(100vh - 90px) !important;
            width: 95% !important;
            border-radius: 12px !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .portfolio-modal {
            max-height: calc(88vh - 85px) !important;
          }
        }
      `}
    </style>

      <PortfolioModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        service={selectedService} 
      />

      {/* Drive Modal for SMM, Ads, App Dev, Reels, Festive */}
      {activeCategory && DRIVE_FOLDER_IDS[activeCategory] && (
        <DriveMockupModal
          open={driveModalOpen && !!DRIVE_FOLDER_IDS[activeCategory]}
          onOpenChange={handleDriveModalClose}
          title={getPortfolioTitle(activeCategory)}
          subtitle={getPortfolioSubtitle(activeCategory)}
          statsBadgeText={getPortfolioBadge(activeCategory)}
          folderId={DRIVE_FOLDER_IDS[activeCategory]}
        />
      )}
  </div>
);
};

export default Portfolio; 
