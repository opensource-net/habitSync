import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { getSession } from '../features/auth/auth.api';
import tinyPupImg from '../assets/pet/tinyPup1.png';

const FEATURES = [
  { icon: '⚔', label: 'Track daily & weekly quests' },
  { icon: '🐾', label: 'Raise your pixel pet companion' },
  { icon: '✨', label: 'Earn XP and level up' },
  { icon: '🏆', label: 'Unlock badges and achievements' },
];

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkExistingSession() {
      try {
        await getSession();
        navigate('/dashboard');
      } catch {
        // No active session, stay on login page.
      }
    }

    void checkExistingSession();
  }, [navigate]);

  function handleLogin() {
    navigate('/dashboard');
  }

  return (
    <div className='login-page'>
      <div className='login-shell'>
        <section className='login-left'>
          <div className='login-copy'>
            <h1 className='login-title font-pixel'>
              <span className='login-title-cyan'>HABIT</span>
              <span className='login-title-gold'>SYNC</span>
            </h1>

            <p className='login-subtitle font-pixel'>
              Level up your daily life.
              <br />
              One habit at a time.
            </p>
          </div>

          <div className='login-pet-card panel'>
            <div
              className='login-pet-label font-pixel'
              style={{ fontSize: 13 }}
            >
              PET COMPANION
            </div>

            <img src={tinyPupImg} alt='Tiny Pup' className='login-pet-image' />

            <div className='pet-name font-pixel'>TINY PUP</div>

            <div className='login-pet-progress'>
              <div className='login-pet-progress-head font-pixel'>
                <span>XP</span>
                <span>0 / 100</span>
              </div>

              <div className='progress-track'>
                <div className='progress-fill' style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          <div className='login-features'>
            {FEATURES.map(({ icon, label }) => (
              <div
                key={label}
                className='login-feature font-pixel'
                style={{
                  fontSize: 12,
                  color: 'var(--px-text)',
                }}
              >
                <span className='login-feature-icon'>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='login-right'>
          <div className='login-auth-card panel'>
            <AuthForm mode='login' onSubmit={handleLogin} />
          </div>

          <p className='login-signup font-pixel' style={{ fontSize: 13 }}>
            No account?{' '}
            <Link
              to='/signup'
              className='login-signup-link'
              style={{ fontSize: 13 }}
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
