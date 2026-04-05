"use client";

import { Calendar, Medal, Star, Trophy } from "@phosphor-icons/react";

import type { LandingAchievementItem } from "../types";

import { ExpandableWidget, LiquidGlass } from ".";

interface AchievementsWidgetProps {
  achievements: LandingAchievementItem[];
}

export function AchievementsWidget({ achievements }: AchievementsWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-yellow-400">
        <Medal size={24} />
        <span className="font-medium">
          {achievements.length} Achievement{achievements.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className="space-y-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-yellow-500/20 p-2">
                <Star size={16} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{achievement.title}</h4>
                <p className="text-sm text-white/70">{achievement.event}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/50">
                  <span>{achievement.organization}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {achievement.year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Achievements" expandedContent={expandedContent}>
      <LiquidGlass blur="md" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-yellow-500/20 p-2">
            <Trophy size={20} className="text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
        </div>
        <div className="space-y-3">
          {achievements.slice(0, 2).map((achievement) => (
            <div key={achievement.title} className="space-y-1">
              <p className="text-sm font-medium text-white">{achievement.title}</p>
              <p className="text-xs text-white/50">
                {achievement.organization} • {achievement.year}
              </p>
            </div>
          ))}
          {achievements.length > 2 && (
            <p className="text-xs text-white/40">+{achievements.length - 2} more</p>
          )}
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
