"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface SmoothScrollContainerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export const SECTION_CHANGE_EVENT = "sectionChange";

export function SmoothScrollContainer({
  children,
  className = "",
  duration = 1200,
}: SmoothScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const currentSectionRef = useRef(currentSection);
  const isScrollingRef = useRef(isScrolling);
  const isScrollDisabledRef = useRef(isScrollDisabled);
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    isScrollDisabledRef.current = isScrollDisabled;
  }, [isScrollDisabled]);

  useEffect(() => {
    const handleWidgetExpandState = (e: Event) => {
      const customEvent = e as CustomEvent<{ expanded: boolean }>;
      setIsScrollDisabled(customEvent.detail.expanded);
    };

    window.addEventListener("widgetExpandStateChange", handleWidgetExpandState);
    return () => window.removeEventListener("widgetExpandStateChange", handleWidgetExpandState);
  }, []);

  const dispatchSectionChange = useCallback((sectionId: string, index: number) => {
    window.dispatchEvent(new CustomEvent(SECTION_CHANGE_EVENT, { detail: { sectionId, index } }));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    sectionsRef.current = Array.from(container.querySelectorAll("section[id]"));
    const sections = sectionsRef.current;
    const totalSections = sections.length;

    let lastScrollTime = 0;
    const scrollCooldown = duration + 100;

    const smoothScrollTo = (targetSection: number) => {
      if (isScrolling || targetSection < 0 || targetSection >= totalSections) return;

      const target = sections[targetSection];
      if (!target) return;

      setIsScrolling(true);
      setCurrentSection(targetSection);
      dispatchSectionChange(target.id, targetSection);

      const start = container.scrollTop;
      const end = target.offsetTop;
      const distance = end - start;
      const startTime = performance.now();

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + distance * easeOutCubic(progress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrollDisabledRef.current) return;
      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;
      lastScrollTime = now;

      smoothScrollTo(currentSection + (e.deltaY > 0 ? 1 : -1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollDisabledRef.current) return;

      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        lastScrollTime = now;
        smoothScrollTo(currentSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        lastScrollTime = now;
        smoothScrollTo(currentSection - 1);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollDisabledRef.current) return;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollDisabledRef.current) return;

      const now = Date.now();
      if (now - lastScrollTime < scrollCooldown) return;

      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        lastScrollTime = now;
        smoothScrollTo(currentSection + (diff > 0 ? 1 : -1));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSection, duration, isScrolling, dispatchSectionChange]);

  useEffect(() => {
    const sections = sectionsRef.current;
    if (sections.length > 0 && sections[0]) {
      dispatchSectionChange(sections[0].id, 0);
    }
  }, [dispatchSectionChange]);

  useEffect(() => {
    const animateToSection = (index: number) => {
      if (isScrollingRef.current) return;

      const sections = sectionsRef.current;
      const container = containerRef.current;
      const target = sections[index];
      if (!container || !target) return;

      setIsScrolling(true);
      setCurrentSection(index);
      dispatchSectionChange(target.id, index);

      const start = container.scrollTop;
      const end = target.offsetTop;
      const distance = end - start;
      const startTime = performance.now();

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + distance * easeOutCubic(progress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const index = sectionsRef.current.findIndex((s) => s.id === hash);
      if (index !== -1 && index !== currentSectionRef.current) {
        animateToSection(index);
      }
    };

    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionId: string }>;
      const index = sectionsRef.current.findIndex((s) => s.id === customEvent.detail.sectionId);
      if (index !== -1) animateToSection(index);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("navigateToSection", handleNavigate);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("navigateToSection", handleNavigate);
    };
  }, [duration, dispatchSectionChange]);

  return (
    <div ref={containerRef} className={`h-screen overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
