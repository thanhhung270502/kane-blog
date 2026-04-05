import type { LandingPortfolioData } from "../types";

/**
 * Static portfolio data - replace with real data or API integration later
 * TODO: Connect to backend API to fetch dynamic portfolio data
 */
export const LANDING_PORTFOLIO_DATA: LandingPortfolioData = {
  hero: {
    name: "Hung Ly",
    title: "Software Engineer @ Spartan",
    tagline:
      "Full-stack engineer with 3+ years delivering end-to-end product modules — from payment integrations and booking systems to AI-powered features across multiple startups.",
    avatar: "/vercel.svg",
    location: "Ho Chi Minh City, Vietnam",
  },

  education: {
    school: "Ho Chi Minh City University of Technology",
    degree: "Bachelor of Computer Science",
    period: "2020 - 2024",
    gpa: "",
    rank: "",
    coursework: [
      "Data Structures & Algorithms",
      "Database Systems",
      "Software Engineering",
      "Computer Networks",
      "Operating Systems",
    ],
  },

  techStack: [
    { name: "TypeScript", icon: "typescript", category: "language" },
    { name: "Kotlin", icon: "kotlin", category: "language" },
    { name: "SQL", icon: "postgres", category: "language" },
    { name: "Next.js", icon: "nextjs", category: "frontend" },
    { name: "React", icon: "react", category: "frontend" },
    { name: "Node.js", icon: "nodejs", category: "backend" },
    { name: "PostgreSQL", icon: "postgres", category: "database" },
    { name: "MySQL", icon: "mysql", category: "database" },
    { name: "Docker", icon: "docker", category: "devops" },
    { name: "GitHub", icon: "github", category: "devops" },
  ],

  projects: [
    {
      id: "1",
      title: "Reviva",
      description:
        "Full-scale wellness platform built at Spartan covering the entire business lifecycle from scheduling to inventory.",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "React"],
      features: [
        "Booking System — real-time availability, appointment management, and calendar integration",
        "Form Builder — Google Forms-style builder with session persistence, access controls, and chart-based data visualization",
        "Payment Integration — transactions, refunds, and multiple payment methods",
        "Membership System — tiered management with benefits tracking and automated renewals",
        "Package & Gift Card Systems — multi-service pricing tiers, gift card lifecycle (purchase, redemption, balance tracking, digital delivery)",
        "Analytics Dashboard — real-time revenue and booking analytics with customizable filters and exportable reports",
        "Inventory Management — stock tracking, purchase order management, supplier tracking, and barcode/SKU support",
      ],
      responsibilities: [
        "Defined project-wide architecture standards: folder structure, React component patterns, TypeScript interfaces, state management strategies, and code review guidelines",
        "Established the core component library (buttons, forms, modals, data grids) following atomic design principles",
        "Improved developer experience through shared utility hooks, component documentation, Storybook setup, and ESLint/Prettier configurations",
        "Diagnosed and fixed backend API issues independently to unblock frontend delivery",
        "Managed database schema changes (new columns, model updates, backward-compatible migrations)",
        "Modified API response contracts in collaboration with the backend team",
      ],
    },
    {
      id: "2",
      title: "SweetPix",
      description:
        "E-commerce + B2B platform with dual payment processors, AI-powered customer support chat, and S3-based asset management.",
      tags: ["Kotlin", "Next.js", "Stripe", "Braintree", "OpenAI", "AWS S3"],
      features: [
        "Order Management — full order lifecycle: tile creation, grouping, pricing calculations, state transitions (pending → processing → shipped → delivered), and soft-delete policies",
        "Payment Integration — Stripe and Braintree support with checkout sessions, payment intent handling, webhook processing, and transaction history",
        "B2B Collections & Asset Management — companies manage branded asset collections, upload media to S3, and organize tiles into themed collections",
        "Company & Team Management — multi-tenant system with company profiles, role-based membership (agent/admin), invite codes with expiration and usage limits, and auto-approval workflows",
        "AI-Powered Customer Support Chat — real-time chat with LLM-driven responses (OpenAI, Claude, Gemini), admin takeover capability, and conversation lifecycle management",
        "Media Storage — S3-compatible object storage (AWS S3/LocalStack/MinIO) for user photos, order assets, tile images, and B2B branding materials",
      ],
      responsibilities: [
        "Owned all technical decisions: architecture design, module decomposition, technology stack selection, and cross-cutting concerns (error handling, logging, null safety, DB conventions)",
        "Designed and enforced a 3-tier modular monolith architecture (Controller → Manager → Repository) across 26 Gradle subprojects",
        "Defined and prioritized the full feature roadmap; translated business requirements into API contracts and database schemas",
        "Implemented core business logic including order management, B2B company/collection system, AI chat integration, and durable workflow engine activities",
        "Architected dual-processor payment system with Stripe and Braintree, including webhook security (HMAC verification), transaction tracking, and checkout session orchestration",
      ],
    },
    {
      id: "3",
      title: "NHL Goal Coding",
      description:
        "Teaching workflow platform for programming courses — student progress tracking, structured question bank, and automated submission clustering.",
      tags: ["React", "REST API", "Figma", "Node.js"],
      features: [
        "Streamlines teaching workflows with tools for lecturers and tutors to manage and monitor individual student progress",
        "Structured question bank organizing programming exercises into categorized collections by problem type and concept",
        "Automatic clustering of student submissions with similar solutions for faster evaluation and plagiarism-aware grading",
      ],
      responsibilities: [
        "Designed and prototyped UI/UX in Figma, then implemented responsive front-end interfaces using ReactJS",
        "Architected and developed RESTful APIs for the back-end system",
      ],
    },
    {
      id: "4",
      title: "Shopping Cart (Voyager Inc.)",
      description:
        "Full-featured e-commerce platform inspired by Shopee/Lazada supporting both buyer and seller workflows, built end-to-end with Ruby on Rails.",
      tags: ["Ruby on Rails", "PostgreSQL", "Docker", "GitHub"],
      features: [
        "User authentication — signup, login, forgot password, and account activation",
        "User/shop follow system and blog writing",
        "Full product and store CRUD with shopping cart and order management",
        "Voucher system and automated email notifications to buyers and sellers",
      ],
      responsibilities: [
        "Built the full platform end-to-end using Ruby on Rails — frontend architecture, backend application logic, and database design",
        "Designed and modelled the PostgreSQL database schema following MVC architecture principles",
        "Containerised and deployed the application using Docker, with source control managed via Git and GitHub",
      ],
    },
  ],

  publications: [],

  achievements: [
    {
      title: "Architecture Standards Lead",
      event: "Established component library, design system & architecture standards",
      organization: "Spartan",
      year: 2024,
    },
    {
      title: "Full-Stack Tech Lead",
      event: "Owned all technical decisions across 26 Gradle subprojects",
      organization: "SweetPix",
      year: 2023,
    },
  ],

  courses: [
    {
      title: "Full-Stack Engineering",
      year: 2024,
      focus: ["Next.js App Router", "Server Components", "TypeScript", "Micronaut"],
    },
  ],

  lifestyle: {
    music: {
      instruments: [],
      currentlyPlaying: "Lo-fi Beats",
    },
    routines: ["Morning: Code & Coffee", "Afternoon: Deep Work", "Evening: Side Projects"],
  },
};

export const LANDING_SOCIAL = {
  github: "https://github.com/thanhhung270502",
  linkedin: "https://www.linkedin.com/in/hungly/",
  email: "thanhhung270502@email.com",
};
