import { useLayoutEffect, useState, useRef } from "react";
import "./detect-autofill.css";

export interface AutofillElement extends HTMLElement {
  isAutofilled?: boolean;
}

export type AutofillScope = HTMLElement | Document;

export const useAutofillDetection = (scope: AutofillScope | null) => {
  const [isAutofilled, setIsAutofilled] = useState(false);
  const mozFilterMatch =
    /^grayscale\(.+\) brightness\((1)?.*\) contrast\(.+\) invert\(.+\) sepia\(.+\) saturate\(.+\)$/;

  const autofillRef = useRef<HTMLElement | null>(null);

  const autofill = (target: AutofillElement) => {
    const hasError = target.classList.contains("error");
    if (hasError) {
      target.isAutofilled = false;
      setIsAutofilled(false);
    } else if (!target.isAutofilled) {
      target.isAutofilled = true;
      target.setAttribute("autofilled", "");
      target.dispatchEvent(
        new CustomEvent("autofill", {
          bubbles: true,
          cancelable: true,
        })
      );
      setIsAutofilled(true);
    }
  };

  const cancelAutofill = (target: AutofillElement) => {
    if (target.isAutofilled) {
      target.isAutofilled = false;
      target.removeAttribute("autofilled");
      target.dispatchEvent(
        new CustomEvent("autofillcancel", {
          bubbles: true,
          cancelable: false,
        })
      );
      setIsAutofilled(false);
    }
  };

  useLayoutEffect(() => {
    const onAnimationStart = (event: AnimationEvent) => {
      const target = event.target as AutofillElement;
      if (event.animationName.includes("onautofillstart")) {
        autofill(target);
      } else if (event.animationName.includes("autofillcancel")) {
        cancelAutofill(target);
      }
    };

    const onInput = (event: InputEvent) => {
      const target = event.target as AutofillElement;
      if ("data" in event) {
        cancelAutofill(target);
      } else {
        autofill(target);
      }
    };

    const onTransitionStart = (event: TransitionEvent) => {
      const target = event.target as AutofillElement;
      const mozFilterTransition =
        event.propertyName === "filter" &&
        getComputedStyle(target).filter.match(mozFilterMatch);

      if (mozFilterTransition) {
        if (mozFilterTransition[1]) {
          autofill(target);
        } else {
          cancelAutofill(target);
        }
      }
    };

    if (scope) {
      scope.addEventListener(
        "animationstart",
        onAnimationStart as EventListener,
        true
      );
      scope.addEventListener("input", onInput as EventListener, true);
      scope.addEventListener(
        "transitionstart",
        onTransitionStart as EventListener,
        true
      );
    }

    return () => {
      if (scope) {
        scope.removeEventListener(
          "animationstart",
          onAnimationStart as EventListener,
          true
        );
        scope.removeEventListener("input", onInput as EventListener, true);
        scope.removeEventListener(
          "transitionstart",
          onTransitionStart as EventListener,
          true
        );
      }
    };
  }, [scope]);

  return { isAutofilled, autofillRef };
};
