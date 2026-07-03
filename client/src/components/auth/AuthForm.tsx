import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { login } from '../../features/auth/auth.api';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  onSubmit?: (data: { email: string; password: string; username?: string }) => void | Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const isSignup = mode === 'signup';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

   const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setIsSubmitting(true);
  setError('');

  const authData = {
    email: email.trim(),
    password: password.trim(),
    ...(isSignup ? { username: username.trim() } : {}),
  };

  try {
    if (isSignup) {
      await onSubmit?.(authData); // register
    }
    await login(authData.email, authData.password); // always create session
    navigate("/dashboard")

  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.message || 'Authentication request failed.'
      );
    } else if (err instanceof Error && err.message) {
      setError(err.message);
    } else {
      setError('Authentication request failed.');
    }
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="px-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid var(--px-border)', paddingBottom: 16 }}>
        <h2
          className="font-pixel"
          style={{ fontSize: 17, color: 'var(--px-primary)', lineHeight: 1.8 }}
        >
          {isSignup ? '▶ JOIN QUEST' : '▶ LOGIN'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--px-text-muted)', marginTop: 6 }}>
          {isSignup
            ? 'Create your hero account'
            : 'Continue your adventure'}
        </p>
      </div>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {isSignup && (
          <div>
            <label className="px-label" htmlFor="username" style={{ fontSize: 8 }}>USERNAME</label>
            <input
              id="username"
              type="text"
              className="px-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="HeroName123"
              required
            />
          </div>
        )}

        <div>
          <label className="px-label" htmlFor="email" style={{ fontSize: 11 }}>EMAIL</label>
          <input
            id="email"
            type="email"
            className="px-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hero@example.com"
            required
          />
        </div>

        <div>
          <label className="px-label" htmlFor="password" style={{ fontSize: 11 }}>PASSWORD</label>
          <input
            id="password"
            type="password"
            className="px-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      {error && (
        <p className="font-pixel" style={{ fontSize: 8, color: '#f87171', lineHeight: 2, margin: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="px-btn px-btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={isSubmitting}
      >
        {isSubmitting ? '…' : isSignup ? '⚔ CREATE HERO' : '▶ START QUEST'}
      </button>
    </form>
  );
}
