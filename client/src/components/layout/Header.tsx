import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/auth.api';
import type { SessionUser } from '../../features/auth/auth.api';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  xp: number;
  currentUser: SessionUser | null;
}

const NAV_LINKS = [
  { to: '/dashboard', label: 'Quest' },
];

export function Header({
  theme,
  onToggleTheme,
  xp,
  currentUser,
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const XP_PER_LEVEL = 1000;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const progressPercent = Math.min(
    (currentLevelXp / XP_PER_LEVEL) * 100,
    100
  );

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  return (
    <header className="top-hud font-pixel">
      <div className="hud-row">
        <div className="hud-left">
          <Link to="/" className="hud-brand" style={{ textDecoration: 'none' }}>
            <span>×</span>
            <span className="hud-logo">
              HABIT<span className="accent">SYNC</span>
            </span>
          </Link>

          <span className="hud-meta">LVL {level}</span>

          <div className="hud-bar-wrap">
            <div
              className="hud-bar"
              title={`${currentLevelXp} / ${XP_PER_LEVEL} XP`}
            >
              <div
                className="hud-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="hud-xp">{xp} XP</span>
          </div>
        </div>

        <div className="hud-right">
  <nav className="hud-links">
    {NAV_LINKS.map(({ to, label }) => (
      <Link
        key={to}
        to={to}
        style={{
          textDecoration: 'none',
          color:
            location.pathname === to
              ? 'var(--cyan-dark)'
              : 'var(--ink)',
        }}
      >
        {label}
      </Link>
    ))}
  </nav>

  {currentUser && (
    <span className="hud-user">
      {currentUser.name}
    </span>
  )}

  {currentUser && (
    <button
      type="button"
      onClick={handleLogout}
      className="hud-logout"
    >
      Logout
    </button>
  )}

  <button
    type="button"
    onClick={onToggleTheme}
    className="btn-small"
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    style={{ background: 'var(--paper)' }}
  >
    {theme === 'dark' ? '☀' : '☾'}
  </button>
</div>
      </div>

      <div className="hud-bottom-line" />
    </header>
  );
}
