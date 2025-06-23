import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import './App.css';
import Splash from './Splash';
import './Splash.css';

const MENU_API =
  'https://dlaroslin.pl/modules/twhamburgermenu/api.php?token=d2bdc4787ba8920e9d9f7a2c993ccb01';

const urls = {
  home: 'https://dlaroslin.pl/',
  menu: 'https://dlaroslin.pl/kategorie',
  search: 'https://dlaroslin.pl/szukaj',
  account:
    'https://dlaroslin.pl/logowanie?back=https%3A%2F%2Fdlaroslin.pl%2Fmoje-konto',
  favourites:
    'https://dlaroslin.pl/logowanie?back=https%3A%2F%2Fdlaroslin.pl%2Fmoje-listy-zyczen',
  cart: 'https://dlaroslin.pl/koszyk',
  privacy: 'https://dlaroslin.pl/cms/130/polityka-prywatnosci',
};

// Używamy emoji – mają natywny kolor.
const NAV_ITEMS = [
  { key: 'home', emoji: '🏠', label: 'Home' },
  { key: 'menu', emoji: '☰', label: 'Menu' },
  { key: 'search', emoji: '🔍', label: 'Szukaj' },
  { key: 'account', emoji: '👤', label: 'Konto' },
  { key: 'favourites', emoji: '❤️', label: 'Ulubione' },
  { key: 'cart', emoji: '🛒', label: 'Koszyk' },
];

function MenuTree({ nodes, onNavigate }) {
  if (!nodes?.length) return null;
  return (
    <ul className="menu-tree">
      {nodes.map((n, idx) => (
        <li key={idx}>
          <button type="button" onClick={() => onNavigate(n.url)}>
            {n.label.replace(/\\u[0-9a-fA-F]{4}/g, (m) =>
              String.fromCharCode(parseInt(m.replace('\\u', ''), 16)),
            )}
          </button>
          {n.children?.length > 0 && (
            <MenuTree nodes={n.children} onNavigate={onNavigate} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [currentKey, setCurrentKey] = useState('home');
  const [iframeError, setIframeError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuData, setMenuData] = useState(null);

  const iframeRef = useRef(null);

  const safeNavigateIframe = (url) => {
    try {
      iframeRef.current?.contentWindow?.location.replace(url);
    } catch (e) {
      if (iframeRef.current) iframeRef.current.src = url;
    }
  };

  const navigate = useCallback((keyOrUrl) => {
    if (typeof keyOrUrl === 'string' && urls[keyOrUrl]) {
      setCurrentKey(keyOrUrl);
      window.history.pushState({ page: keyOrUrl }, '', `?page=${keyOrUrl}`);
    } else if (typeof keyOrUrl === 'string') {
      safeNavigateIframe(keyOrUrl);
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen && !menuData) {
      fetch(MENU_API)
        .then((r) => r.json())
        .then((json) => setMenuData(json))
        .catch(() => setMenuData([]));
    }
  }, [sidebarOpen, menuData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page && urls[page]) setCurrentKey(page);

    const onPopState = (ev) => {
      const pageKey = ev.state?.page;
      if (pageKey && urls[pageKey]) setCurrentKey(pageKey);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavClick = (key) => {
    if (key === 'menu') {
      setSidebarOpen((o) => !o);
    } else {
      setSidebarOpen(false);
      navigate(key);
    }
  };

  const handlePrivacyClick = () => {
    navigate(urls.privacy);
  };

  return (
    <>
      <Splash />
      <div className="app">
        {iframeError ? (
          <div className="iframe-fallback" aria-live="polite">
            <p>Błąd ładowania. Sprawdź internet lub spróbuj ponownie.</p>
            <button type="button" onClick={() => setIframeError(false)}>
              Spróbuj ponownie
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            key={currentKey}
            src={urls[currentKey] || urls.home}
            title="dlaroslin.pl"
            sandbox="allow-forms allow-scripts allow-popups allow-modals allow-same-origin allow-storage-access-by-user-activation"
            className="iframe-full"
            onError={() => setIframeError(true)}
          />
        )}

        {/* Sidebar */}
        <div
          className="sidebar-overlay"
          style={{ position: 'fixed', top: 0, left: sidebarOpen ? 0 : '-80vw', width: '80vw', height: '100vh', background: '#fff', boxShadow: '2px 0 10px rgba(0,0,0,.2)', transition: 'left 0.25s ease', zIndex: 1000, overflowY: 'auto' }}
          aria-hidden={!sidebarOpen}
        >
          <button type="button" onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.25rem' }}>
            <FaTimes aria-hidden="true" /> ZAMKNIJ
          </button>
          {menuData ? <MenuTree nodes={menuData} onNavigate={navigate} /> : <p style={{ padding: '1rem' }}>Ładowanie menu…</p>}
        </div>

        {/* Bottom navigation */}
                {/* Bottom navigation */}
        <nav
          className="bottom-nav"
          style={{
            position: 'fixed',
            left: 0,
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
            width: '100%',
            background: '#fff',
            borderTop: '1px solid #DDD',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '6px 0',
            boxShadow: '0 -1px 5px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          {NAV_ITEMS.map(({ key, emoji, label }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              title={label}
              className={key === currentKey ? 'active' : undefined}
              onClick={() => handleNavClick(key)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
              }}
            >
              <span role="img" aria-hidden="true" style={key==='search'?{marginTop:'3px'}:undefined}>{emoji}</span>
              {/* Zachowujemy równą wysokość, więc w "search" dajemy ukryty span */}
              <span style={{ fontSize: '11px', visibility: key === 'search' ? 'hidden' : 'visible' }}>
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Floating Privacy Button */}
        <button
          type="button"
          aria-label="Polityka prywatności"
          title="Polityka prywatności"
          onClick={handlePrivacyClick}
          style={{
            position: 'fixed',
            right: '16px',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            zIndex: 1001,
            fontSize: '24px',
          }}
        >
          <span role="img" aria-hidden="true">🛡️</span>
        </button>
      </div>
    </>
  );
}
