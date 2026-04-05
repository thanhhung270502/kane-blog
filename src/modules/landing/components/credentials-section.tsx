"use client";

import { motion } from "framer-motion";

import type {
  LandingAchievementItem,
  LandingCourseItem,
  LandingEducationData,
  LandingPublicationItem,
} from "../types";

import { AchievementsWidget, CoursesWidget, EducationWidget, ScrollButton } from ".";

interface CredentialsSectionProps {
  education: LandingEducationData;
  publications: LandingPublicationItem[];
  achievements: LandingAchievementItem[];
  courses: LandingCourseItem[];
}

export function CredentialsSection({ education, achievements, courses }: CredentialsSectionProps) {
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
        Credentials & Achievements
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <EducationWidget education={education} />
        </motion.div>

        {/* <motion.div variants={itemVariants}>
          <PublicationsWidget publications={publications} />
        </motion.div> */}

        <motion.div variants={itemVariants}>
          <AchievementsWidget achievements={achievements} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CoursesWidget courses={courses} />
        </motion.div>
      </motion.div>

      <ScrollButton targetId="soul" />
    </div>
  );
}
