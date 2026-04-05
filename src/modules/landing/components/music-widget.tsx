"use client";

import { Headphones, MusicNote, MusicNotes, VinylRecord } from "@phosphor-icons/react";

import { ExpandableWidget, LiquidGlass } from ".";

interface MusicWidgetProps {
  instruments: string[];
  currentlyPlaying: string;
}

export function MusicWidget({ instruments, currentlyPlaying }: MusicWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-cyan-400">
        <Headphones size={24} />
        <span className="font-medium">Musical Journey</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-3 rounded-xl bg-white/5 p-4">
          <div className="flex items-center gap-2 text-white/60">
            <MusicNotes size={16} />
            <span className="text-sm font-medium">Instruments I Play</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {instruments.length > 0 ? (
              instruments.map((instrument) => (
                <span
                  key={instrument}
                  className="rounded-xl bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300 transition-colors hover:bg-cyan-500/30"
                >
                  {instrument}
                </span>
              ))
            ) : (
              <span className="text-sm text-white/40">Not specified</span>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-white/5 p-4">
          <div className="flex items-center gap-2 text-white/60">
            <VinylRecord size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-sm font-medium">Currently Playing</span>
          </div>
          <p className="text-lg font-medium text-cyan-400">
            {currentlyPlaying || "Nothing right now"}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">
          Music helps me stay creative and focused while coding
        </p>
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Music" expandedContent={expandedContent}>
      <LiquidGlass blur="lg" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <MusicNote size={24} className="text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">Music</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-sm text-white/40">Instruments</p>
            <div className="flex flex-wrap gap-2">
              {instruments.length > 0 ? (
                instruments.map((instrument) => (
                  <span
                    key={instrument}
                    className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                  >
                    {instrument}
                  </span>
                ))
              ) : (
                <span className="text-sm text-white/40">Not specified</span>
              )}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm text-white/40">Currently Playing</p>
            <p className="text-cyan-400">{currentlyPlaying || "Nothing right now"}</p>
          </div>
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
