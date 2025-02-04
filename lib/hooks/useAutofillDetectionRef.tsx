import { useLayoutEffect, useRef } from "react";
import "./useDetectAutofill.css";

export interface ISubscription {
  unsubscribe(): void;
}

export interface ISubject<T> {
  subscribe(callback: (value: T) => void): ISubscription;
  next(value: T): void;
}

function createSubject<T>(): ISubject<T> {
  const subscribers = new Set<(value: T) => void>();
  return {
    subscribe(callback: (value: T) => void): ISubscription {
      subscribers.add(callback);
      return {
        unsubscribe: () => subscribers.delete(callback),
      };
    },
    next(value: T) {
      subscribers.forEach(callback => callback(value));
    },
  };
}

export const useAutofillDetectionRef = (element: HTMLElement | null) => {
  const autofillStatusRef = useRef(false);
  const autofillStatusSubject = useRef<ISubject<boolean>>(createSubject<boolean>());

  useLayoutEffect(() => {
    if (!element) return;
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = "";

    const handleAnimationStart = (event: AnimationEvent) => {
      switch (event.animationName) {
        case 'onAutoFillStart':
          autofillStatusRef.current = true;
          autofillStatusSubject.current.next(true);
          break;
        case 'onAutoFillCancel':
          autofillStatusRef.current = false;
          autofillStatusSubject.current.next(false);
          break;
      }
    };

    element.addEventListener('animationstart', handleAnimationStart as EventListener);

    return () => {
      element.removeEventListener('animationstart', handleAnimationStart as EventListener);
    };
  }, [element]);

  return {
    autofillStatusRef,
    autofillStatusSubject: autofillStatusSubject.current
  };
};