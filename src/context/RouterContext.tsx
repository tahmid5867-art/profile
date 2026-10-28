import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  pathname: string;
  hash: string;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  pathname: '/',
  hash: '',
  searchParams: new URLSearchParams(),
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState(() => window.location.pathname + window.location.search + window.location.hash);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search + window.location.hash);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (to.startsWith('#')) {
      // Anchor scroll
      window.location.hash = to;
      const targetEl = document.querySelector(to);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (to !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.pushState({}, '', to);
      setCurrentUrl(to);
      window.scrollTo(0, 0);
    }
  }, []);

  const pathname = window.location.pathname;
  const hash = window.location.hash;
  const searchParams = new URLSearchParams(window.location.search);

  return (
    <RouterContext.Provider
      value={{
        path: currentUrl,
        navigate,
        pathname,
        hash,
        searchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};
