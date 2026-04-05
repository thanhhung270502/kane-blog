"use client";

import { ArrowSquareOut, BookOpen, FileText } from "@phosphor-icons/react";

import type { LandingPublicationItem } from "../types";

import { ExpandableWidget, LiquidGlass } from ".";

interface PublicationsWidgetProps {
  publications: LandingPublicationItem[];
}

export function PublicationsWidget({ publications }: PublicationsWidgetProps) {
  const expandedContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-purple-400">
        <FileText size={24} />
        <span className="font-medium">
          {publications.length} Published Paper{publications.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {publications.map((pub) => (
          <div
            key={pub.doi}
            className="space-y-3 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
          >
            <h4 className="leading-tight font-medium text-white">{pub.title}</h4>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <BookOpen size={16} />
                {pub.venue}
              </span>
              <span>{pub.year}</span>
            </div>
            <a
              href={`https://doi.org/${pub.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
            >
              <ArrowSquareOut size={16} />
              DOI: {pub.doi}
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ExpandableWidget title="Publications" expandedContent={expandedContent}>
      <LiquidGlass blur="md" hoverable className="h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/20 p-2">
            <BookOpen size={20} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Publications</h3>
        </div>
        <div className="space-y-4">
          {publications.slice(0, 2).map((pub) => (
            <div key={pub.doi} className="space-y-1">
              <p className="line-clamp-2 text-sm leading-tight font-medium text-white">
                {pub.title}
              </p>
              <p className="text-xs text-white/50">
                {pub.venue} • {pub.year}
              </p>
            </div>
          ))}
          {publications.length > 2 && (
            <p className="text-xs text-white/40">+{publications.length - 2} more</p>
          )}
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
