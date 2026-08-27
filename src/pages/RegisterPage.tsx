import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { registerUser } from '@/lib/api/auth';
import { UserRole } from '@/lib/api/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { UserPlus, ArrowRight, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        full_name: fullName,
        email,
        phone_number: phone || undefined,
        password,
        role,
      });

      if (res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'seller') {
          navigate('/seller');
        } else {
          navigate('/buyer');
        }
      }
    } catch (err) {
      setError((err as Error).message || 'Registration failed. Please check inputs.');
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
            maxWidth: '460px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 77, 0, 0.1)',
                color: 'var(--color-orange-primary)',
                marginBottom: '12px',
              }}
            >
              <UserPlus size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>Create TROIT Account</h2>
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
            {/* Account Role Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                Account Type
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === 'buyer' ? '2px solid var(--color-orange-primary)' : '1px solid var(--color-border-light)',
                    backgroundColor: role === 'buyer' ? 'rgba(255, 77, 0, 0.08)' : 'var(--color-surface-card)',
                    color: role === 'buyer' ? 'var(--color-orange-primary)' : 'var(--color-text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setRole('buyer')}
                >
                  🛒 I am a Buyer
                </button>

                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: role === 'seller' ? '2px solid var(--color-orange-primary)' : '1px solid var(--color-border-light)',
                    backgroundColor: role === 'seller' ? 'rgba(255, 77, 0, 0.08)' : 'var(--color-surface-card)',
                    color: role === 'seller' ? 'var(--color-orange-primary)' : 'var(--color-text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setRole('seller')}
                >
                  🏪 I am a Seller
                </button>
              </div>
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
                  placeholder="e.g. Amaka Okorie"
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
                  placeholder="name@domain.com"
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Phone Number (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  placeholder="+2348012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="At least 8 characters"
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
              {isLoading ? 'Creating Account...' : 'Register'} <ArrowRight size={18} />
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
