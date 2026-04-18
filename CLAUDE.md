# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **Facebook-like social network** built with Next.js 15 App Router. Dark-themed UI with modern aesthetics (deep dark backgrounds, purple/blue accent palette). Core social features: news feed, posts with media, reactions, comments, sharing, friend system, user profiles, and real-time chat.

## Rules

Detailed rules live in `.claude/rules/`:

- [architecture.md](.claude/rules/architecture.md) — Backend 3-layer pattern, frontend module architecture, directory structure
- [design-system.md](.claude/rules/design-system.md) — Shared components, typography & button variants
- [patterns.md](.claude/rules/patterns.md) — Auth, state management, API clients, database, file uploads
- [domain-models.md](.claude/rules/domain-models.md) — Social and chat domain model definitions
- [code-style.md](.claude/rules/code-style.md) — ESLint, Prettier, icons, HTML conventions

## Features Built

### Authentication
- Email/password login & signup
- Google OAuth (callback flow)
- JWT refresh token rotation

### News Feed (`/`)
- Infinite scroll feed of posts from friends + self
- Post composer (text + image/video upload)
- Post visibility: Public / Friends
- Post reactions (Like + emoji types)
- Nested comments
- Share / repost posts

### User Profile (`/users/[userId]`)
- Profile header with cover photo + avatar
- Edit avatar and cover photo (S3 upload)
- Bio and profile info sidebar
- User's posts list

### Friend System
- Send / accept / reject friend requests
- Friend requests panel (right sidebar)
- Friends list (left sidebar)

### Chat
- Conversation list
- Real-time-like message thread per conversation

## Planned Features (not yet built)

- Notifications (likes, comments, friend requests)
- Stories · Groups · Events
- Search (users, posts)
- Post editing & deletion
- Comment reactions
- Chat: real-time via WebSockets/SSE
- User blocking · Privacy settings

## Environment Variables

See `.env.example`:
- `DATABASE_URL` — Neon Postgres connection string
- `SESSION_EXPIRY_SECONDS`
- `NEXT_PUBLIC_API_BASE_URL`
- `JWT_REFRESH_TOKEN_EXPIRATION`
- `AWS_*` — S3 credentials for media uploads
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth
