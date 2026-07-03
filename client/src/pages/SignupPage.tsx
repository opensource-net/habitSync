import { Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { signup } from '../features/auth/auth.api';

export default function SignupPage() {
  async function handleSignup(data: {
    email: string;
    password: string;
    username?: string;
  }) {
    const userId = data.username?.trim();

    if (!userId) {
      throw new Error('Username is required');
    }

    await signup(userId, data.email, data.password);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100svh - 64px)',
        gap: 16,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <AuthForm mode='signup' onSubmit={handleSignup} />
        <p
          className='font-pixel'
          style={{
            fontSize: 12,
            textAlign: 'center',
            color: 'var(--px-text-muted)',
            lineHeight: 2,
            marginTop: 16,
          }}
        >
          Have an account?{' '}
          <Link
            to='/'
            style={{ color: 'var(--px-primary)', textDecoration: 'none' }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
