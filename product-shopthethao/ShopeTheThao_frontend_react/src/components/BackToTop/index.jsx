import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UpOutlined } from '@ant-design/icons';
import './style.scss';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const scrollTimeout = useRef(null);
  const fadeTimeout = useRef(null);

  // Enhanced screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setScreenSize('xxsmall');
      } else if (width <= 480) {
        setScreenSize('xsmall');
      } else if (width <= 760) {
        setScreenSize('small');
      } else if (width <= 960) {
        setScreenSize('medium');
      } else if (width <= 1200) {
        setScreenSize('large');
      } else if (width <= 1600) {
        setScreenSize('xlarge');
      } else {
        setScreenSize('xxlarge');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Enhanced easing function for smoother scrolling
  const easeInOutCubic = (t) => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  // Optimized scroll to top function with visual feedback
  const scrollToTop = useCallback(() => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    // Adjust duration based on page position for a more natural feel
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.pageYOffset;
    const scrollRatio = scrollPosition / pageHeight;
    
    // Dynamic duration based on scroll position (faster for shorter distances)
    const baseDuration = 1000;
    const duration = Math.max(600, baseDuration * (0.5 + scrollRatio * 0.5));
    
    const start = window.pageYOffset;
    const startTime = performance.now();

    const scroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current scroll position
      const currentPosition = start * (1 - easeInOutCubic(progress));
      
      // Update scroll progress for potential UI feedback
      setScrollProgress(progress);
      
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        setIsScrolling(false);
        setScrollProgress(0);
      }
    };

    requestAnimationFrame(scroll);
  }, [isScrolling]);

  // Enhanced scroll detection with dynamic threshold
  useEffect(() => {
    const getScrollThreshold = () => {
      if (['xxsmall', 'xsmall'].includes(screenSize)) return 180;
      if (['small', 'medium'].includes(screenSize)) return 250;
      if (['large', 'xlarge'].includes(screenSize)) return 300;
      return 400; // xxlarge
    };

    const toggleVisibility = () => {
      // Hide button if screen width is less than 376px
      if (window.innerWidth < 424) {
        setIsVisible(false);
        return;
      }

      const scrollPosition = window.pageYOffset;
      if (scrollPosition > getScrollThreshold()) {
        setIsVisible(true);
        setIsActive(true);
        
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
        
        scrollTimeout.current = setTimeout(() => {
          setIsActive(false);
        }, 30000);
      } else {
        setIsVisible(false);
        setIsActive(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility); // Add resize listener to check width changes

    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [screenSize]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <>
      {isVisible && (
        <button 
          type="button"
          className={`back-to-top ${isScrolling ? 'scrolling' : ''} 
                     ${isActive ? 'active' : 'inactive'}`}
          onClick={scrollToTop}
          onKeyPress={handleKeyPress}
          onMouseEnter={() => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
            setIsActive(true);
          }}
          onMouseLeave={() => {
            scrollTimeout.current = setTimeout(() => {
              setIsActive(false);
            }, 2000);
          }}
          aria-label="Trở về đầu trang"
        >
          <UpOutlined />
        </button>
      )}
    </>
  );
};

export default BackToTop;
