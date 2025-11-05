import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import ResponsiveHome from './components/ResponsiveHome';
import ResponsiveAbout from './components/ResponsiveAbout';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import ClientLoginPage from './pages/ClientLoginPage';
import HomeNoLoading from './pages/HomeNoLoading';
import SocialMediaManagementPage from './pages/services/SocialMediaManagementPage';
import FestivePostsPage from './pages/services/FestivePostsPage';
import AdsCampaignManagementPage from './pages/services/AdsCampaignManagementPage';
import WebsiteDevelopmentPage from './pages/services/WebsiteDevelopmentPage';
import AppDevelopmentPage from './pages/services/AppDevelopmentPage';
import VideoEditingReelsPage from './pages/services/VideoEditingReelsPage';
import PersonalizedServicesPage from './pages/services/PersonalizedServicesPage';
import Cart from './pages/Cart';
import AddItemsPage from './pages/AddItemsPage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import { CartProvider } from './context/CartContext';

// 404 Component
const NotFound = () => {
  return (
    <Layout>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '4rem', color: '#a259f7', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '2rem', color: '#e7e7e7', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#a7a7a7', fontSize: '1.1rem', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'linear-gradient(90deg,#7f42a7,#6600c5 80%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: 12,
            padding: '1rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginRight: '1rem'
          }}
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'rgba(162,89,247,0.10)',
            color: '#a259f7',
            border: '1px solid #a259f7',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 12,
            padding: '1rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Go Home
        </button>
      </div>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout><ResponsiveHome /></Layout>} />
          <Route path="/home-alt" element={<HomeNoLoading />} />
          <Route path="/client-login" element={<Layout><ClientLoginPage /></Layout>} />
          <Route path="/about" element={<Layout><ResponsiveAbout /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/services/social-media-management" element={<Layout><SocialMediaManagementPage /></Layout>} />
          <Route path="/services/festive-posts" element={<Layout><FestivePostsPage /></Layout>} />
          <Route path="/services/ads-campaign-management" element={<Layout><AdsCampaignManagementPage /></Layout>} />
          <Route path="/services/website-development" element={<Layout><WebsiteDevelopmentPage /></Layout>} />
          <Route path="/services/app-development" element={<Layout><AppDevelopmentPage /></Layout>} />
          <Route path="/services/video-editing-reels" element={<Layout><VideoEditingReelsPage /></Layout>} />
          <Route path="/services/personalized" element={<Layout><PersonalizedServicesPage /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/add-items" element={<Layout><AddItemsPage /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/payment" element={<Layout><Payment /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
