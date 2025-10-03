import { useEffect, useState } from 'react';

interface UseAnimateModalProps {
  isOpen: boolean;
  duration?: number;
}

const ANIMATION_DURATION = 300;

const useAnimateModal = ({ isOpen, duration = ANIMATION_DURATION }: UseAnimateModalProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsAnimating(true);
        }, 10);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [duration, isOpen]);

  return { shouldRender, isAnimating };
};

export default useAnimateModal;
