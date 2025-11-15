import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import FancyText from '../components/FancyText';
import AnimatedHeading from '../components/AnimatedHeading';

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
    samples: service.samples.map((sample) => {
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.disconnect();
      }
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
    samples: [
      { img: process.env.PUBLIC_URL + '/pics/SMM/Apsara Developers Kirty_s Design (1).png', title: 'Apsara Developers Campaign', description: 'Professional design for developer services' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Apsara Developers Kirty_s Design.png', title: 'Apsara Developers Design', description: 'Professional developer services content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Finest Furniture Kirty_s Design  (1).png', title: 'Furniture Brand Content', description: 'Creative posts for furniture business' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Finest Furniture Kirty_s Design  (2).png', title: 'Furniture Design 2', description: 'Modern furniture marketing content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Finest Furniture Kirty_s Design  (3).png', title: 'Furniture Design 3', description: 'Elegant furniture promotional posts' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Finest Furniture Kirty_s Design  (5).png', title: 'Furniture Design 5', description: 'Premium furniture brand content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Kirty Design_s (18).png', title: 'Design Collection 18', description: 'Creative design showcase' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Kirty Design_s (19).png', title: 'Design Collection 19', description: 'Modern design portfolio' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Kirty Design_s (22).png', title: 'Design Collection 22', description: 'Innovative design solutions' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Kirty Design_s (5).png', title: 'Design Collection 5', description: 'Creative design work' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Living Concept Kirty Design_s (2).png', title: 'Living Concept Posts', description: 'Lifestyle and home decor content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Living Concept Kirty Design_s (3).png', title: 'Living Concept Design 3', description: 'Modern living space content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Living Concept Kirty Design_s (4).png', title: 'Living Concept Design 4', description: 'Contemporary lifestyle posts' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/My talent win (1080 x 1350 px).png', title: 'Talent Showcase', description: 'Creative talent highlight' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Roy Academy Posts (4).png', title: 'Educational Content', description: 'Academic institution social media' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Splendore Kirty_s design (1).png', title: 'Splendore Brand', description: 'Luxury brand social media strategy' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Splendore Kirty_s design (3).png', title: 'Splendore Design 3', description: 'Premium luxury content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Splendore Kirty_s design (5).png', title: 'Splendore Design 5', description: 'Elegant luxury marketing' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Sri kala chakra Kirty_s Design (1).png', title: 'Cultural Arts Content', description: 'Traditional arts and culture posts' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Sri kala chakra Kirty_s Design (2).png', title: 'Cultural Arts Design 2', description: 'Heritage cultural content' },
      { img: process.env.PUBLIC_URL + '/pics/SMM/Sri kala chakra Kirty_s Design.png', title: 'Cultural Arts Design', description: 'Traditional cultural showcase' },
    ],
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
    samples: [
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.07.jpeg', title: 'Mobile App Interface', description: 'Modern mobile app design and development' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.08 (1).jpeg', title: 'App Dashboard', description: 'User-friendly dashboard design' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.08.jpeg', title: 'App Interface 2', description: 'Clean mobile interface design' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.18 (1).jpeg', title: 'App Features', description: 'Core functionality implementation' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.18.jpeg', title: 'App Features 2', description: 'Advanced app functionality' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.31.jpeg', title: 'User Experience', description: 'Intuitive user interface design' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.55 (1).jpeg', title: 'App Screens', description: 'Multiple screen designs' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.12.55.jpeg', title: 'App Screens 2', description: 'Comprehensive screen layouts' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.13.10 (1).jpeg', title: 'Mobile Solution', description: 'Cross-platform mobile development' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.13.10.jpeg', title: 'Mobile Solution 2', description: 'Advanced mobile development' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.13.11 (1).jpeg', title: 'App Development 1', description: 'Professional app development' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.13.11.jpeg', title: 'App Development 2', description: 'Innovative app solutions' },
      { img: process.env.PUBLIC_URL + '/pics/App Dev/WhatsApp Image 2025-09-08 at 23.13.12.jpeg', title: 'App Development 3', description: 'Complete mobile application' },
    ],
    results: 'Launched within 8 weeks, secured initial funding'
  },
  {
    service: 'Video Editing & Reels',
    description: 'Engaging video content that captures attention and drives engagement',
    samples: [
      { img: process.env.PUBLIC_URL + '/pics/Reels/Black Pink Fashion Modern Outfit Style Photo Collage Instagram Reel.mp4', title: 'Fashion Reel', description: 'Trendy fashion content for Instagram' },
      { img: process.env.PUBLIC_URL + '/pics/Reels/Gray Beige Modern Spa Treatment Mobile Video (2).mp4', title: 'Spa Treatment Video', description: 'Relaxing spa and wellness content' },
      { img: process.env.PUBLIC_URL + '/pics/Reels/Neutral Modern Skincare Instagram Reels.mp4', title: 'Skincare Reel', description: 'Beauty and skincare promotional video' },
      { img: process.env.PUBLIC_URL + '/pics/Reels/Yellow and White Minimalist Video Centric Financial Tips Instagram Reel.mp4', title: 'Financial Tips Video', description: 'Educational financial content' },
    ],
    results: 'Tripled follower count, boosted engagement significantly'
  },
  {
    service: 'Ad Campaign Management',
    description: 'Strategic advertising campaigns that deliver measurable results',
    samples: [
      { img: process.env.PUBLIC_URL + '/pics/ads/Apsara Developers Kirty_s Design (2).png', title: 'Developer Services Ad', description: 'Professional services advertising campaign' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Living Concept Kirty Design_s.png', title: 'Living Concept Ad', description: 'Lifestyle brand advertising' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Quickcontrol_fb_post (1).png', title: 'QuickControl Campaign', description: 'Tech product advertising' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Quickcontrol_fb_post.png', title: 'QuickControl Ad 2', description: 'Technology product promotion' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Roy Academy Posts (1).png', title: 'Educational Ad', description: 'Academic institution promotion' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Roy Academy Posts (2).png', title: 'Educational Ad 2', description: 'Learning institution marketing' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Roy Academy Posts (3).png', title: 'Educational Ad 3', description: 'Academic excellence promotion' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Roy Academy Posts.png', title: 'Educational Ad 4', description: 'Educational services advertising' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Splendore Kirty_s design (2).png', title: 'Splendore Ad', description: 'Luxury brand advertising' },
      { img: process.env.PUBLIC_URL + '/pics/ads/Splendore Kirty_s design (4).png', title: 'Splendore Ad 2', description: 'Premium luxury brand campaign' },
    ],
    results: '30% increase in sales, 25% reduction in acquisition cost'
  },
  {
    service: 'Festive Posts',
    description: 'Special occasion content and festive celebrations for brands',
    samples: [
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Finest Furniture Kirty_s Design  (4).png', title: 'Festive Furniture Design', description: 'Holiday-themed furniture promotion' },
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Finest Furniture Kirty_s Design .png', title: 'Festive Furniture Design 2', description: 'Seasonal furniture marketing' },
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Gold Red and Pink Traditional Varalakshmi Vratham Instagram Post.png', title: 'Traditional Festival', description: 'Cultural festival celebration post' },
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Living Concept Kirty Design_s (1).png', title: 'Festive Living', description: 'Holiday home decor content' },
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Quickcontrol_fb_post (2).png', title: 'Festive Tech', description: 'Holiday tech promotion' },
      { img: process.env.PUBLIC_URL + '/pics/Festive Posts/Splendore Kirty_s design.png', title: 'Festive Splendore', description: 'Luxury festive celebration' },
    ],
    results: 'Enhanced brand engagement during special occasions and festivals'
  }
];

const portfolioServices = attachOptimizedMedia(rawPortfolioServices);

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
            {currentImageIndex + 1} / {service.samples.length}
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
          {service.samples.map((sample, index) => {
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

  // Get the first sample as thumbnail
  const thumbnail = service.samples[0];
  const isVideo = thumbnail.mediaType === 'video';

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
        {isVideo ? (
          <LazyVideo
            src={thumbnail.img}
            fallbackSrc={thumbnail.fallbackImg}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              objectPosition: 'center',
              filter: hovered ? 'none' : 'grayscale(1)', 
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
            src={thumbnail.img}
            fallbackSrc={thumbnail.fallbackImg}
            alt={service.service}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain', 
              objectPosition: 'center', 
              filter: hovered ? 'none' : 'grayscale(1)', 
              transition: 'all 0.5s', 
              borderRadius: 0, 
              display: 'block',
              opacity: imageLoaded ? 1 : 0.7
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
        {service.samples.length > 1 && (
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

  const allSamples = useMemo(
    () => portfolioServices.flatMap((service) => service.samples),
    []
  );
  const initialPrefetchSamples = useMemo(
    () => allSamples.slice(0, PREFETCH_INITIAL_COUNT),
    [allSamples]
  );

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
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const loaderProgress = initialPrefetchSamples.length
    ? Math.min(
        Math.round((prefetchProgress / initialPrefetchSamples.length) * 100),
        100
      )
    : 100;

  return (
  <div style={{ minHeight: '100vh', color: 'var(--color-text-primary)', padding: '0 0 3rem 0', marginTop:'-5rem', fontFamily: 'inherit' }}>
    <style>
      {`
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
    
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', position: 'relative', minHeight: '100vh' }}>
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
        <AnimatedHeading text="Our Portfolio" />
        <p style={{ fontSize: '1.15rem', color: '#a7a7a7', textAlign: 'center', marginBottom: '3rem', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          Explore our work across all services. Click on any service to view sample projects and designs.
        </p>
        
        <div className="portfolio-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'clamp(20px, 4vw, 32px)', 
          marginBottom: 64,
          padding: '0 1rem'
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
  </div>
);
};

export default Portfolio; 
