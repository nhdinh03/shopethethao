import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Menu = () => {
  const submenuRef = useRef(null);
  const location = useLocation();

  // Reset scroll functionality khi thay đổi route
  useEffect(() => {
    if (submenuRef.current) {
      submenuRef.current.scrollTop = 0;
      enableScroll();
      // Remove any inline overflow style from body
      document.body.style.removeProperty("overflow");
    }
  }, [location]);

  // Enable scroll functionality
  const enableScroll = () => {
    if (submenuRef.current) {
      submenuRef.current.style.overflowY = "auto";
      submenuRef.current.style.pointerEvents = "auto";
    }
  };

  // Lưu vị trí scroll khi đóng menu
  const handleMenuClose = () => {
    if (submenuRef.current) {
      const scrollPosition = submenuRef.current.scrollTop;
      sessionStorage.setItem("menuScrollPosition", scrollPosition.toString());
    }
    // ... existing close logic
  };

  // Khôi phục vị trí scroll khi mở lại menu
  const handleMenuOpen = () => {
    if (submenuRef.current) {
      enableScroll();

      const savedPosition = sessionStorage.getItem("menuScrollPosition");
      if (savedPosition) {
        requestAnimationFrame(() => {
          submenuRef.current.scrollTop = parseInt(savedPosition);
          enableScroll();
        });
      }
    }
    // ... existing open logic
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("menuScrollPosition");
      if (submenuRef.current) {
        enableScroll();
      }
      // Remove any inline overflow style from body
      document.body.style.removeProperty("overflow");
    };
  }, []);

  return (
    <div className="submenu-container">
      <div
        ref={submenuRef}
        className="submenu-grid"
        style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}
      >
        {/* ... existing menu items */}
      </div>
    </div>
  );
};

export default Menu;
