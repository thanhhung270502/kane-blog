"use client";

import { Calendar, Student } from "@phosphor-icons/react";

import type { LandingEducationData } from "../types";

import { ExpandableWidget, LiquidGlass } from ".";

interface EducationWidgetProps {
  education: LandingEducationData;
}

export function EducationWidget({ education }: EducationWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-cyan-500/20 p-3">
          <Student size={32} className="text-cyan-400" />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white">{education.school}</h4>
          <p className="text-white/70">{education.degree}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="mb-1 flex items-center gap-2 text-white/60">
            <Calendar size={16} />
            <span className="text-sm">Period</span>
          </div>
          <p className="font-medium text-white">{education.period}</p>
        </div>
      </div>

      {education.coursework && education.coursework.length > 0 && (
        <div>
          <h5 className="mb-3 text-sm font-semibold text-white/60">Key Coursework</h5>
          <div className="flex flex-wrap gap-2">
            {education.coursework.map((course) => (
              <span
                key={course}
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/15"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ExpandableWidget title="Education" expandedContent={expandedContent}>
      <LiquidGlass blur="md" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/20 p-2">
            <Student size={20} className="text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Education</h3>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-white">{education.school}</p>
          <p className="text-sm text-white/70">{education.degree}</p>
          <p className="text-sm text-white/50">{education.period}</p>
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
