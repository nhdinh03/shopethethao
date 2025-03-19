import React, { useState, useEffect, useCallback } from 'react';
import { UpOutlined } from '@ant-design/icons';
import './style.scss';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [scrollProgress, setScrollProgress] = useState(0);

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
      const scrollPosition = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      
      if (scrollPosition > getScrollThreshold()) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [screenSize]);

  return (
    <>
      {isVisible && (
        <div 
          className={`back-to-top ${isScrolling ? 'scrolling' : ''}`} 
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
          aria-label="Trở về đầu trang"
        >
          <UpOutlined />
        </div>
      )}
    </>
  );
};

export default BackToTop;
