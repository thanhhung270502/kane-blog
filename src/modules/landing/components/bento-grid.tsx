"use client";

import { motion } from "framer-motion";

import type { LandingProject, LandingTechItem } from "../types";

import { ProjectCard, ScrollButton, TechStackWidget } from ".";

interface BentoGridProps {
  projects: LandingProject[];
  techStack: LandingTechItem[];
}

export function BentoGrid({ projects, techStack }: BentoGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto max-w-6xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-8 text-center text-3xl font-bold text-white"
      >
        The Engineer & Lab
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Tech Stack - Large cell */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:row-span-2">
          <TechStackWidget items={techStack} />
        </motion.div>

        {/* Homelab Status */}
        {/* <motion.div variants={itemVariants} className="lg:col-span-2">
          <HomelabWidget />
        </motion.div> */}

        {/* Project Cards */}
        {projects.slice(0, 3).map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      <ScrollButton targetId="credentials" />
    </div>
  );
}
