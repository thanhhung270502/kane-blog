import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessageObject } from "@common";
import { EChatMessageRole } from "@common";

const SYSTEM_PROMPT = `You are Hung's portfolio assistant — a friendly, concise AI that helps visitors learn about Hung Ly, a Software Engineer based in Ho Chi Minh City.
Answer questions about his experience, projects, and skills. Keep responses short and conversational. If you don't know something, say so honestly.

ABOUT HUNG:
- Software Engineer with 3+ years of full-stack experience across multiple startups
- Strong in TypeScript (Next.js, React, Node.js), Kotlin, SQL (PostgreSQL, MySQL)
- Tools: Figma, Notion, Jira, GitHub
- Education: Bachelor of Computer Science — Ho Chi Minh City University of Technology (2020–2024)
- Contact: thanhhung270502@email.com | 085.439.3829

EXPERIENCE:
- Spartan (Jun 2024 – Present): Frontend / Software Engineer
  • Designed and delivered 8+ core product modules: booking system, form builder, payment integration, analytics dashboard, inventory management
  • Established component library, design system, and architecture standards for the team
  • Applied performance optimisations: virtualisation, lazy loading, memoisation
  • Resolved backend API issues and managed DB migrations to unblock frontend delivery
  • On-call rotation and production health monitoring

- Singalarity (Jun 2023 – Sep 2023): Software Engineering Intern
  • Built a RADIUS Server in Golang and exposed a RESTful API with Java Spring Boot
  • Built a website with ReactJS and an Android app in Java

- Voyager Inc. (Jul 2022 – Jan 2023): Web Developer Intern
  • Built "Shopping Cart" — a full e-commerce platform (Shopee/Lazada-inspired) using Ruby on Rails
  • Features: auth, follow system, blog, product/store CRUD, cart, orders, vouchers, email notifications
  • Designed PostgreSQL schema, containerised with Docker

PROJECTS:
- Reviva: Full business platform with booking, form builder, payment, membership, gift cards, analytics dashboard, and inventory management. Defined project-wide architecture, component library, and API contracts.

- SweetPix: E-commerce platform for photo tiles. Built order management, dual payment (Stripe + Braintree), B2B asset management, multi-tenant company system, AI-powered support chat (OpenAI/Claude/Gemini), and S3 media storage. Led all technical decisions across 26 Gradle subprojects using a 3-tier modular monolith (Controller → Manager → Repository).

- NHL Goal Coding: Teaching tool for programming courses — student progress tracking, question bank, auto-clustering of similar submissions for plagiarism-aware grading. Designed UI/UX in Figma and built React frontend + RESTful API.

GUIDELINES:
- Be helpful and warm — you represent Hung's portfolio
- Answer truthfully; don't fabricate details about projects or experience
- If asked about availability or hiring, suggest contacting Hung directly via email
- Stay focused on Hung's professional background; politely decline off-topic requests`;

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

function buildMessages(
  history: ChatMessageObject[]
): Anthropic.Messages.MessageParam[] {
  return history
    .filter(
      (m) =>
        m.role === EChatMessageRole.USER || m.role === EChatMessageRole.ASSISTANT
    )
    .map((m) => ({
      role: m.role === EChatMessageRole.USER ? "user" : ("assistant" as const),
      content: m.content,
    }));
}

/**
 * Stream AI response tokens. Yields each text chunk as it arrives.
 * The caller is responsible for assembling the full response.
 */
export async function* streamChatResponse(
  history: ChatMessageObject[],
  userMessage: string
): AsyncGenerator<string> {
  const client = getClient();
  const messages = buildMessages(history);
  messages.push({ role: "user", content: userMessage });

  const stream = await client.messages.create({
    model: process.env.LLM_MODEL ?? "claude-haiku-4-5-20251001",
    max_tokens: parseInt(process.env.LLM_MAX_TOKENS ?? "1024"),
    system: SYSTEM_PROMPT,
    messages,
    stream: true,
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

/**
 * Single non-streaming call — used for classification / escalation detection.
 */
export async function generateChatResponse(
  history: ChatMessageObject[],
  userMessage: string
): Promise<string> {
  const client = getClient();
  const messages = buildMessages(history);
  messages.push({ role: "user", content: userMessage });

  const response = await client.messages.create({
    model: process.env.LLM_MODEL ?? "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages,
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
