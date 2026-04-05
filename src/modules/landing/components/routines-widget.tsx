"use client";

import type { Icon } from "@phosphor-icons/react";
import { Calendar, Coffee, Lightning, Moon, Sun } from "@phosphor-icons/react";

import { ExpandableWidget, LiquidGlass } from ".";

interface RoutinesWidgetProps {
  routines: string[];
}

const routineIcons: Icon[] = [Sun, Coffee, Lightning, Moon];

export function RoutinesWidget({ routines }: RoutinesWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-cyan-400">
        <Calendar size={24} />
        <span className="font-medium">Daily Rhythm</span>
      </div>

      <div className="space-y-3">
        {routines.length > 0 ? (
          routines.map((routine, index) => {
            const IconComp = routineIcons[index % routineIcons.length];
            return (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="rounded-lg bg-cyan-500/20 p-2">
                  <IconComp size={20} className="text-cyan-400" />
                </div>
                <span className="text-white/80">{routine}</span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-white/40">No routines specified</p>
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">
          Consistency and balance are key to sustainable productivity
        </p>
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Daily Rhythm" expandedContent={expandedContent}>
      <LiquidGlass blur="lg" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <Calendar size={24} className="text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Daily Rhythm</h3>
        </div>
        <div className="space-y-2">
          {routines.length > 0 ? (
            routines.slice(0, 3).map((routine, index) => (
              <div key={index} className="flex items-center gap-3 text-white/70">
                <Coffee size={16} className="text-white/40" />
                <span className="text-sm">{routine}</span>
              </div>
            ))
          ) : (
            <span className="text-sm text-white/40">No routines specified</span>
          )}
          {routines.length > 3 && (
            <p className="pl-7 text-xs text-white/40">+{routines.length - 3} more</p>
          )}
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
