import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FancyText from '../components/FancyText';
import AnimatedHeading from '../components/AnimatedHeading';
import { Heart, Zap, Target, Users, TrendingUp, Coffee, Globe, Clock, Award } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  // Intersection Observer for faster scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px 50px 0px' // Trigger earlier with positive margin
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)'; // Reduced from 30px
      el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'; // Faster transitions
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleContactClick = () => {
    navigate('/contact');
  };

  const workSteps = [
    {
      number: '01',
      title: 'We Listen First',
      description: 'Understanding your vision before we pitch ideas.',
      icon: <Users size={24} />
    },
    {
      number: '02',
      title: 'We Handpick the Right Team',
      description: 'Matching you with freelancers skilled for your exact needs.',
      icon: <Award size={24} />
    },
    {
      number: '03',
      title: 'We Stay Agile',
      description: 'No rigid systems, no unnecessary delays—just quick, quality delivery.',
      icon: <Zap size={24} />
    },
    {
      number: '04',
      title: 'We Measure What Matters',
      description: 'Tracking real growth, not just vanity metrics.',
      icon: <Target size={24} />
    }
  ];

  const teamCategories = [
    {
      title: 'The Creators',
      description: 'Crafting visuals that stop the scroll.',
      icon: <Target size={28} />,
      color: '#a259f7'
    },
    {
      title: 'The Strategists',
      description: 'Turning data into growth opportunities.',
      icon: <TrendingUp size={28} />,
      color: '#7f42a7'
    },
    {
      title: 'The Storytellers',
      description: 'Making your brand unforgettable.',
      icon: <Heart size={28} />,
      color: '#bb6aff'
    },
    {
      title: 'The Builders',
      description: 'Bringing your web & app ideas to life.',
      icon: <Globe size={28} />,
      color: '#6600c5'
    }
  ];

  const values = [
    {
      icon: <Heart size={24} />,
      title: 'Relationships over transactions',
      description: 'We aim to be your long-term partner.',
      color: '#ff6b6b'
    },
    {
      icon: <Zap size={24} />,
      title: 'Speed without compromise',
      description: 'Agility is our superpower.',
      color: '#4ecdc4'
    },
    {
      icon: <Target size={24} />,
      title: 'Impact-driven creativity',
      description: 'Every design and strategy serves a purpose.',
      color: '#45b7d1'
    }
  ];

  const impactStats = [
    {
      number: '20+',
      label: 'businesses',
      description: 'helped grow their digital presence'
    },
    {
      number: '2M+',
      label: 'targeted users',
      description: 'reached through managed campaigns'
    },
    {
      number: '2000+',
      label: 'unique creatives',
      description: 'designed that built brand recognition'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: 'var(--color-text-primary)', 
      padding: '0 0 4rem 0', 
      fontFamily: 'inherit', 
      position: 'relative', 
      background: 'none' 
    }}>
      <style>
        {`
          /* About page responsive styles */
          .about-container {
            margin-top: -110px !important;
          }
          
          @media (max-width: 640px) {
            .about-container {
              padding: 0 1rem !important;
              margin-top: -110px !important;
            }
            .about-section {
              margin-bottom: 3rem !important;
            }
            .about-title {
              font-size: 1.5rem !important;
            }
            .about-subtitle {
              font-size: 1.1rem !important;
              margin-bottom: 2rem !important;
            }
            .about-card {
              padding: 1.5rem !important;
            }
            .about-card-title {
              font-size: 1.5rem !important;
            }
            .about-card-text {
              font-size: 0.95rem !important;
            }
            .work-steps-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            .team-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .values-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .stats-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
          }
          
          @media (min-width: 641px) and (max-width: 768px) {
            .about-container {
              padding: 0 1.25rem !important;
            }
            .about-section {
              margin-bottom: 4rem !important;
            }
            .about-title {
              font-size: 1.75rem !important;
            }
            .about-subtitle {
              font-size: 1.3rem !important;
            }
            .work-steps-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 2.5rem !important;
            }
            .team-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 1.5rem !important;
            }
            .values-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 1.5rem !important;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .about-container {
              padding: 0 1.5rem !important;
            }
            .work-steps-grid {
              gap: 4rem !important;
            }
            .team-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .values-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>
      <div className="about-container" style={{ 
        maxWidth: 1000, 
        width: '100%', 
        margin: '-110px auto 0', 
        padding: '0 1.5rem', 
        background: 'none', 
        border: 'none', 
        borderRadius: 0, 
        boxShadow: 'none', 
        position: 'relative' 
      }}>
        
        {/* Section 1: Our Story */}
        <div className="scroll-animate about-section" style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <AnimatedHeading text="About Shyara" />
            <p className="about-subtitle" style={{ 
              fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)', 
              fontWeight: 500, 
              color: 'var(--color-text-primary)', 
              marginBottom: '3rem', 
              marginTop: '-1rem', 
              letterSpacing: 0.5,
              lineHeight: 1.4,
              maxWidth: 800,
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0 1rem'
            }}>
              We're a freelance-powered digital collective, here to empower your brand online.
          </p>
        </div>
          
          <div className="about-card" style={{ 
            background: 'rgba(30,30,30,0.55)', 
            borderRadius: 28, 
            padding: 'clamp(1.5rem, 4vw, 3rem)', 
            boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)', 
            border: '1.5px solid rgba(127,66,167,0.18)', 
            backdropFilter: 'blur(12px)', 
            WebkitBackdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '200px', 
              height: '200px', 
              background: 'radial-gradient(circle, rgba(162,89,247,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)'
            }} />
            
            <h2 className="about-card-title" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
              fontWeight: 700, 
              color: 'var(--color-primary)', 
              marginBottom: '2rem', 
              letterSpacing: '-0.01em',
              textAlign: 'center'
            }}>
              <FancyText text="Our Story" />
            </h2>
            
            <div className="about-card-text" style={{ 
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', 
              lineHeight: 1.8, 
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              maxWidth: 800,
              margin: '0 auto'
            }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Every brand starts with a story. Ours began with two people and one shared belief:
              </p>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 600, 
                color: 'var(--color-text-primary)', 
                marginBottom: '1.5rem',
                fontStyle: 'italic'
              }}>
                "Great results don't need big offices — they need big ideas and the right people."
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                We saw too many small businesses, startups, and creators struggling to get quality digital work without paying digital team-sized bills.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                So, we built Shyara — not as a digital team, but as a curated collective of skilled freelancers who could deliver top-tier results with speed, creativity, and flexibility.
              </p>
              <p style={{ 
                fontSize: '1.1rem', 
                fontWeight: 500, 
                color: 'var(--color-text-primary)',
                marginBottom: '1.5rem'
              }}>
                From designing our first festive post for a local shop to managing cross-platform campaigns for growing brands, we've kept one thing constant:
              </p>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 600, 
                color: 'var(--color-primary)',
                fontStyle: 'italic'
              }}>
                "We treat every project like it's our own."
            </p>
          </div>
          </div>
        </div>

        {/* Section 2: How We Work */}
        <div className="scroll-animate" style={{ marginBottom: '6rem' }}>
            <h2 className="about-title" style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
              fontWeight: 700, 
              color: 'var(--color-primary)', 
              marginBottom: '3rem', 
              textAlign: 'center',
              letterSpacing: '-0.01em'
            }}>
              <FancyText text="How We Work" />
          </h2>
          
                     <div className="work-steps-grid" style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(2, 1fr)', 
             gap: '6rem',
             maxWidth: 1200,
             margin: '0 auto',
             position: 'relative'
           }}>
                         {/* Workflow Flow Lines */}
             <div style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '100%',
               height: '100%',
               pointerEvents: 'none',
               zIndex: 1
             }}>
               {/* Horizontal line from card 1 to card 2 */}
               <div style={{
                 position: 'absolute',
                 top: '25%',
                 left: '33.33%',
                 width: '33.33%',
                 height: '2px',
                 background: 'repeating-linear-gradient(to right, #a259f7 0px, #a259f7 8px, transparent 8px, transparent 16px)'
               }} />
               
               {/* Vertical line from card 2 to card 3 */}
               <div style={{
                 position: 'absolute',
                 top: '33.33%',
                 left: '66.67%',
                 width: '2px',
                 height: '33.33%',
                 background: 'repeating-linear-gradient(to bottom, #a259f7 0px, #a259f7 8px, transparent 8px, transparent 16px)'
               }} />
               
               {/* Horizontal line from card 3 to card 4 */}
               <div style={{
                 position: 'absolute',
                 top: '75%',
                 left: '33.33%',
                 width: '33.33%',
                 height: '2px',
                 background: 'repeating-linear-gradient(to right, #a259f7 0px, #a259f7 8px, transparent 8px, transparent 16px)'
               }} />
               
               {/* Arrow indicators */}
               <div style={{
                 position: 'absolute',
                 top: '25%',
                 left: '66.67%',
                 width: '0',
                 height: '0',
                 borderLeft: '8px solid #a259f7',
                 borderTop: '6px solid transparent',
                 borderBottom: '6px solid transparent'
               }} />
               
               <div style={{
                 position: 'absolute',
                 top: '66.67%',
                 left: '66.67%',
                 width: '0',
                 height: '0',
                 borderTop: '8px solid #a259f7',
                 borderLeft: '6px solid transparent',
                 borderRight: '6px solid transparent'
               }} />
               
               <div style={{
                 position: 'absolute',
                 top: '75%',
                 left: '66.67%',
                 width: '0',
                 height: '0',
                 borderLeft: '8px solid #a259f7',
                 borderTop: '6px solid transparent',
                 borderBottom: '6px solid transparent'
               }} />
             </div>
            
            {workSteps.map((step, index) => (
              <div
                key={step.number}
                className="work-step-card"
                style={{
                  background: 'rgba(30,30,30,0.55)',
                  borderRadius: 24,
                  padding: '2rem',
                  border: '1.5px solid rgba(127,66,167,0.18)',
                  boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredStep === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredStep === index 
                    ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                    : '0 8px 32px 0 rgba(80,80,120,0.18)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 2
                }}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div style={{
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
                  {step.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em',
                  textAlign: 'center'
                }}>
                  {step.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.6,
                  fontSize: '1rem',
                  textAlign: 'center'
                }}>
                  {step.description}
          </p>
        </div>
            ))}
          </div>
        </div>

        {/* Section 3: we have */}
        <div className="scroll-animate" style={{ marginBottom: '6rem' }}>
          <h2 className="about-title" style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 700, 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="We Have" />
          </h2>
          
          <div className="team-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto',
            marginBottom: '2rem'
          }}>
            {teamCategories.slice(0, 3).map((team, index) => (
              <div
                key={team.title}
                className="team-card"
                style={{
                  background: 'rgba(30,30,30,0.55)',
                  borderRadius: 24,
                  padding: '2rem',
                  border: '1.5px solid rgba(127,66,167,0.18)',
                  boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredTeam === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredTeam === index 
                    ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                    : '0 8px 32px 0 rgba(80,80,120,0.18)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={() => setHoveredTeam(index)}
                onMouseLeave={() => setHoveredTeam(null)}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${team.color}, ${team.color}80)`,
                  color: 'white',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: `0 8px 24px ${team.color}40`
                }}>
                  {team.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em'
                }}>
                  {team.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}>
                  {team.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* The Storytellers card - wider span */}
          <div style={{ 
            maxWidth: 600,
            margin: '0 auto 2rem',
            gridColumn: 'span 2'
          }}>
            <div
              className="team-card storytellers-card"
              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2.2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredTeam === 2 ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredTeam === 2 
                  ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                  : '0 8px 32px 0 rgba(80,80,120,0.18)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={() => setHoveredTeam(2)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <div style={{
                background: `linear-gradient(135deg, ${teamCategories[2].color}, ${teamCategories[2].color}80)`,
                color: 'white',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.8rem',
                boxShadow: `0 8px 24px ${teamCategories[2].color}40`
              }}>
                {teamCategories[2].icon}
              </div>
              
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)',
                marginBottom: '1.3rem',
                letterSpacing: '-0.01em'
              }}>
                {teamCategories[2].title}
              </h3>
              
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1.05rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                {teamCategories[2].description}
              </p>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(162,89,247,0.08)',
            borderRadius: 20,
                  padding: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(162,89,247,0.2)',
            maxWidth: 800,
            margin: '0 auto'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.6,
              margin: 0,
              fontStyle: 'italic'
            }}>
              We're fully remote, globally connected, and fuelled by coffee, deadlines, and the thrill of seeing our clients win.
            </p>
          </div>
        </div>

        {/* Section 4: What We Stand For */}
        <div className="scroll-animate" style={{ marginBottom: '6rem' }}>
          <h2 className="about-title" style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 700, 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="What We Stand For" />
          </h2>
          
          <div className="values-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto 2rem'
          }}>
            {values.slice(0, 2).map((value, index) => (
              <div
                key={value.title}
                className="value-card"
                style={{
                  background: 'rgba(30,30,30,0.55)',
                  borderRadius: 24,
                  padding: '2rem',
                  border: '1.5px solid rgba(127,66,167,0.18)',
                  boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredValue === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredValue === index 
                    ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                    : '0 8px 32px 0 rgba(80,80,120,0.18)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div style={{
                  background: `linear-gradient(135deg, ${value.color}, ${value.color}80)`,
                  color: 'white',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: `0 8px 24px ${value.color}40`
                }}>
                  {value.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600', 
                  color: 'var(--color-text-primary)', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.01em'
                }}>
                  {value.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Third value card - centered below the first two */}
          <div style={{ 
            maxWidth: 400,
            margin: '0 auto'
          }}>
            <div
              className="value-card"
              style={{
                background: 'rgba(30,30,30,0.55)',
                borderRadius: 24,
                padding: '2rem',
                border: '1.5px solid rgba(127,66,167,0.18)',
                boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredValue === 2 ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredValue === 2 
                  ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                  : '0 8px 32px 0 rgba(80,80,120,0.18)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onMouseEnter={() => setHoveredValue(2)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <div style={{
                background: `linear-gradient(135deg, ${values[2].color}, ${values[2].color}80)`,
                color: 'white',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: `0 8px 24px ${values[2].color}40`
              }}>
                {values[2].icon}
              </div>
              
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                color: 'var(--color-text-primary)', 
                marginBottom: '1rem',
                letterSpacing: '-0.01em'
              }}>
                {values[2].title}
              </h3>
              
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                fontSize: '1rem'
              }}>
                {values[2].description}
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: What Our Team has Achieved */}
        <div className="scroll-animate" style={{ marginBottom: '6rem' }}>
          <h2 className="about-title" style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: 700, 
            color: 'var(--color-primary)', 
            marginBottom: '3rem', 
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            <FancyText text="What Our Team has Achieved" />
          </h2>
          
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            maxWidth: 1000,
            margin: '0 auto'
          }}>
            {impactStats.map((stat, index) => (
              <div
                key={stat.label}
                className="impact-stat-card"
                style={{
                  background: 'rgba(30,30,30,0.55)',
                  borderRadius: 24,
                  padding: '2.5rem 2rem',
                  border: '1.5px solid rgba(127,66,167,0.18)',
                  boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredStat === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredStat === index 
                    ? '0 20px 40px 0 rgba(127,66,167,0.25)' 
                    : '0 8px 32px 0 rgba(80,80,120,0.18)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem',
                  textShadow: '0 4px 16px rgba(162,89,247,0.3)'
                }}>
                  {stat.number}
                </div>
                
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {stat.label}
                </div>
                
                <p style={{ 
                  color: 'var(--color-text-secondary)', 
                  lineHeight: 1.5,
                  fontSize: '1rem'
                }}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Closing & CTA */}
        <div className="scroll-animate" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(30,30,30,0.55)',
            borderRadius: 28,
            padding: '3rem',
            boxShadow: '0 8px 32px 0 rgba(80,80,120,0.18)',
            border: '1.5px solid rgba(127,66,167,0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maxWidth: 800,
            margin: '0 auto'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              color: 'var(--color-text-primary)', 
              marginBottom: '2rem',
              lineHeight: 1.3
            }}>
              We're not just another name in your inbox.
            </h2>
            
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              We're the team that's going to know your brand inside-out, fight for your goals, and celebrate your wins like they're ours.
            </p>
            
            <button
              onClick={handleContactClick}
              style={{
                background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '1.1rem',
                border: 'none',
                borderRadius: 16,
                padding: '1rem 2.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 24px rgba(162,89,247,0.3)',
                transform: 'scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(162,89,247,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(162,89,247,0.3)';
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 