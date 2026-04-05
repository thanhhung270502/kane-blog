"use client";

import { ArrowSquareOut, CheckCircle, GithubLogo, Star } from "@phosphor-icons/react";

import type { LandingProject } from "../types";

import { ExpandableWidget, LiquidGlass } from ".";

interface ProjectCardProps {
  project: LandingProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const expandedContent = (
    <div className="space-y-4">
      {project.image && (
        <div className="overflow-hidden rounded-xl bg-white/5">
          {}
          <img src={project.image} alt={project.title} className="h-48 w-full object-cover" />
        </div>
      )}

      <p className="leading-relaxed text-white/80">{project.description}</p>

      {project.features && project.features.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/60">
            <Star size={14} className="text-cyan-400" />
            Core Features
          </h4>
          <ul className="p-2xl space-y-2 rounded-lg border border-white/10">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm text-white/75">
                <span className="mt-0.5 shrink-0 text-cyan-400">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.responsibilities && project.responsibilities.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/60">
            <CheckCircle size={14} className="text-emerald-400" />
            Responsibilities
          </h4>
          <ul className="p-2xl space-y-2 rounded-lg border border-white/10">
            {project.responsibilities.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/75">
                <span className="mt-0.5 shrink-0 text-emerald-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-semibold text-white/60">Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 border-t border-white/10 pt-4">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-xl bg-cyan-500/20 px-4 py-2 text-cyan-300 transition-colors hover:bg-cyan-500/30"
          >
            <ArrowSquareOut size={16} />
            View Live
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white/80 transition-colors hover:bg-white/20"
          >
            <GithubLogo size={16} />
            Source Code
          </a>
        )}
      </div>
    </div>
  );

  return (
    <ExpandableWidget title={project.title} expandedContent={expandedContent}>
      <LiquidGlass blur="md" hoverable className="h-full">
        <div className="flex h-full flex-col p-4">
          <h4 className="mb-2 font-semibold text-white">{project.title}</h4>
          <p className="mb-3 line-clamp-2 flex-1 text-sm text-white/60">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </LiquidGlass>
    </ExpandableWidget>
  );
}
