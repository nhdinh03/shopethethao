import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useCustomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reloadFlag, setReloadFlag] = useState(false);

  const navigateAndReload = (path, reload = false) => {
    navigate(path);
    setReloadFlag(reload);
  };

  useEffect(() => {
    if (reloadFlag && location.pathname === window.location.pathname) {
      setReloadFlag(false);
      window.location.reload();
    }
  }, [reloadFlag, location.pathname]);

  return navigateAndReload;
};

export default useCustomNavigation;
