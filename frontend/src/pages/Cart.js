import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, PlusCircle, Minus, Plus, Trash2, ArrowLeft, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const BRAND_LOGO = (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
    <div style={{ borderRadius: '50%', background: 'linear-gradient(135deg, #a259f7, #7f42a7)', padding: 4, boxShadow: '0 2px 12px #a259f7aa' }}>
      <div style={{ background: '#181818', borderRadius: '50%', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <User style={{ width: 32, height: 32, color: '#a259f7' }} />
      </div>
    </div>
  </div>
);

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, showCelebration } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show discount popup when cart opens (only once per session)
  useEffect(() => {
    if (cart.length > 0) {
      const hasSeenPopup = sessionStorage.getItem('cartDiscountPopupSeen');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setShowDiscountPopup(true);
          sessionStorage.setItem('cartDiscountPopupSeen', 'true');
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [cart.length]);

  // Show celebration modal when cart has items (only once)
  useEffect(() => {
    if (cart.length > 0) {
      const timer = setTimeout(() => {
        showCelebration();
      }, 500); // Small delay to let the cart load
      return () => clearTimeout(timer);
    }
  }, [cart.length, showCelebration]);
  
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };
  
  // Calculate totals for fixed-price items only
  const fixedPriceTotal = cart.reduce((sum, item) => {
    if (!item.isCustomQuote && item.price && item.price > 0) {
      return sum + (item.price * (item.quantity || 1));
    }
    return sum;
  }, 0);

  const originalTotal = cart.reduce((sum, item) => {
    if (!item.isCustomQuote && item.originalPrice && item.originalPrice > 0) {
      return sum + (item.originalPrice * (item.quantity || 1));
    }
    return sum;
  }, 0);

  const totalSavings = originalTotal - fixedPriceTotal;

  // Check if cart has custom quote items
  const hasCustomQuoteItems = cart.some(item => item.isCustomQuote);

  const handleQuantityChange = (id, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(id, newQuantity);
  };

  return (
    <div style={{ minHeight: '100vh', color: '#e7e7e7', padding: '0', fontFamily: 'inherit', background: 'transparent' }}>
      {/* Discount Popup */}
      {showDiscountPopup && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowDiscountPopup(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(162,89,247,0.15) 0%, rgba(30,30,40,0.95) 100%)',
              border: '2px solid #a259f7',
              borderRadius: 20,
              padding: '2rem',
              maxWidth: 500,
              width: '100%',
              boxShadow: '0 10px 40px rgba(162,89,247,0.4)',
              position: 'relative',
              textAlign: 'center',
              animation: 'fadeInScale 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>
              {`
                @keyframes fadeInScale {
                  from {
                    opacity: 0;
                    transform: scale(0.9);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              `}
            </style>
            <button
              onClick={() => setShowDiscountPopup(false)}
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
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(162,89,247,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <X size={24} />
            </button>
            
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
            <h2 style={{ 
              color: '#a259f7', 
              fontSize: '1.8rem', 
              fontWeight: 700, 
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              Extra 5% Off!
            </h2>
            <p style={{ 
              color: '#e7e7e7', 
              fontSize: '1.1rem', 
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              Before paying, send the screenshot of your cart at{' '}
              <a 
                href="https://wa.me/919584661610" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#4CAF50', 
                  fontWeight: 700, 
                  textDecoration: 'underline',
                  wordBreak: 'break-word'
                }}
              >
                9584661610
              </a>
              {' '}to get extra 5% off!
            </p>
            <button
              onClick={() => setShowDiscountPopup(false)}
              style={{
                background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                borderRadius: 12,
                padding: '0.9rem 2rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 16px rgba(162,89,247,0.4)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Back Button */}
      <button
        className="cart-back-button"
        style={{
          position: 'fixed',
          top: 100,
          left: 80,
          background: 'rgba(30,30,30,0.95)',
          color: '#a259f7',
          border: '1px solid rgba(162,89,247,0.3)',
          borderRadius: 8,
          padding: '0.6rem 1rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
        onClick={handleGoBack}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(162,89,247,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,30,30,0.95)'}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        Back
      </button>
      
            <div className="cart-container" style={{ width: '100%', maxWidth: 1200, margin: '-5rem auto 0', padding: '0 2rem' }}>
        {BRAND_LOGO}
                <div style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#a259f7', marginBottom: '1rem', textAlign: 'center' }}>Your Cart</h1>
          {cart.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                color: 'white',
                padding: isMobile ? '6px 12px' : '8px 16px',
                borderRadius: '20px',
                fontSize: isMobile ? '0.85rem' : '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(162,89,247,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'center',
                lineHeight: isMobile ? '1.3' : '1.4'
              }}>
                <span style={{ fontSize: isMobile ? '1rem' : '1.2rem' }}>🎉</span>
                <span>You're paying 50% in advance. The remaining balance is payable later.</span>
              </span>
            </div>
          )}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
                <p style={{ color: '#a7a7a7', fontSize: '1.1rem', marginBottom: '2rem' }}>Your cart is empty.</p>
                <button
                  style={{
                    background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    border: 'none',
                    borderRadius: 999,
                    padding: '0.9rem 2.2rem',
                    boxShadow: '0 2px 12px #a259f7aa',
                    cursor: 'pointer',
                    transition: 'background 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    margin: '0 auto',
                  }}
                  onClick={() => navigate('/services')}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <PlusCircle style={{ width: 20, height: 20 }} /> Add Items
                </button>
              </div>
            ) : (
              <>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 40 }}>
                  {cart.map(item => {
                    const quantity = item.quantity || 1;
                    const itemTotal = item.isCustomQuote ? 0 : (item.price || 0) * quantity;
                    
                    return (
                    <li key={item.id} className="cart-item" style={{
                      background: 'rgba(40,40,50,0.3)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 16,
                      padding: '2rem',
                      marginBottom: 24,
                      display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                      }}>
                                                  <div className="cart-item-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, color: '#e7e7e7', fontSize: '1.3rem' }}>{item.name}</span>
                                {item.isPersonalized && (
                                  <span style={{
                                    background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    Personalized
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <div style={{ color: '#a7a7a7', fontSize: '0.9rem', marginTop: 4 }}>
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {item.isCustomQuote ? (
                                <div>
                                  <span style={{ color: '#a259f7', fontWeight: 700, fontSize: '1.4rem' }}>
                                    Custom Quote
                                  </span>
                                  <div style={{ color: '#a7a7a7', fontSize: '0.8rem', marginTop: 4 }}>
                                    + Price after discussion
                                  </div>
                                </div>
                              ) : item.isDiscounted && item.originalPrice ? (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                                    <span style={{ 
                                      color: '#a7a7a7', 
                                      fontSize: '1rem', 
                                      textDecoration: 'line-through',
                                      opacity: 0.7
                                    }}>
                                      ₹{item.originalPrice.toLocaleString()}
                                    </span>
                                    <span style={{ 
                                      background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      fontSize: '0.7rem',
                                      fontWeight: '600'
                                    }}>
                                      50% OFF
                                    </span>
                                  </div>
                                  <span style={{ color: '#a259f7', fontWeight: 700, fontSize: '1.4rem' }}>
                                    ₹{itemTotal.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: '#a259f7', fontWeight: 700, fontSize: '1.4rem' }}>
                                  ₹{itemTotal.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        
                                                  <div className="cart-item-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ color: '#a7a7a7', fontSize: '1rem', fontWeight: 600 }}>Quantity:</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button
                                  style={{
                                    background: 'rgba(162,89,247,0.12)',
                                    color: '#a259f7',
                                    border: '1px solid #a259f7',
                                    borderRadius: 8,
                                    padding: '0.5rem 0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                        alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                  onClick={() => handleQuantityChange(item.id, quantity, -1)}
                                  disabled={quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <span style={{ 
                                  fontWeight: 700, 
                                  color: '#e7e7e7', 
                                  minWidth: '3rem', 
                                  textAlign: 'center',
                                  fontSize: '1.2rem'
                                }}>
                                  {quantity}
                                </span>
                                <button
                                  style={{
                        background: 'rgba(162,89,247,0.12)',
                        color: '#a259f7',
                        border: '1px solid #a259f7',
                                    borderRadius: 8,
                                    padding: '0.5rem 0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                  onClick={() => handleQuantityChange(item.id, quantity, 1)}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              {!item.isCustomQuote && item.price > 0 ? (
                                <span style={{ color: '#a7a7a7', fontSize: '1rem', fontWeight: 600 }}>
                                  @ ₹{item.price.toLocaleString()}
                                </span>
                              ) : item.isCustomQuote && (
                                <span style={{ color: '#a7a7a7', fontSize: '1rem', fontWeight: 600 }}>
                                  @ Custom Quote
                                </span>
                              )}
                            </div>
                            
                            <button 
                              style={{
                                background: 'rgba(255,255,255,0.12)',
                                color: '#ffffff',
                                border: '1px solid #ffffff',
                        borderRadius: 10,
                        padding: '0.6rem 1.3rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: '1rem'
                              }} 
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                          </div>
                    </li>
                    );
                  })}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <button
                    style={{
                      background: 'rgba(162,89,247,0.10)',
                      color: '#a259f7',
                      border: '1px solid #a259f7',
                      borderRadius: 12,
                      padding: isMobile ? '0.7rem 1.5rem' : '1rem 2rem',
                      fontWeight: 600,
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 6 : 10,
                      boxShadow: '0 2px 12px #0002',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => navigate('/services')}
                  >
                    <PlusCircle style={{ width: isMobile ? 18 : 22, height: isMobile ? 18 : 22 }} /> Add More Items
                  </button>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#a7a7a7', marginBottom: '0.5rem' }}>Total Amount</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#a259f7' }}>
                      {hasCustomQuoteItems ? (
                        <div>
                          <div>₹{fixedPriceTotal.toLocaleString()}</div>
                          <div style={{ fontSize: '1rem', color: '#a7a7a7', marginTop: 4 }}>
                            + custom quote
                          </div>
                        </div>
                      ) : totalSavings > 0 ? (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <span style={{ 
                              color: '#a7a7a7', 
                              fontSize: '1.4rem', 
                              textDecoration: 'line-through',
                              opacity: 0.7
                            }}>
                              ₹{originalTotal.toLocaleString()}
                            </span>
                            <span style={{ 
                              background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              50% OFF
                            </span>
                          </div>
                          <div>₹{fixedPriceTotal.toLocaleString()}</div>
                          <div style={{ fontSize: '1rem', color: '#4CAF50', marginTop: 4, fontWeight: '600' }}>
                            You save ₹{totalSavings.toLocaleString()}!
                          </div>
                        </div>
                      ) : (
                        `₹${fixedPriceTotal.toLocaleString()}`
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button 
                    style={{
                      background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: isMobile ? '1.1rem' : '1.3rem',
                      padding: isMobile ? '1rem 2rem' : '1.2rem 3rem',
                      borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(162,89,247,0.4)',
                      border: 'none',
                      marginTop: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: isMobile ? 6 : 10,
                      margin: '0 auto',
                      width: isMobile ? '100%' : 'auto',
                      textAlign: 'center'
                    }}
                    onClick={() => navigate('/checkout')}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default Cart; 