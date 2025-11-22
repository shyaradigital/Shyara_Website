import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, CheckCircle, ShoppingCart, ArrowLeft, Share2, Sparkles, Megaphone, Globe, Smartphone, Film, Minus, Plus, X } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import FancyText from '../../components/FancyText';

const FeatureItem = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        borderRadius: 0,
        padding: '0.8rem 1.2rem',
        fontSize: '1rem',
        color: '#e7e7e7',
        fontWeight: 500,
        boxShadow: 'none',
        transition: hovered ? 'transform 0.38s cubic-bezier(.22,1.5,.36,1)' : 'transform 0.32s cubic-bezier(.4,2,.6,1)',
        transform: hovered ? 'scale(1.035)' : 'none',
        outline: 'none',
      }}
    >
      {/* Glass background on hover */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          left: '-10px',
          right: '-10px',
          bottom: '-8px',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'scale(1.045)' : 'scale(0.98)',
          transition: 'opacity 0.32s cubic-bezier(.4,2,.6,1), transform 0.48s cubic-bezier(.22,1.5,.36,1)',
          background: 'linear-gradient(120deg, rgba(162,89,247,0.08) 0%, rgba(30,30,40,0.38) 100%)',
          borderRadius: 16,
          boxShadow: hovered ? '0 4px 16px 0 #a259f733, 0 1px 4px 0 #0002' : 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1.2px solid',
          borderImage: 'linear-gradient(90deg, #a259f7 0%, #7f42a7 100%) 1',
          filter: hovered ? 'brightness(1.01)' : 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        {children}
      </span>
    </li>
  );
};

const SliderModal = ({ isOpen, onClose, service, onAddToCart, cart, updateCartItem, removeFromCart }) => {
  const [numPosts, setNumPosts] = useState(2);
  const [numReels, setNumReels] = useState(1);
  const postsPricePer = 400;
  const reelsPricePer = 700;

  // Check if items are in cart
  const postsCartItem = cart.find(item => item.id === 'custom-posts');
  const reelsCartItem = cart.find(item => item.id === 'custom-reels');
  
  const isPostsInCart = !!postsCartItem;
  const isReelsInCart = !!reelsCartItem;

  // Initialize sliders only when modal first opens
  React.useEffect(() => {
    if (isOpen) {
      // Only set initial values if sliders are at default values
      if (numPosts === 2 && numReels === 1) {
        if (postsCartItem) {
          setNumPosts(postsCartItem.quantity || 2);
        }
        if (reelsCartItem) {
          setNumReels(reelsCartItem.quantity || 1);
        }
      }
    }
  }, [isOpen]); // Only depend on isOpen, not cart items

  const handleAddPackage = () => {
    const totalPrice = (numPosts * postsPricePer) + (numReels * reelsPricePer);
    const newItem = {
      id: 'personalized-social-media-package',
      name: `Social Media Management Package`,
      price: totalPrice,
      priceText: `₹${totalPrice.toLocaleString()}`,
      quantity: 1,
      description: `Custom social media package with ${numPosts} posts (₹${postsPricePer} each) and ${numReels} reels (₹${reelsPricePer} each) per month`,
      details: {
        posts: numPosts,
        reels: numReels,
        postsPrice: postsPricePer,
        reelsPrice: reelsPricePer
      },
      isPersonalized: true, // Mark as personalized service
      isCustomQuote: false // Explicitly mark as NOT a custom quote since it has a fixed price
    };
    
    // Remove any existing individual items
    removeFromCart('custom-posts');
    removeFromCart('custom-reels');
    removeFromCart('social-media-package');
    removeFromCart('personalized-social-media-package');
    
    // Add the package
    onAddToCart(newItem);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(30,30,30,0.95)',
        border: '1.5px solid rgba(127,66,167,0.3)',
        borderRadius: 24,
        boxShadow: '0 20px 60px 0 rgba(0,0,0,0.8)',
        padding: '2.5rem',
        maxWidth: 500,
        width: '100%',
        position: 'relative',
        backdropFilter: 'blur(20px)',
      }}>
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
            transition: 'background 0.2s',
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontWeight: 700, fontSize: '1.4rem', color: '#a259f7', marginBottom: 16, textAlign: 'center' }}>
          Customize Your Social Media Management Package
        </h3>
        <p style={{ color: '#bdbdbd', fontSize: '1rem', marginBottom: 24, textAlign: 'center' }}>
          Select the number of posts and reels for your custom package.
        </p>

        {/* Posts Slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>Posts per month</span>
            <span style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.1rem' }}>{numPosts}</span>
          </div>
          <input
            type="range"
            min={1}
            max={60}
            value={numPosts}
            onChange={e => setNumPosts(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#a259f7', height: 6, marginBottom: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#bdbdbd', fontSize: '0.9rem' }}>₹{postsPricePer} per post</span>
            <span style={{ fontWeight: 700, color: '#fff', background: '#a259f7', borderRadius: 6, padding: '4px 12px', fontSize: '0.95rem' }}>
              ₹{numPosts * postsPricePer}
            </span>
          </div>

        </div>

        {/* Reels Slider */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>Reels per month</span>
            <span style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.1rem' }}>{numReels}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={numReels}
            onChange={e => setNumReels(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#a259f7', height: 6, marginBottom: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#bdbdbd', fontSize: '0.9rem' }}>₹{reelsPricePer} per reel</span>
            <span style={{ fontWeight: 700, color: '#fff', background: '#a259f7', borderRadius: 6, padding: '4px 12px', fontSize: '0.95rem' }}>
              ₹{numReels * reelsPricePer}
            </span>
          </div>

        </div>

        {/* Package Total */}
        <div style={{ 
          background: 'rgba(162,89,247,0.1)', 
          border: '1px solid rgba(162,89,247,0.3)', 
          borderRadius: 12, 
          padding: 16, 
          marginBottom: 24,
          textAlign: 'center'
        }}>
          <div style={{ color: '#a259f7', fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
            Package Total: ₹{(numPosts * postsPricePer) + (numReels * reelsPricePer)}
          </div>
          <div style={{ color: '#bdbdbd', fontSize: '0.9rem' }}>
            {numPosts} posts + {numReels} reels per month
          </div>
        </div>

        {/* Add Package Button */}
        <button
          style={{
            background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            borderRadius: 999,
            padding: '1rem 2rem',
            boxShadow: '0 2px 12px #a259f7aa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            transition: 'all 0.2s ease',
          }}
          onClick={handleAddPackage}
        >
          <ShoppingCart style={{ width: 18, height: 18 }} /> 
          Add Social Media Package to Cart
        </button>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, onAddToCart, isInCart, currentQuantity, onUpdateQuantity, onShowSlider, isDisabled = false }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (change) => {
    const newQuantity = (currentQuantity || 0) + change;
    if (newQuantity <= 0) {
      // Remove from cart if quantity becomes 0
      onUpdateQuantity(service.id, 0);
    } else {
      onUpdateQuantity(service.id, newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (service.hasSlider) {
      onShowSlider(service);
    } else {
      onAddToCart(service);
    }
  };

  return (
    <div
      style={{
        background: isDisabled ? 'rgba(30,30,30,0.5)' : 'rgba(30,30,30,0.92)',
        border: isDisabled ? '1.5px solid rgba(127,66,167,0.08)' : '1.5px solid rgba(127,66,167,0.18)',
        borderRadius: 22,
        boxShadow: isDisabled ? '0 4px 16px 0 rgba(80,80,120,0.08)' : '0 8px 32px 0 rgba(80,80,120,0.18)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: 200,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        transition: hovered && !isDisabled ? 'transform 0.38s cubic-bezier(.22,1.5,.36,1)' : 'transform 0.32s cubic-bezier(.4,2,.6,1)',
        transform: hovered && !isDisabled ? 'scale(1.02)' : 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
      }}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => !isDisabled && setHovered(false)}
      onClick={() => !isDisabled && !service.hasSlider && navigate(service.route)}
    >
      {isDisabled && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: 22,
        }}>
          <div style={{
            background: 'rgba(162,89,247,0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 600,
            textAlign: 'center',
            maxWidth: '80%',
          }}>
            Included in Social Media Management Package
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ color: '#a259f7' }}>{service.icon}</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#a259f7', margin: 0 }}>
          <FancyText text={service.title} />
        </h3>
      </div>
      <p style={{ color: '#bdbdbd', fontSize: '0.97rem', marginBottom: 16, flexGrow: 1 }}>
        {service.desc}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{service.price}</span>
        
        {!service.hasSlider && currentQuantity > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              style={{
                background: 'rgba(162,89,247,0.12)',
                color: '#a259f7',
                border: '1px solid #a259f7',
                borderRadius: 6,
                padding: '0.3rem 0.6rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-1);
              }}
            >
              <Minus size={14} />
            </button>
            <span style={{ 
              fontWeight: 600, 
              color: '#a259f7', 
              minWidth: '2rem', 
              textAlign: 'center',
              fontSize: '1rem'
            }}>
              {currentQuantity}
            </span>
            <button
              style={{
                background: 'rgba(162,89,247,0.12)',
                color: '#a259f7',
                border: '1px solid #a259f7',
                borderRadius: 6,
                padding: '0.3rem 0.6rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(1);
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            style={{
              background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              borderRadius: 999,
              padding: '0.6rem 1.2rem',
              boxShadow: '0 2px 12px #a259f7aa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s, color 0.2s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingCart style={{ width: 16, height: 16 }} /> 
            {service.hasSlider ? 'Customize & Add' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

const CheckboxServiceCard = ({ service, onAddToCart, isInCart }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(30,30,30,0.92)',
        border: '1.5px solid rgba(127,66,167,0.18)',
        borderRadius: 22,
        boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minHeight: 180,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        transition: hovered ? 'transform 0.38s cubic-bezier(.22,1.5,.36,1)' : 'transform 0.32s cubic-bezier(.4,2,.6,1)',
        transform: hovered ? 'scale(1.02)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ color: '#a259f7' }}>{service.icon}</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#a259f7', margin: 0 }}>
          <FancyText text={service.title} />
        </h3>
      </div>
      <p style={{ color: '#bdbdbd', fontSize: '0.97rem', marginBottom: 16, flexGrow: 1 }}>
        {service.desc}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{service.price}</span>
        
        <button
          style={{
            background: isInCart ? 'rgba(162,89,247,0.10)' : 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
            color: isInCart ? '#a259f7' : '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: 'none',
            borderRadius: 999,
            padding: '0.6rem 1.2rem',
            boxShadow: isInCart ? '0 2px 12px #0002' : '0 2px 12px #a259f7aa',
            cursor: isInCart ? 'not-allowed' : 'pointer',
            opacity: isInCart ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={() => onAddToCart(service)}
          disabled={isInCart}
        >
          <ShoppingCart style={{ width: 16, height: 16 }} /> 
          {isInCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

const PersonalizedServicesPage = () => {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, updateCartItem } = useContext(CartContext);
  const [sliderModal, setSliderModal] = useState({ isOpen: false, service: null });
  
  // Regular services (with quantity management)
  const regularServices = [
    {
      id: 'personalized-festive-posts',
      icon: <Sparkles size={24} />,
      title: 'Festive Post Designs',
      desc: 'Ready-to-share branded festival creatives to boost reach on special occasions. Includes your logo and contact info for brand recognition.',
      price: '₹1,000/month',
      route: '/services/festive-posts',
      basePrice: 1000,
    },
    {
      id: 'personalized-ads-campaign-management',
      icon: <Megaphone size={24} />,
      title: 'Ads Campaign Management',
      desc: 'Run powerful, high-ROI ads across Meta, Google, and more. Includes free ad creatives, strategic budget management, and transparent reporting.',
      price: 'Custom Quote',
      route: '/services/ads-campaign-management',
      basePrice: 0,
    },
    {
      id: 'personalized-video-editing-reels',
      icon: <Film size={24} />,
      title: 'Video & Reels Editing',
      desc: 'Grow your brand with high-performing reels and video content. You provide the raw footage, and we handle the rest.',
      price: 'Starting at ₹25,000/month',
      route: '/services/video-editing-reels',
      basePrice: 25000,
    },
  ];

  // Website development options (checkbox style - only one can be selected)
  const websiteOptions = [
    {
      id: 'personalized-web-basic',
      icon: <Globe size={24} />,
      title: 'Basic Website',
      desc: 'Portfolio, business, or personal website with up to 5 pages. Responsive design, SEO optimization, and content management system.',
      price: '₹15,000+',
      basePrice: 15000,
    },
    {
      id: 'personalized-web-ecom',
      icon: <Globe size={24} />,
      title: 'E-commerce Website',
      desc: 'Online store or booking system with payment integration, product management, and secure checkout system.',
      price: '₹45,000+',
      basePrice: 45000,
    },
    {
      id: 'personalized-web-custom',
      icon: <Globe size={24} />,
      title: 'Custom Website',
      desc: 'Fully custom website with unique features, advanced integrations, and specific requirements tailored to your business.',
      price: 'Custom Quote',
      basePrice: 0,
    },
  ];

  // App development options (checkbox style - only one can be selected)
  const appOptions = [
    {
      id: 'personalized-app-basic',
      icon: <Smartphone size={24} />,
      title: 'Basic App',
      desc: 'Simple app with core features, perfect for MVP or basic functionality. Cross-platform development for Android and iOS.',
      price: '₹30,000+',
      basePrice: 30000,
    },
    {
      id: 'personalized-app-enterprise',
      icon: <Smartphone size={24} />,
      title: 'Custom App',
      desc: 'Complex app with advanced features, integrations, and custom requirements. Full UI/UX design and deployment.',
      price: 'Custom Quote',
      basePrice: 0,
    },
  ];

  const handleAddServiceToCart = (service) => {
    // Prevent adding Festive Posts if Social Media Management is in cart
    if (service.id === 'personalized-festive-posts' && isSocialMediaInCart) {
      return;
    }
    
    // Handle custom quote services
    const isCustomQuote = service.basePrice === 0 || service.price === 'Custom Quote';
    
    addToCart({
      id: service.id,
      name: service.title,
      price: isCustomQuote ? 0 : service.basePrice,
      description: service.desc,
      isCustomQuote: isCustomQuote,
      priceText: isCustomQuote ? 'Custom Quote' : `₹${service.basePrice}`,
      isPersonalized: true // Mark as personalized service
    });
  };

  const handleUpdateQuantity = (serviceId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove from cart
      removeFromCart(serviceId);
    } else {
      updateQuantity(serviceId, newQuantity);
    }
  };

  const getServiceQuantity = (serviceId) => {
    const cartItem = cart.find(item => item.id === serviceId);
    return cartItem ? cartItem.quantity || 1 : 0;
  };

  const isServiceInCart = (serviceId) => {
    return cart.some(item => item.id === serviceId);
  };

  // Check if Social Media Management package is in cart
  const isSocialMediaInCart = cart.some(item => item.id === 'social-media-package' || item.id === 'personalized-social-media-package');

  const handleShowSlider = (service) => {
    setSliderModal({ isOpen: true, service });
  };

  const handleCloseSlider = () => {
    setSliderModal({ isOpen: false, service: null });
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--color-text-primary)', padding: '0', fontFamily: 'inherit', position: 'relative', background: 'none' }}>
      {/* Fixed back button below navbar */}
      <button
        onClick={() => navigate('/services')}
        aria-label="Back to Services"
        style={{
          position: 'fixed',
          top: 100,
          left: 80,
          zIndex: 1000,
          background: 'rgba(30,30,30,0.95)',
          border: '2px solid var(--color-primary)',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          color: 'var(--color-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={28} />
      </button>
      <div style={{ maxWidth: 1200, width: '100%', margin: '-5rem auto 0', padding: '0 1.5rem', background: 'none', border: 'none', borderRadius: 0, boxShadow: 'none', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <UserCog style={{ width: 38, height: 38, color: '#a259f7' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a259f7', margin: 0 }}><FancyText text="Personalized Services" /></h1>
        </div>
        <p style={{ color: '#bdbdbd', fontSize: '1.08rem', marginBottom: 24, fontWeight: 400 }}>
          Choose from our comprehensive range of digital services. Mix and match to create the perfect solution for your brand. From social media management to custom development, we have everything you need to grow your business.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            'Choose from all available services',
            'Mix and match to create custom packages',
            'Custom pricing for unique requirements',
          ].map((feature, idx) => (
            <FeatureItem key={idx}>
              <CheckCircle style={{ color: '#a259f7', width: 20, height: 20, flexShrink: 0 }} /> {feature}
            </FeatureItem>
          ))}
        </ul>

        {/* Social Media Management Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.5rem', marginBottom: 16, textAlign: 'center' }}>
            Social Media Management
          </h2>
          <p style={{ color: '#a7a7a7', fontSize: '0.95rem', marginBottom: 24, textAlign: 'center' }}>
            Choose your social media management options or customize your package.
          </p>
          
          {/* Social Media Management Service Card */}
          <div style={{ marginBottom: 24 }}>
            <ServiceCard
              service={{
                id: 'personalized-social-media-management',
                icon: <Share2 size={24} />,
                title: 'Social Media Management',
                desc: 'Consistent, creative, and keyword-rich content for all major platforms. We handle everything from posts and reels to community engagement.',
                price: '',
                route: '/services/social-media-management',
                basePrice: 10500,
                hasSlider: true,
              }}
              onAddToCart={handleAddServiceToCart}
              currentQuantity={getServiceQuantity('personalized-social-media-management')}
              onUpdateQuantity={handleUpdateQuantity}
              onShowSlider={handleShowSlider}
            />
          </div>
        </div>

        {/* Other Regular Services Grid */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.5rem', marginBottom: 24, textAlign: 'center' }}>
            Other Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 24,
            marginBottom: 32,
          }}>
            {regularServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddServiceToCart}
                currentQuantity={getServiceQuantity(service.id)}
                onUpdateQuantity={handleUpdateQuantity}
                onShowSlider={handleShowSlider}
                isDisabled={service.id === 'festive-posts' && isSocialMediaInCart}
              />
            ))}
          </div>
        </div>

        {/* Website Development Options */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.5rem', marginBottom: 16, textAlign: 'center' }}>
            Website Development
          </h2>
          <p style={{ color: '#a7a7a7', fontSize: '0.95rem', marginBottom: 24, textAlign: 'center' }}>
            Choose one website type. We'll develop exactly one website based on your selection.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 24,
            marginBottom: 32,
          }}>
            {websiteOptions.map((service) => (
              <CheckboxServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddServiceToCart}
                isInCart={isServiceInCart(service.id)}
              />
            ))}
          </div>
        </div>

        {/* App Development Options */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.5rem', marginBottom: 16, textAlign: 'center' }}>
            App Development
          </h2>
          <p style={{ color: '#a7a7a7', fontSize: '0.95rem', marginBottom: 24, textAlign: 'center' }}>
            Choose one app type. We'll develop exactly one app based on your selection.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 24,
            marginBottom: 32,
          }}>
            {appOptions.map((service) => (
              <CheckboxServiceCard
                key={service.id}
                service={service}
                onAddToCart={handleAddServiceToCart}
                isInCart={isServiceInCart(service.id)}
              />
            ))}
          </div>
        </div>

        <blockquote style={{ borderLeft: '4px solid #a259f7', paddingLeft: 16, fontStyle: 'italic', color: '#bdbdbd', margin: '1.5rem 0', fontSize: '1.05rem', background: 'none', borderRadius: 0 }}>
          "Shyara's personalized approach helped us launch a campaign that was truly unique to our brand. The results exceeded our expectations!"<br />
          <span style={{ fontWeight: 600, color: '#a259f7' }}>— Ritu Jain, Boutique Owner</span>
        </blockquote>
        <button
          style={{ width: '100%', background: '#a259f7', color: '#fff', fontWeight: 700, fontSize: '1.1rem', padding: '1rem 0', borderRadius: 999, boxShadow: '0 2px 12px #a259f7aa', border: 'none', marginTop: 8, cursor: 'pointer', transition: 'background 0.2s, transform 0.2s' }}
          onClick={() => navigate('/contact')}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Contact Us
        </button>
      </div>

      {/* Slider Modal */}
      <SliderModal
        isOpen={sliderModal.isOpen}
        onClose={handleCloseSlider}
        service={sliderModal.service}
        onAddToCart={addToCart}
        cart={cart}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
      />
    </div>
  );
};

export default PersonalizedServicesPage; 