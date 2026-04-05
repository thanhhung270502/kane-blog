"use client";

import {
  BentoGrid,
  CredentialsSection,
  FloatingDock,
  HeroSection,
  MeshBackground,
  SmoothScrollContainer,
  SoulSection,
} from "../components";
import { LANDING_PORTFOLIO_DATA } from "../constants";

// TODO: Replace LANDING_PORTFOLIO_DATA with data fetched from backend API
// Example:
//   const data = await fetchPortfolioData(); // wire up to your API endpoint

export const LandingPage = () => {
  const data = LANDING_PORTFOLIO_DATA;

  return (
    <SmoothScrollContainer duration={1200} className="relative">
      {/* Background Layer */}
      <MeshBackground />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="flex min-h-screen items-center justify-center px-4">
          <HeroSection data={data.hero} />
        </section>

        {/* Tech & Lab Section */}
        <section id="tech" className="relative min-h-screen px-4 py-20">
          <BentoGrid projects={data.projects} techStack={data.techStack} />
        </section>

        {/* Credentials Section */}
        <section id="credentials" className="relative min-h-screen px-4 py-20">
          <CredentialsSection
            education={data.education}
            publications={data.publications}
            achievements={data.achievements}
            courses={data.courses}
          />
        </section>

        {/* Soul Section */}
        <section id="soul" className="relative min-h-screen px-4 py-20">
          <SoulSection data={data.lifestyle} />
        </section>
      </div>

      {/* Floating Elements */}
      <FloatingDock />

      {/* Messenger / Chat button
          TODO: ChatTab inside MessengerButton uses placeholder AI responses.
          Wire up to your AI backend (OpenAI / Anthropic / custom LLM endpoint).
          TODO: ContactTab email form needs to connect to an email API (Resend / EmailJS / backend). */}
      {/* <MessengerButton /> */}
    </SmoothScrollContainer>
  );
};
