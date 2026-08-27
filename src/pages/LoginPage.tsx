import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/api/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      if (res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/buyer');
        }
      } else {
        setError('Invalid server response');
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '120px 20px 60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header with TROIT Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: 'var(--color-orange-primary)',
                  display: 'block',
                }}
              >
                TROIT
              </span>
            </Link>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px', color: 'var(--color-text-main)' }}>
              Sign in to TROIT
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Access Port Harcourt's trusted logistics marketplace
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                color: '#EF4444',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-page)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-page)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-orange"
              disabled={isLoading}
              style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-orange-primary)', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
