import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/smm-thumbnail.jpg',
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
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/app-dev-thumbnail.jpg',
    results: 'Launched within 8 weeks, secured initial funding'
  },
  {
    service: 'Video Editing & Reels',
    description: 'Engaging video content that captures attention and drives engagement',
    samples: [], // Now using Google Drive - videos loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/video-reels-thumbnail.jpg',
    results: 'Tripled follower count, boosted engagement significantly'
  },
  {
    service: 'Ad Campaign Management',
    description: 'Strategic advertising campaigns that deliver measurable results',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/ads-thumbnail.jpg',
    results: '30% increase in sales, 25% reduction in acquisition cost'
  },
  {
    service: 'Festive Posts',
    description: 'Special occasion content and festive celebrations for brands',
    samples: [], // Now using Google Drive - images loaded dynamically
    thumbnail: process.env.PUBLIC_URL + '/thumbnails/festive-thumbnail.jpg',
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

  useEffect(() => {
    setShowMockup(false);
  }, [service, currentImageIndex]);

  if (!hasContent) {
    return null;
  }

  const handleBackdropClick = (e) => {
    // Close modal only if clicking on the backdrop, not the modal content
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
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem'
      }}
      onClick={handleBackdropClick}
    >
      <div className="portfolio-modal" style={{
        background: 'rgba(30,30,40,0.95)',
        borderRadius: 16,
        padding: '2rem',
        maxWidth: 900,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid rgba(162,89,247,0.2)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
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
            .portfolio-modal::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #b366ff 0%, #8f52b7 100%);
            }
          `}
        </style>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#a7a7a7',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ marginBottom: 40, borderBottom: '1px solid rgba(162,89,247,0.2)', paddingBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: '#a259f7', fontSize: '2.2rem', fontWeight: 700, margin: '0 0 12px 0', lineHeight: 1.2 }}>
                {service.service}
              </h2>
              <p style={{ color: '#bdbdbd', fontSize: '1.1rem', margin: 0, lineHeight: 1.5, maxWidth: '600px' }}>
                {service.description}
              </p>
            </div>
            <div style={{ 
              background: 'rgba(76,175,80,0.1)',
              border: '1px solid rgba(76,175,80,0.2)',
              borderRadius: 8, 
              padding: '12px 16px',
              marginLeft: 24,
              marginTop: 40,
              minWidth: '200px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: 'fit-content'
            }}>
              <span style={{ color: '#4CAF50', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}>
                {service.results.split(', ').map((part, index) => (
                  <div key={index} style={{ marginBottom: index < service.results.split(', ').length - 1 ? '4px' : 0 }}>
                    {part}
                  </div>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            width: '100%',
            maxHeight: 'min(70vh, 520px)',
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            background: '#111',
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
            
            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                color: 'white',
                padding: 12,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                color: 'white',
                padding: 12,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Image counter */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 20,
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {currentImageIndex + 1} / {samples.length}
          </div>
        </div>

        <div style={{ 
          background: 'rgba(30,30,40,0.6)', 
          borderRadius: 12, 
          padding: '20px 24px', 
          marginBottom: 24,
          border: '1px solid rgba(162,89,247,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#e7e7e7', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
            {currentSample.title}
          </h3>
          <p style={{ color: '#bdbdbd', fontSize: '1rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
            {currentSample.description}
          </p>
          {currentSample.mockup && (
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setShowMockup(true)}
                style={{
                  background: 'linear-gradient(90deg,#7f42a7,#a259f7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.65rem 1.5rem',
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
                  padding: '0.65rem 1.5rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Open in New Tab
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          justifyContent: 'flex-start', 
          marginTop: 24,
          flexWrap: 'wrap',
          padding: '16px 0',
          borderTop: '1px solid rgba(162,89,247,0.1)'
        }}>
          {samples.map((sample, index) => {
            const isVideo = sample.mediaType === 'video';
            return (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: currentImageIndex === index ? '2px solid #a259f7' : '2px solid transparent',
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
                      objectFit: 'contain'
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
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      console.warn(`Failed to load thumbnail: ${sample.img}`);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                {/* Video indicator for thumbnails */}
                {isVideo && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(162,89,247,0.8)',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid white',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
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
        <div style={{
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
              onClick={() => setShowMockup(false)}
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

const ServiceCard = ({ service, onOpenModal }) => {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the first sample as thumbnail, or use service.thumbnail for Google Drive services
  const thumbnail = service.samples && service.samples.length > 0 ? service.samples[0] : null;
  const thumbnailUrl = thumbnail ? thumbnail.img : (service.thumbnail || null);
  const isVideo = thumbnail && thumbnail.mediaType === 'video';

  return (
    <div
      className="portfolio-item"
      tabIndex={0}
      style={{
        background: hovered ? 'rgba(30,30,30,0.85)' : 'rgba(30,30,30,0.65)',
        border: '2px solid rgba(127,66,167,0.18)',
        boxShadow: hovered ? '0 12px 40px 0 rgba(0,0,0,0.4)' : '0 8px 32px 0 rgba(80,80,120,0.18)',
        borderRadius: 18,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onOpenModal(service)}
    >
      <div style={{ 
        width: '100%', 
        height: 220, 
        overflow: 'hidden', 
        background: '#111', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative' 
      }}>
        {thumbnailUrl ? (
          <>
            {isVideo ? (
              <LazyVideo
                src={thumbnail.img}
                fallbackSrc={thumbnail.fallbackImg}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  filter: hovered ? 'none' : 'grayscale(0.3)', 
                  transition: 'all 0.5s',
                  borderRadius: 0
                }}
                muted
                loop
                playsInline
                onLoadedData={() => setImageLoaded(true)}
              />
            ) : (
              <LazyImage
                src={thumbnail ? thumbnail.img : thumbnailUrl}
                fallbackSrc={thumbnail ? thumbnail.fallbackImg : thumbnailUrl}
                alt={service.service}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  filter: hovered ? 'none' : 'grayscale(0.3)', 
                  transition: 'all 0.5s', 
                  borderRadius: 0, 
                  display: 'block',
                  opacity: imageLoaded ? 1 : 0.8
                }}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            
            {/* Video play indicator */}
            {isVideo && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(162,89,247,0.8)',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                transition: 'opacity 0.3s'
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '20px solid white',
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  marginLeft: 4
                }} />
              </div>
            )}
            
            {/* Image count indicator */}
            {service.samples && service.samples.length > 1 && (
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 12,
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                +{service.samples.length - 1} more
              </div>
            )}
            
            {/* Google Drive indicator overlay */}
            {!thumbnail && thumbnailUrl && (
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(162,89,247,0.9)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📁</span>
                <span>View Portfolio</span>
              </div>
            )}
          </>
        ) : (
          // Fallback placeholder for services without thumbnails
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            color: 'rgba(162,89,247,0.6)'
          }}>
            <div style={{
              fontSize: '3rem',
              opacity: 0.5
            }}>📁</div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              textAlign: 'center',
              padding: '0 1rem'
            }}>
              View Portfolio
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '24px 24px 16px 24px', flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 120 }}>
        <h3 style={{ fontWeight: 700, fontSize: 22, color: 'var(--color-text-primary)', marginBottom: 8 }}><FancyText text={service.service} /></h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>{service.results}</p>
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
        console.log('Blocked Spline script from loading on Portfolio page');
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

  const handleOpenModal = (service) => {
    if (!service) return;
    
    const category = getCategoryFromService(service.service);
    
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
  };

  const handleDriveModalClose = (open) => {
    setDriveModalOpen(open);
    if (!open) {
      setActiveCategory(null);
    }
  };

  const loaderProgress = initialPrefetchSamples.length
    ? Math.min(
        Math.round((prefetchProgress / initialPrefetchSamples.length) * 100),
        100
      )
    : 100;

  return (
  <div className="portfolio-page-wrapper" style={{ minHeight: '100vh', color: 'var(--color-text-primary)', padding: '0 0 3rem 0', marginTop: '-110px', fontFamily: 'inherit' }}>
    {/* Static Banner - Replaces Spline */}
    <div className="portfolio-banner" style={{
      width: '100%',
      maxHeight: '280px',
      minHeight: '200px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '1rem',
      borderBottom: '1px solid rgba(122, 66, 240, 0.2)',
      paddingTop: '80px',
      paddingBottom: '1.5rem',
      marginTop: '0'
    }}>
      {/* Gradient overlay - More subtle */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(122, 66, 240, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />
      
      {/* Content - Absolutely positioned to center in visible gradient area */}
      <div className="portfolio-banner-content" style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 1rem',
        maxWidth: '90%',
        width: '100%',
        animation: 'fadeInUp 0.6s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100% - 80px - 1.5rem)'
      }}>
        <h1 className="portfolio-title" style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #ffffff 0%, #a259f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
          textShadow: '0 2px 10px rgba(162, 89, 247, 0.2)',
          filter: 'drop-shadow(0 1px 5px rgba(162, 89, 247, 0.15))'
        }}>
          Our Portfolio
        </h1>
        <p className="portfolio-description" style={{
          fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
          color: 'rgba(255, 255, 255, 0.75)',
          lineHeight: 1.5,
          margin: 0,
          padding: '0 0.5rem'
        }}>
          Explore our creative work and see how we transform brands through innovative digital solutions
        </p>
      </div>
    </div>

    <style>
      {`
        /* Portfolio page responsive styles */
        .portfolio-page-wrapper {
          margin-top: -110px !important;
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
        
        /* Banner responsive - Compact design, starts right after navbar */
        @media (max-width: 640px) {
          .portfolio-banner {
            max-height: 180px !important;
            min-height: 150px !important;
            padding-top: 70px !important;
            padding-bottom: 1rem !important;
            margin-bottom: 1rem !important;
            margin-top: 0 !important;
          }
          .portfolio-banner-content {
            top: 70px !important;
            height: calc(100% - 70px - 1rem) !important;
            padding: 0 0.75rem !important;
          }
          .portfolio-title {
            font-size: 1.5rem !important;
            margin-bottom: 0.4rem !important;
          }
          .portfolio-description {
            font-size: 0.75rem !important;
            padding: 0 0.25rem !important;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .portfolio-banner {
            max-height: 220px !important;
            min-height: 180px !important;
            padding-top: 75px !important;
            padding-bottom: 1.25rem !important;
            margin-bottom: 1rem !important;
            margin-top: 0 !important;
          }
          .portfolio-banner-content {
            top: 75px !important;
            height: calc(100% - 75px - 1.25rem) !important;
          }
          .portfolio-title {
            font-size: 1.875rem !important;
          }
          .portfolio-description {
            font-size: 0.875rem !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .portfolio-banner {
            max-height: 250px !important;
            min-height: 200px !important;
            padding-top: 80px !important;
            padding-bottom: 1.5rem !important;
            margin-bottom: 1rem !important;
            margin-top: 0 !important;
          }
          .portfolio-banner-content {
            top: 80px !important;
            height: calc(100% - 80px - 1.5rem) !important;
          }
          .portfolio-title {
            font-size: 2.25rem !important;
          }
          .portfolio-description {
            font-size: 1rem !important;
          }
        }
        
        @media (min-width: 1025px) {
          .portfolio-banner {
            max-height: 280px !important;
            min-height: 200px !important;
            padding-top: 80px !important;
            padding-bottom: 1.5rem !important;
            margin-bottom: 1rem !important;
            margin-top: 0 !important;
          }
          .portfolio-banner-content {
            top: 80px !important;
            height: calc(100% - 80px - 1.5rem) !important;
          }
          .portfolio-title {
            font-size: 2.5rem !important;
          }
          .portfolio-description {
            font-size: 1rem !important;
          }
        }
        
        /* Container responsive padding */
        @media (max-width: 640px) {
          .portfolio-container {
            padding: 0.75rem !important;
          }
        }
        
        @media (min-width: 641px) {
          .portfolio-container {
            padding: 1rem 1.5rem !important;
          }
        }
        
        @media (min-width: 768px) {
          .portfolio-container {
            padding: 1.5rem 2.5rem !important;
          }
        }
        
        @media (min-width: 1024px) {
          .portfolio-container {
            padding: 2rem 2.5rem !important;
          }
        }
        
        /* Grid responsive */
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 0 !important;
          }
          
          .portfolio-item {
            min-height: 280px !important;
          }
          
          .portfolio-modal {
            padding: 1rem !important;
            margin: 1rem !important;
            max-height: 90vh !important;
          }
          
          .portfolio-modal h2 {
            font-size: 1.8rem !important;
          }
          
          .portfolio-modal p {
            font-size: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .portfolio-item {
            min-height: 250px !important;
          }
          
          .portfolio-modal {
            padding: 0.5rem !important;
            margin: 0.5rem !important;
          }
          
          .portfolio-modal h2 {
            font-size: 1.5rem !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (min-width: 1025px) {
          .portfolio-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}
    </style>
    
    <div className="portfolio-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem', position: 'relative', minHeight: '100vh' }}>
        {showLoader && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5,5,12,0.92)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              background: 'rgba(20,20,30,0.9)',
              border: '1px solid rgba(162,89,247,0.25)',
              borderRadius: 24,
              padding: '2rem',
              width: '100%',
              maxWidth: 420,
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)'
            }}>
              <p style={{ color: '#a259f7', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Preparing Portfolio
              </p>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', fontWeight: 700 }}>
                Loading showcase…
              </h3>
              <p style={{ color: '#a7a7a7', margin: '0.75rem 0 1.5rem' }}>
                High-resolution images & reels are warming up in the background.
              </p>
              <div style={{
                width: '100%',
                height: 8,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 999,
                overflow: 'hidden',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: `${loaderProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg,#7f42a7,#a259f7)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ color: '#e7e7e7', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                {loaderProgress}%
              </span>
            </div>
          </div>
        )}
        
        <div className="portfolio-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'clamp(20px, 4vw, 32px)', 
          marginBottom: '2.5rem',
          padding: '0'
        }}>
          {portfolioServices.map((service, idx) => (
            <ServiceCard key={idx} service={service} onOpenModal={handleOpenModal} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p style={{ color: '#a7a7a7', fontSize: '1.08rem' }}>
          Want to see more? <a href="/contact" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}>Contact us</a> for a full portfolio or to discuss your project!
        </p>
      </div>
    </div>

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
