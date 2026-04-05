export interface LandingProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  link?: string;
  github?: string;
  features?: string[];
  responsibilities?: string[];
}

export interface LandingTechItem {
  name: string;
  icon: string;
  category: "language" | "frontend" | "backend" | "database" | "devops" | "data" | "ai";
}

export interface LandingHeroData {
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  location?: string;
}

export interface LandingEducationData {
  school: string;
  degree: string;
  period: string;
  gpa: string;
  rank: string;
  coursework?: string[];
}

export interface LandingPublicationItem {
  title: string;
  venue: string;
  doi: string;
  year: number;
}

export interface LandingAchievementItem {
  title: string;
  event: string;
  organization: string;
  year: number;
}

export interface LandingCourseItem {
  title: string;
  year: number;
  focus: string[];
}

export interface LandingLifestyleData {
  music: {
    instruments: string[];
    currentlyPlaying: string;
  };
  routines: string[];
}

export interface LandingPortfolioData {
  hero: LandingHeroData;
  education: LandingEducationData;
  projects: LandingProject[];
  techStack: LandingTechItem[];
  publications: LandingPublicationItem[];
  achievements: LandingAchievementItem[];
  courses: LandingCourseItem[];
  lifestyle: LandingLifestyleData;
}
