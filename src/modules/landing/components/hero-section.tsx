"use client";

import { ArrowDown, Envelope, GithubLogo, LinkedinLogo, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/shared";

import { LANDING_SOCIAL } from "../constants";
import type { LandingHeroData } from "../types";

import { LiquidGlass } from ".";

interface HeroSectionProps {
  data: LandingHeroData;
}

export function HeroSection({ data }: HeroSectionProps) {
  const scrollToTech = () => {
    window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { sectionId: "tech" } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl"
    >
      <LiquidGlass blur="xl" glow className="p-6 md:p-10">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-linear-to-br from-cyan-500/20 to-purple-500/20 blur-xl" />

              <div className="relative h-64 w-48 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/20 md:h-72 md:w-56">
                {data.avatar ? (
                  <Image
                    src={data.avatar}
                    alt={data.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-500/20 to-purple-500/20">
                    <span className="text-6xl font-bold text-white/30">
                      {data.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
              </div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-2xl border border-dashed border-cyan-500/30"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex flex-1 flex-col items-center gap-4 text-center md:items-start md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
            >
              {data.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-xl text-cyan-400"
            >
              <Sparkle size={20} />
              {data.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-md text-lg text-white/60"
            >
              {data.tagline}
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-2 flex items-center gap-3"
            >
              <a
                href={LANDING_SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                aria-label="GitHub"
              >
                <GithubLogo size={20} className="text-white/70 hover:text-white" />
              </a>
              <a
                href={LANDING_SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={20} className="text-white/70 hover:text-white" />
              </a>
              <a
                href={`mailto:${LANDING_SOCIAL.email}`}
                className="rounded-full bg-white/5 p-2 transition-colors hover:bg-white/10"
                aria-label="Email"
              >
                <Envelope size={20} className="text-white/70 hover:text-white" />
              </a>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={scrollToTech}
                variant="outlined-gray"
                size="md"
                startIcon={ArrowDown}
                className="mt-4 border-white/20 text-white/80 hover:bg-white/10"
              >
                Explore My Work
              </Button>
            </motion.div>
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
