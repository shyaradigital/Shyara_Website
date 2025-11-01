import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingCart, ArrowLeft, Share2 } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import FancyText from '../../components/FancyText';


const SocialMediaManagementPage = () => {
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  const isBasicInCart = cart.some(item => item.id === 'smm-basic');
  const isIntermediateInCart = cart.some(item => item.id === 'smm-intermediate');
  const isPremiumInCart = cart.some(item => item.id === 'smm-premium');
  const isEliteInCart = cart.some(item => item.id === 'smm-elite');
  
  return (
    <div className="service-page-container" style={{ minHeight: '100vh', color: 'var(--color-text-primary)', padding: '0', fontFamily: 'inherit', position: 'relative', background: 'none' }}>
      <style>
        {`
          @media (max-width: 1200px) {
            .plan-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              max-width: 800px !important;
            }
          }
          @media (max-width: 768px) {
            .plan-cards-grid {
              grid-template-columns: 1fr !important;
              max-width: 400px !important;
              gap: 16px !important;
            }
          }
        `}
      </style>
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
          <Share2 style={{ width: 38, height: 38, color: '#a259f7' }} />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#a259f7', margin: 0 }}><FancyText text="Social Media Management" /></h1>
        </div>
        <p style={{ color: '#bdbdbd', fontSize: '1.08rem', marginBottom: 24, fontWeight: 400, lineHeight: 1.6 }}>
          Consistent, creative, and keyword-rich content for all major platforms. We handle everything from posts and reels to community engagement.
        </p>
        {/* Paid Features Section */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#a259f7', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle style={{ color: '#a259f7', width: 20, height: 20 }} />
            Included in Your Plan
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Account Handling: Instagram, Facebook, LinkedIn, Twitter, Google My Business, YouTube and more...',
              'High-impact captions with trending hashtags',
              'Monthly content calendar',
              'Community engagement and response management',
            ].map((feature, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(162,89,247,0.05)',
                border: '1px solid rgba(162,89,247,0.1)'
              }}>
                <CheckCircle style={{ color: '#a259f7', width: 18, height: 18, flexShrink: 0 }} />
                <span style={{ color: '#e7e7e7', fontSize: '0.95rem' }}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Free Features Section */}
        <div style={{ 
          marginBottom: 32,
          background: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(30,30,40,0.05) 100%)',
          border: '2px solid rgba(76,175,80,0.3)',
          borderRadius: 16,
          padding: 20,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            borderBottomLeftRadius: 12
          }}>
            FREE BONUSES
          </div>
          <h3 style={{ color: '#4CAF50', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>🎁</span>
            Free Extras You Get
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Festive posts for special days and occasions',
              'Profile setup and optimization for new clients',
            ].map((feature, idx) => (
              <li key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(76,175,80,0.1)',
                border: '1px solid rgba(76,175,80,0.2)'
              }}>
                <span style={{ fontSize: '1.1rem' }}>✨</span>
                <span style={{ color: '#e7e7e7', fontSize: '0.95rem', fontWeight: 500 }}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ marginBottom: 18, marginTop: 32 }}>
          <div style={{ fontWeight: 700, color: '#a259f7', fontSize: '1.15rem', marginBottom: 8 }}>Choose Your Plan</div>
          <p style={{ color: '#a7a7a7', fontSize: '0.95rem', marginBottom: 24 }}>
            Select the plan that best fits your social media management needs.
          </p>
          
          <div className="plan-cards-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 24, 
            width: '100%',
            alignItems: 'stretch', // Ensure all cards stretch to same height
            maxWidth: '1200px', // Adjusted to match content width
            margin: '0 auto' // Center the entire grid
          }}>
            
            {/* Basic Plan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(162,89,247,0.05) 0%, rgba(30,30,40,0.1) 100%)',
              border: '2px solid rgba(162,89,247,0.2)',
              borderRadius: 16,
              padding: 20,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px', // Set consistent minimum height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Pricing Display */}
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ 
                  color: '#666', 
                  fontSize: '1.2rem', 
                  fontWeight: '500',
                  textDecoration: 'line-through',
                  marginBottom: 4
                }}>
                  ₹7,500
                </div>
                <div style={{ 
                  color: '#a259f7', 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(162,89,247,0.3)'
                }}>
                  ₹5,000
                </div>
                <div style={{ 
                  color: '#4CAF50', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  marginTop: 4
                }}>
                  Only / Month
                </div>
              </div>
              
              <div style={{ marginBottom: 12, flex: 1 }}>
                <h3 style={{ color: '#a259f7', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px 0' }}>Basic</h3>
                <ul style={{ color: '#bdbdbd', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, paddingLeft: '16px' }}>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>15 High-Quality Image Posts</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Alternate Day Posting Schedule</li>
                  <li style={{ marginBottom: '8px', fontWeight: '500' }}>Professional Captions & Hashtags</li>
                </ul>
                <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '8px' }}>Perfect for startups & small businesses</div>
              </div>
              <button
                style={{
                  background: isBasicInCart ? 'rgba(162,89,247,0.10)' : 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                  color: isBasicInCart ? '#a259f7' : '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  boxShadow: isBasicInCart ? '0 2px 12px #0002' : '0 2px 12px #a259f7aa',
                  cursor: isBasicInCart ? 'not-allowed' : 'pointer',
                  opacity: isBasicInCart ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  width: '100%'
                }}
                onClick={() => addToCart({ id: 'smm-basic', name: 'SMM Basic Plan', price: 5000, description: 'Social media management with 15 image posts (alternate days posting)' })}
                disabled={isBasicInCart}
              >
                <ShoppingCart style={{ width: 18, height: 18 }} /> {isBasicInCart ? 'Added to Cart' : 'Add Basic Plan'}
              </button>
            </div>

            {/* Intermediate Plan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(162,89,247,0.08) 0%, rgba(30,30,40,0.15) 100%)',
              border: '2px solid rgba(162,89,247,0.3)',
              borderRadius: 16,
              padding: 20,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px', // Set consistent minimum height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Popular Badge */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                color: 'white',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '700',
                borderBottomLeftRadius: 12
              }}>
                POPULAR
              </div>
              
              {/* Pricing Display */}
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ 
                  color: '#666', 
                  fontSize: '1.2rem', 
                  fontWeight: '500',
                  textDecoration: 'line-through',
                  marginBottom: 4
                }}>
                  ₹13,000
                </div>
                <div style={{ 
                  color: '#a259f7', 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(162,89,247,0.3)'
                }}>
                  ₹8,000
                </div>
                <div style={{ 
                  color: '#4CAF50', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  marginTop: 4
                }}>
                  Only / Month
                </div>
              </div>
              
              <div style={{ marginBottom: 12, flex: 1 }}>
                <h3 style={{ color: '#a259f7', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px 0' }}>Intermediate</h3>
                <ul style={{ color: '#bdbdbd', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, paddingLeft: '16px' }}>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>20 Image Posts + 2 Video Posts</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Weekly Video Content (Alternate Saturdays)</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Community Engagement</li>
                  <li style={{ marginBottom: '8px', fontWeight: '500' }}>Trend-Based Content Creation</li>
                </ul>
                <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '8px' }}>Ideal for growing businesses</div>
              </div>
              <button
                style={{
                  background: isIntermediateInCart ? 'rgba(162,89,247,0.10)' : 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                  color: isIntermediateInCart ? '#a259f7' : '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  boxShadow: isIntermediateInCart ? '0 2px 12px #0002' : '0 2px 12px #a259f7aa',
                  cursor: isIntermediateInCart ? 'not-allowed' : 'pointer',
                  opacity: isIntermediateInCart ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  width: '100%'
                }}
                onClick={() => addToCart({ id: 'smm-intermediate', name: 'SMM Intermediate Plan', price: 8000, description: 'Social media management with 20 image posts + 2 video posts (video posts alternate Saturdays)' })}
                disabled={isIntermediateInCart}
              >
                <ShoppingCart style={{ width: 18, height: 18 }} /> {isIntermediateInCart ? 'Added to Cart' : 'Add Intermediate Plan'}
              </button>
            </div>

            {/* Premium Plan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(162,89,247,0.05) 0%, rgba(30,30,40,0.1) 100%)',
              border: '2px solid rgba(162,89,247,0.2)',
              borderRadius: 16,
              padding: 20,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px', // Set consistent minimum height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Pricing Display */}
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ 
                  color: '#666', 
                  fontSize: '1.2rem', 
                  fontWeight: '500',
                  textDecoration: 'line-through',
                  marginBottom: 4
                }}>
                  ₹17,000
                </div>
                <div style={{ 
                  color: '#a259f7', 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(162,89,247,0.3)'
                }}>
                  ₹10,000
                </div>
                <div style={{ 
                  color: '#4CAF50', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  marginTop: 4
                }}>
                  Only / Month
                </div>
              </div>
              
              <div style={{ marginBottom: 12, flex: 1 }}>
                <h3 style={{ color: '#a259f7', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px 0' }}>Premium</h3>
                <ul style={{ color: '#bdbdbd', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, paddingLeft: '16px' }}>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>25 Image Posts + 4 Video Posts</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Daily Content Strategy</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Advanced Engagement Strategies</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Story Management & Highlights</li>
                  <li style={{ marginBottom: '8px', fontWeight: '500' }}>Analytics & Performance Reports</li>
                </ul>
                <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '8px' }}>Perfect for established brands</div>
              </div>
              <button
                style={{
                  background: isPremiumInCart ? 'rgba(162,89,247,0.10)' : 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                  color: isPremiumInCart ? '#a259f7' : '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  boxShadow: isPremiumInCart ? '0 2px 12px #0002' : '0 2px 12px #a259f7aa',
                  cursor: isPremiumInCart ? 'not-allowed' : 'pointer',
                  opacity: isPremiumInCart ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  width: '100%'
                }}
                onClick={() => addToCart({ id: 'smm-premium', name: 'SMM Premium Plan', price: 10000, description: 'Social media management with 25 image posts + 4 video posts' })}
                disabled={isPremiumInCart}
              >
                <ShoppingCart style={{ width: 18, height: 18 }} /> {isPremiumInCart ? 'Added to Cart' : 'Add Premium Plan'}
              </button>
            </div>

            {/* Elite Plan */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(162,89,247,0.08) 0%, rgba(30,30,40,0.15) 100%)',
              border: '2px solid rgba(162,89,247,0.3)',
              borderRadius: 16,
              padding: 20,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px', // Set consistent minimum height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {/* Elite Badge */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'linear-gradient(45deg, #ffd700, #ffb347)',
                color: '#333',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '700',
                borderBottomLeftRadius: 12
              }}>
                ELITE
              </div>
              
              {/* Pricing Display */}
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ 
                  color: '#666', 
                  fontSize: '1.2rem', 
                  fontWeight: '500',
                  textDecoration: 'line-through',
                  marginBottom: 4
                }}>
                  ₹42,000
                </div>
                <div style={{ 
                  color: '#a259f7', 
                  fontSize: '1.8rem', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(162,89,247,0.3)'
                }}>
                  ₹25,000
                </div>
                <div style={{ 
                  color: '#4CAF50', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  marginTop: 4
                }}>
                  Only / Month
                </div>
              </div>
              
              <div style={{ marginBottom: 12, flex: 1 }}>
                <h3 style={{ color: '#a259f7', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 12px 0' }}>Elite</h3>
                <ul style={{ color: '#bdbdbd', fontSize: '0.85rem', lineHeight: 1.5, margin: 0, paddingLeft: '16px' }}>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>15 Image Posts + 15 Video Posts</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Premium Video Content Creation</li>
                  <li style={{ marginBottom: '6px', fontWeight: '500' }}>Multi-Platform Management</li>
                  <li style={{ marginBottom: '8px', fontWeight: '500' }}>Dedicated Account Manager</li>
                </ul>
                <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginTop: '8px' }}>Ultimate solution for enterprises</div>
              </div>
              <button
                style={{
                  background: isEliteInCart ? 'rgba(162,89,247,0.10)' : 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                  color: isEliteInCart ? '#a259f7' : '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.8rem 1.5rem',
                  boxShadow: isEliteInCart ? '0 2px 12px #0002' : '0 2px 12px #a259f7aa',
                  cursor: isEliteInCart ? 'not-allowed' : 'pointer',
                  opacity: isEliteInCart ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  width: '100%'
                }}
                onClick={() => addToCart({ id: 'smm-elite', name: 'SMM Elite Plan', price: 25000, description: 'Social media management with 15 image posts + 15 video posts' })}
                disabled={isEliteInCart}
              >
                <ShoppingCart style={{ width: 18, height: 18 }} /> {isEliteInCart ? 'Added to Cart' : 'Add Elite Plan'}
              </button>
            </div>
          </div>
        </div>

        
        <blockquote style={{ borderLeft: '4px solid #a259f7', paddingLeft: 16, fontStyle: 'italic', color: '#bdbdbd', margin: '1.5rem 0', fontSize: '1.05rem', background: 'none', borderRadius: 0 }}>
          "Shyara transformed our social media presence in just 3 months — our engagement increased by 200%, and we started getting real leads."<br />
          <span style={{ fontWeight: 600, color: '#a259f7' }}>— Amit Kumar, Local Café Owner</span>
        </blockquote>

      </div>

    </div>
  );
};

export default SocialMediaManagementPage; 