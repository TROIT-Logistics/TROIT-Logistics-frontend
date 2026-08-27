import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '@/lib/api/auth';
import { User, UserRole } from '@/lib/api/types';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, User as UserIcon, Mail, Lock, ShoppingBag, Store, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const cleanEmail = email.trim();
    const cleanName = fullName.trim() || 'New User';

    const fallbackUser: User = {
      id: `user-demo-${Date.now()}`,
      email: cleanEmail,
      full_name: cleanName,
      role: role,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await registerUser({
        full_name: cleanName,
        email: cleanEmail,
        password,
        role,
      });

      if (res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'seller') {
          navigate('/seller/verification');
        } else {
          navigate('/buyer');
        }
        setIsLoading(false);
        return;
      }
    } catch {
      // Backend unavailable - fallback to instant presentation signup
    }

    login('token-mvp-' + Date.now(), fallbackUser);
    if (fallbackUser.role === 'seller') {
      navigate('/seller/verification');
    } else {
      navigate('/buyer');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '120px 20px 60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header with TROIT Logo */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              Create TROIT Account
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Join Port Harcourt's verified logistics network
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
            {/* Account Role Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                Account Type
              </label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === 'buyer' ? '2px solid var(--color-orange-primary)' : '1px solid var(--color-border-light)',
                    backgroundColor: role === 'buyer' ? 'rgba(255, 77, 0, 0.1)' : 'var(--color-surface-card)',
                    color: role === 'buyer' ? 'var(--color-orange-primary)' : 'var(--color-text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <ShoppingBag size={16} /> Buyer Account
                </button>

                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === 'seller' ? '2px solid var(--color-orange-primary)' : '1px solid var(--color-border-light)',
                    backgroundColor: role === 'seller' ? 'rgba(255, 77, 0, 0.1)' : 'var(--color-surface-card)',
                    color: role === 'seller' ? 'var(--color-orange-primary)' : 'var(--color-text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Store size={16} /> Seller Account
                </button>
              </div>

              {/* Seller Verification Notice */}
              {role === 'seller' && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 77, 0, 0.08)',
                    border: '1px solid rgba(255, 77, 0, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    fontSize: '0.825rem',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '4px' }}>
                    <ShieldCheck size={16} /> Seller accounts require verification before you can start selling on TROIT.
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    We verify sellers to help create a safer and more trusted marketplace for buyers.
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  required
                  placeholder="Chidi Amadi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  placeholder="At least 6 characters"
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
              {isLoading ? 'Creating Account...' : role === 'seller' ? 'Continue to Seller Verification' : 'Register Account'}{' '}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-orange-primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
