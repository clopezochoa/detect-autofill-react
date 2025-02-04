import { useLayoutEffect, useState } from "react";
import "./useDetectAutofill.css";

export const useAutofillDetectionState = (element: HTMLElement | null) => {
  const [isAutofilled, setIsAutofilled] = useState(false);

  useLayoutEffect(() => {
    if (!element) return;
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "";

    const handleAnimationStart = (event: AnimationEvent) => {
      switch (event.animationName) {
        case 'onAutoFillStart':
          setIsAutofilled(true);
          break;
        case 'onAutoFillCancel':
          setIsAutofilled(false);
          break;
      }
    };

    element.addEventListener('animationstart', handleAnimationStart as EventListener);

    return () => {
      element.removeEventListener('animationstart', handleAnimationStart as EventListener);
    };
  }, [element]);

  return isAutofilled;
};