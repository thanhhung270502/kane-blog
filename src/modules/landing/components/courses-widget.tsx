"use client";

import { BookBookmark, Calendar, SealCheck } from "@phosphor-icons/react";

import type { LandingCourseItem } from "../types";

import { ExpandableWidget, LiquidGlass } from ".";

interface CoursesWidgetProps {
  courses: LandingCourseItem[];
}

export function CoursesWidget({ courses }: CoursesWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-green-400">
        <BookBookmark size={24} />
        <span className="font-medium">
          {courses.length} Professional Course{courses.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.title}
            className="space-y-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-green-500/20 p-2">
                  <SealCheck size={16} className="text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{course.title}</h4>
                  <span className="mt-1 flex items-center gap-1 text-xs text-white/50">
                    <Calendar size={12} />
                    {course.year}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-11">
              {course.focus.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Professional Courses" expandedContent={expandedContent}>
      <LiquidGlass blur="md" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-green-500/20 p-2">
            <SealCheck size={20} className="text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Professional Courses</h3>
        </div>
        <div className="space-y-3">
          {courses.slice(0, 2).map((course) => (
            <div key={course.title} className="space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-white">{course.title}</p>
                <span className="text-xs text-white/50">{course.year}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {course.focus.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
                  >
                    {topic}
                  </span>
                ))}
                {course.focus.length > 2 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                    +{course.focus.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
          {courses.length > 2 && (
            <p className="text-xs text-white/40">+{courses.length - 2} more courses</p>
          )}
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
