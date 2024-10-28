import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ targetPaths = [] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (targetPaths.includes(pathname)) {
      window.scrollTo(0, 0);
    }
  }, [pathname, targetPaths]);

  return null;
};

export default ScrollToTop;
