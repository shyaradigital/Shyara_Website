import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import FancyText from '../components/FancyText';
import AnimatedHeading from '../components/AnimatedHeading';
import { Mail, Phone } from 'lucide-react';
import { sanitizeText } from '../utils/sanitize';
import { waitForDOM } from '../utils/hydration';
import { 
  sanitizeName, 
  sanitizeEmail, 
  sanitizeMessage, 
  sanitizeFormData,
  validateFormData 
} from '../utils/formValidation';

const ContactPage = () => {
  // --- Begin new implementation based on attached file, but keep inline styles ---
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleChange = e => {
    const fieldId = e.target.id;
    let value = e.target.value;
    
    // Sanitize input in real-time as user types
    switch (fieldId) {
      case 'name':
        value = sanitizeName(value);
        break;
      case 'email':
        value = sanitizeEmail(value);
        break;
      case 'message':
        value = sanitizeMessage(value);
        break;
      case 'phone':
        // Phone is handled separately (keep existing validation)
        break;
      default:
        break;
    }
    
    setForm(f => ({ ...f, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    // Sanitize all form data before validation
    const sanitizedForm = sanitizeFormData(form);
    
    // Validate required fields
    if (!sanitizedForm.name.trim() || !sanitizedForm.email.trim() || !form.phone.trim() || !sanitizedForm.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Validate using validation utilities
    const validation = validateFormData(sanitizedForm);
    if (!validation.valid) {
      // Show first error found
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid mobile number.');
      return;
    }
    
    // Update form with sanitized values
    setForm(sanitizedForm);
    
    if (cart && cart.length > 0) {
      setShowCartAlert(true);
      return;
    }
    await actuallySubmit();
  };

    const actuallySubmit = async () => {
      setSubmitting(true);
      
      try {
        // Wait for DOM to be ready before submitting
        await waitForDOM();
        
        // Get backend URL from environment or use relative path
        const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
        const apiUrl = `${backendUrl}/api/send-email`;
      
      // Send email using backend API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizeName(form.name),
          email: sanitizeEmail(form.email),
          message: sanitizeMessage(form.message)
        })
      });
      
      const data = await response.json();
      
      // Handle secureResponse format: { success: true, data: { message: ... } }
      if (response.ok && data.success) {
        setSuccess(true);
        setError('');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        // Handle error response: { success: false, error: ... }
        const errorMessage = data.error || 'Failed to send message. Please try again.';
        setError(errorMessage);
        setSuccess(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('An unexpected error occurred. Please try again or contact us directly.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
      setShowCartAlert(false);
    }
  };

  const handleProceed = async () => {
    await actuallySubmit();
  };

  const handleEditCart = () => {
    setShowCartAlert(false);
    navigate('/cart');
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--color-text-primary)', position: 'relative', background: 'none', fontFamily: 'inherit', padding: 0 }}>
      <style>
        {`
          /* Contact page responsive styles */
          .contact-container {
            margin-top: -110px !important;
          }
          
          @media (max-width: 640px) {
            .contact-container {
              padding: 0 1rem !important;
            }
            .contact-title {
              font-size: 1.5rem !important;
            }
            .contact-subtitle {
              font-size: 1.1rem !important;
              padding: 0 1rem !important;
            }
            .contact-content {
              flex-direction: column !important;
              gap: 1.5rem !important;
            }
            .contact-info {
              min-width: 100% !important;
              max-width: 100% !important;
              padding: 1.5rem !important;
              min-height: auto !important;
            }
            .contact-form {
              min-width: 100% !important;
              max-width: 100% !important;
              padding: 1.5rem !important;
            }
            .contact-info-title {
              font-size: 1.5rem !important;
            }
            .contact-input {
              font-size: 1rem !important;
              padding: 14px 18px !important;
            }
            .contact-label {
              font-size: 14px !important;
            }
            .contact-button {
              font-size: 16px !important;
              padding: 12px 2rem !important;
            }
          }
          
          @media (min-width: 641px) and (max-width: 768px) {
            .contact-container {
              padding: 0 1.25rem !important;
            }
            .contact-title {
              font-size: 1.75rem !important;
            }
            .contact-subtitle {
              font-size: 1.3rem !important;
            }
            .contact-content {
              gap: 2rem !important;
            }
            .contact-info {
              min-width: 100% !important;
              max-width: 100% !important;
            }
            .contact-form {
              min-width: 100% !important;
              max-width: 100% !important;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .contact-content {
              gap: 3rem !important;
            }
          }
        `}
      </style>
      <div className="contact-container" style={{ maxWidth: 900, width: '100%', margin: '-110px auto 0', padding: '0 1.5rem', background: 'none', border: 'none', borderRadius: 0, boxShadow: 'none', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <AnimatedHeading text="Get in Touch" />
          <p className="contact-subtitle" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '3rem', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', padding: '0 1rem' }}>
            Have a project in mind? We'd love to hear from you.
          </p>
        </div>
        <div className="contact-content" style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 48,
          maxWidth: 1100,
          margin: '0 auto',
          background: 'none',
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          flexWrap: 'wrap',
        }}>
          {/* Contact Info */}
          <div className="contact-info" style={{
            flex: '1 1 340px',
            minWidth: 320,
            maxWidth: 420,
            background: 'rgba(30,30,40,0.32)',
            borderRadius: 20,
            padding: 36,
            boxShadow: '0 4px 32px #0005',
            border: '1.5px solid rgba(162,89,247,0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 28,
            alignItems: 'flex-start',
            minHeight: 340,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            margin: 0,
          }}>
            <h2 className="contact-info-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: 10, textAlign: 'left' }}>Contact Information</h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 12 }}>
              <div style={{ background: 'rgba(127,66,167,0.15)', padding: 12, borderRadius: '50%' }}>
                <Mail style={{ width: 26, height: 26, color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}><FancyText text="Email" /></h3>
                <a href="mailto:support@shyara.co.in" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 400 }}>support@shyara.co.in</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
              <div style={{ background: 'rgba(127,66,167,0.15)', padding: 12, borderRadius: '50%' }}>
                <Phone style={{ width: 26, height: 26, color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}><FancyText text="Phone" /></h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', fontWeight: 400 }}>+91 9584661610</p>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div className="contact-form" style={{
            flex: '2 1 440px',
            minWidth: 340,
            maxWidth: 600,
            background: 'rgba(30,30,40,0.22)',
            borderRadius: 20,
            padding: 36,
            boxShadow: '0 4px 32px #0003',
            border: '1.5px solid rgba(162,89,247,0.10)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 0,
          }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }} onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="contact-label" style={{ display: 'block', fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10 }}>Full Name *</label>
                <input type="text" id="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" maxLength={100} className="contact-input" style={{ width: '100%', background: '#181818', color: '#e0d7f7', padding: 'clamp(14px, 1.5vw, 16px) clamp(18px, 2vw, 20px)', border: '1.5px solid #7f42a7', borderRadius: 10, fontSize: 'clamp(1rem, 1.2vw, 1.05rem)', marginBottom: 0, outline: 'none', fontWeight: 400 }} />
              </div>
              <div>
                <label htmlFor="email" className="contact-label" style={{ display: 'block', fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10 }}>Email Address *</label>
                <input type="email" id="email" value={form.email} onChange={handleChange} required placeholder="Enter your email address" maxLength={254} className="contact-input" style={{ width: '100%', background: '#181818', color: '#e0d7f7', padding: 'clamp(14px, 1.5vw, 16px) clamp(18px, 2vw, 20px)', border: '1.5px solid #7f42a7', borderRadius: 10, fontSize: 'clamp(1rem, 1.2vw, 1.05rem)', marginBottom: 0, outline: 'none', fontWeight: 400 }} />
              </div>
              <div>
                <label htmlFor="phone" className="contact-label" style={{ display: 'block', fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10 }}>Mobile Number *</label>
                <input type="tel" id="phone" value={form.phone} onChange={handleChange} required placeholder="+91 9584661610" className="contact-input" style={{ width: '100%', background: '#181818', color: '#e0d7f7', padding: 'clamp(14px, 1.5vw, 16px) clamp(18px, 2vw, 20px)', border: '1.5px solid #7f42a7', borderRadius: 10, fontSize: 'clamp(1rem, 1.2vw, 1.05rem)', marginBottom: 0, outline: 'none', fontWeight: 400 }} />
              </div>
              <div>
                <label htmlFor="message" className="contact-label" style={{ display: 'block', fontSize: 'clamp(14px, 1.2vw, 16px)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10 }}>Message *</label>
                <textarea id="message" rows={5} value={form.message} onChange={handleChange} required placeholder="Hi, I am interested in your services. Please contact me to discuss my requirements." maxLength={2000} className="contact-input" style={{ width: '100%', background: '#181818', color: '#e0d7f7', padding: 'clamp(14px, 1.5vw, 16px) clamp(18px, 2vw, 20px)', border: '1.5px solid #7f42a7', borderRadius: 10, fontSize: 'clamp(1rem, 1.2vw, 1.05rem)', outline: 'none', fontWeight: 400, resize: 'none' }}></textarea>
              </div>
              {error && <div style={{ color: '#ff4d4f', fontSize: 16 }}>{sanitizeText(error)}</div>}
              {success && <div style={{ color: '#4caf50', fontSize: 16 }}>Message sent successfully!</div>}
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <button type="submit" className="contact-button" style={{ background: '#a259f7', color: '#fff', fontWeight: 700, fontSize: 'clamp(16px, 1.2vw, 17px)', padding: 'clamp(10px, 1.2vw, 12px) clamp(1.8rem, 3vw, 2.2rem)', border: 'none', borderRadius: 999, cursor: 'pointer', boxShadow: '0 2px 8px #a259f7aa', transition: 'background 0.2s', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
            {/* Cart Alert Modal */}
            {showCartAlert && (
              <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="modal-content" style={{ background: 'rgba(40,40,40,0.98)', borderRadius: 20, boxShadow: '0 4px 32px #000a', padding: 32, maxWidth: 400, width: '100%', border: '1px solid #222', animation: 'fade-in 0.3s' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e7e7e7', marginBottom: 16, textAlign: 'center' }}>Double checked the items in your cart?</h2>
                  <ul style={{ marginBottom: 24, maxHeight: 180, overflowY: 'auto', borderTop: '1px solid #222', borderBottom: '1px solid #222', padding: 0, listStyle: 'none' }}>
                    {cart.map(item => (
                      <li key={item.id} style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#e7e7e7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                          {item.isPersonalized && (
                            <span style={{
                              background: 'linear-gradient(90deg, #a259f7, #7f42a7)',
                              color: 'white',
                              padding: '1px 6px',
                              borderRadius: '8px',
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px'
                            }}>
                              Personalized
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#7f42a7', fontWeight: 700 }}> ₹{item.price?.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button style={{ flex: 1, background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer' }} onClick={handleProceed} disabled={submitting}>
                      {submitting ? 'Sending...' : 'Proceed'}
                    </button>
                    <button style={{ flex: 1, background: '#181818', color: '#e7e7e7', fontWeight: 600, border: '1px solid #444', borderRadius: 8, padding: '10px 0', cursor: 'pointer' }} onClick={handleEditCart} disabled={submitting}>
                      Edit Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// If you want to use the CartContext from a real provider, wrap this page in your App with the real CartContext.Provider
export default ContactPage; 