"use client";

import { motion } from "framer-motion";

import type { LandingLifestyleData } from "../types";

import { MusicWidget, RoutinesWidget, ScrollButton } from ".";

interface SoulSectionProps {
  data: LandingLifestyleData;
}

export function SoulSection({ data }: SoulSectionProps) {
  const instruments = data?.music?.instruments ?? [];
  const currentlyPlaying = data?.music?.currentlyPlaying ?? "";
  const routines = data?.routines ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-8 text-center text-3xl font-bold text-white"
      >
        The Soul Behind the Code
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <MusicWidget instruments={instruments} currentlyPlaying={currentlyPlaying} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <RoutinesWidget routines={routines} />
        </motion.div>
      </motion.div>

      <ScrollButton targetId="hero" isBackToTop />
    </div>
  );
}
