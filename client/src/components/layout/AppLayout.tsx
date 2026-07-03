import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getSession, type SessionUser } from '../../features/auth/auth.api';
import { useEffect, useState } from 'react';
import { Header } from './Header';

//const XP_STORAGE_KEY = 'habit-tracker-xp';
const THEME_STORAGE_KEY = 'habit-tracker-theme';

type LayoutContext = {
  xp: number;
  setXp: React.Dispatch<React.SetStateAction<number>>;
};

export default function AppLayout() {
  const location = useLocation();
const navigate = useNavigate();

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [xp, setXp] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  // useEffect(() => {
  //   localStorage.setItem(XP_STORAGE_KEY, String(xp));
  // }, [xp]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

 useEffect(() => {
  async function checkSession() {
    try {
      const sessionUser = await getSession();
      setCurrentUser(sessionUser);
    } catch {
      setCurrentUser(null);
      setXp(0)

      if (location.pathname.startsWith('/dashboard')) {
        navigate('/', { replace: true });
      }
    }
  }

  checkSession();
}, [location.pathname, navigate]);

  function handleToggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <>
      <Header
  theme={theme}
  onToggleTheme={handleToggleTheme}
  xp={xp}
  currentUser={currentUser}
/>
      <Outlet context={{ xp, setXp } satisfies LayoutContext} />
    </>
  );
}
