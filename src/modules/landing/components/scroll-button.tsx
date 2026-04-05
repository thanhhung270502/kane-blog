"use client";

import { ArrowLineUp, CaretDown } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ScrollButtonProps {
  targetId: string;
  isBackToTop?: boolean;
}

export function ScrollButton({ targetId, isBackToTop = false }: ScrollButtonProps) {
  const scrollTo = () => {
    window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { sectionId: targetId } }));
    window.history.pushState(null, "", `#${targetId}`);
  };

  const Icon = isBackToTop ? ArrowLineUp : CaretDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 flex justify-center"
    >
      <button
        onClick={scrollTo}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all hover:border-white/40 hover:bg-white/10"
        aria-label={isBackToTop ? "Back to top" : "Scroll to next section"}
      >
        <Icon className="h-6 w-6 text-white/60 transition-colors group-hover:text-white" />
      </button>
    </motion.div>
  );
}
