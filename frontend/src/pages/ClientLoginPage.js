import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { sanitizeText } from '../utils/sanitize';
import { waitForDOM } from '../utils/hydration';

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      // Wait for DOM to be ready before submitting
      await waitForDOM();
      
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/client-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });      
      const data = await res.json();
      if (!res.ok) {
        // Sanitize error message before displaying
        const errorMessage = data.message || 'Login failed';
        throw new Error(sanitizeText(errorMessage));
      }
      // Sanitize token before storing (though tokens are usually safe, this is defensive)
      const token = data.token ? String(data.token).trim() : '';
      if (token) {
        localStorage.setItem('client_jwt', token);
      }
      setLoading(false);
      navigate('/client-dashboard');
    } catch (err) {
      setLoading(false);
      // Sanitize error message before displaying
      setError(sanitizeText(err.message || 'Login failed'));
    }
  };

  return (
    <>
      {showLoading && <LoadingScreen message="Please buy a service first." />}
      {!showLoading && (
        <div className="login-container">
          <div className="login-card">
            <div className="login-logo-bg">
              <User className="login-logo-icon" />
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <h2 className="login-title"><User className="login-title-icon" /> Client Login</h2>
              <div className="login-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="login-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="login-field login-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="login-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff className="login-eye-icon" /> : <Eye className="login-eye-icon" />}
                </button>
              </div>
              <div className="login-remember">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="login-checkbox"
                />
                <label htmlFor="remember" className="login-remember-label">Remember me</label>
              </div>
              {error && <div className="login-error">{error}</div>}
              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader2 className="login-btn-icon login-spin" /> : <LogIn className="login-btn-icon" />} Login
              </button>
            </form>
          </div>
          <button
            className="not-client-btn"
            type="button"
            onClick={() => {
              setShowLoading(true);
              setTimeout(() => navigate('/services'), 1400);
            }}
            style={{
              marginTop: 24,
              background: '#fff',
              color: '#000',
              border: '1.5px solid #181818',
              borderRadius: 50,
              padding: '0.7rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'background 0.16s, color 0.16s, border 0.16s',
              boxShadow: 'none',
              display: 'block',
              width: 'fit-content',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Not our client?
          </button>
        </div>
      )}
    </>
  );
};

export default ClientLoginPage; 