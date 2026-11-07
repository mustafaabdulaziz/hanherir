import { useEffect } from "react";

/* Adds data-in to .reveal and .cat-card elements as they scroll into view.
   A data attribute is used instead of a class so React re-renders never wipe it. */
export function useReveal(dep) {
  useEffect(() => {
    if (!dep || !("IntersectionObserver" in window)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    document.documentElement.classList.add("can-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.in = "1";
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    document
      .querySelectorAll(".reveal:not([data-in]), .cat-card:not([data-in])")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [dep]);
}
