/**
 * Registry of SQL migration statements.
 * Each migration is idempotent (uses IF NOT EXISTS / DO $body$ guards).
 * Migrations are executed in order by the /api/setup endpoint.
 *
 * Rules:
 * - One statement per migration (Neon serverless does not support multi-statement queries)
 * - Use $body$ dollar-quoting instead of $$ to avoid JS template literal conflicts
 * - Always use IF NOT EXISTS / DO $body$ guards for idempotency
 *
 * Ordering strategy per table:
 *   CREATE TABLE → indexes → trigger
 * Triggers depend on the set_updated_at() function (001), so that comes first.
 * users.last_order_id FK is added last to resolve the circular FK with orders.
 */
export const migrations: { name: string; sql: string }[] = [
  // ── Shared trigger function ──────────────────────────────────────────────────
  {
    name: "001_create_set_updated_at_fn",
    sql: `
      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $body$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $body$ LANGUAGE plpgsql;
    `,
  },

  // ── users ────────────────────────────────────────────────────────────────────
  // NOTE: last_order_id has no FK here — circular FK with orders is added in migration 040.
  // NOTE: password_hash is nullable to support Google-only accounts.
  // NOTE: google_sub stores the Google user ID for OAuth login.
  {
    name: "006_create_users",
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
        email         VARCHAR(255)  NOT NULL UNIQUE,
        password_hash TEXT,
        name          VARCHAR(255)  NOT NULL DEFAULT '',
        role          VARCHAR(50)   NOT NULL DEFAULT 'user',
        phone         VARCHAR(64),
        google_sub    VARCHAR(255)  UNIQUE,
        last_order_id UUID,
        search_terms  TEXT[],
        deleted_at    TIMESTAMPTZ,
        created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "007_create_trg_users_updated_at",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated_at'
        ) THEN
          CREATE TRIGGER trg_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  {
    name: "007b_create_idx_users_google_sub",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;
    `,
  },

  // ── user_sessions ────────────────────────────────────────────────────────────
  {
    name: "008_create_user_sessions",
    sql: `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token      VARCHAR(255)  NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ   NOT NULL,
        created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "009_create_idx_user_sessions_user_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    `,
  },
  {
    name: "010_create_idx_user_sessions_expires_at",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
    `,
  },
  // ── chat_conversations ────────────────────────────────────────────────────
  {
    name: "011_create_chat_conversations",
    sql: `
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id           UUID,
        status            TEXT        NOT NULL DEFAULT 'active',
        assigned_to       UUID,
        escalation_reason TEXT,
        metadata          JSONB       NOT NULL DEFAULT '{}',
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at        TIMESTAMPTZ
      );
    `,
  },
  {
    name: "012_create_idx_chat_conversations_user_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id
        ON chat_conversations(user_id) WHERE deleted_at IS NULL;
    `,
  },
  {
    name: "013_create_idx_chat_conversations_status",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_chat_conversations_status
        ON chat_conversations(status) WHERE deleted_at IS NULL;
    `,
  },
  {
    name: "014_create_chat_conversations_updated_at_trigger",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_chat_conversations'
        ) THEN
          CREATE TRIGGER set_updated_at_chat_conversations
            BEFORE UPDATE ON chat_conversations
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── chat_messages ─────────────────────────────────────────────────────────
  {
    name: "015_create_chat_messages",
    sql: `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID        NOT NULL,
        role            TEXT        NOT NULL,
        content         TEXT        NOT NULL,
        provider        TEXT,
        token_count     INTEGER,
        metadata        JSONB       NOT NULL DEFAULT '{}',
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at      TIMESTAMPTZ
      );
    `,
  },
  {
    name: "016_create_idx_chat_messages_conversation_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id
        ON chat_messages(conversation_id) WHERE deleted_at IS NULL;
    `,
  },
  {
    name: "017_create_chat_messages_updated_at_trigger",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_chat_messages'
        ) THEN
          CREATE TRIGGER set_updated_at_chat_messages
            BEFORE UPDATE ON chat_messages
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── user_profiles ─────────────────────────────────────────────────────────
  {
    name: "100_create_user_profiles",
    sql: `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id    UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        username   VARCHAR(64) UNIQUE,
        bio        TEXT,
        avatar_url TEXT,
        cover_url  TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "101_create_idx_user_profiles_username",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username) WHERE username IS NOT NULL;
    `,
  },
  {
    name: "102_create_trg_user_profiles_updated_at",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_profiles_updated_at'
        ) THEN
          CREATE TRIGGER trg_user_profiles_updated_at
            BEFORE UPDATE ON user_profiles
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── posts ─────────────────────────────────────────────────────────────────
  {
    name: "110_create_posts",
    sql: `
      CREATE TABLE IF NOT EXISTS posts (
        id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body           TEXT,
        visibility     TEXT        NOT NULL DEFAULT 'public',
        shared_post_id UUID,
        deleted_at     TIMESTAMPTZ,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "111_create_idx_posts_author_created",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC) WHERE deleted_at IS NULL;
    `,
  },
  {
    name: "112_create_idx_posts_shared_post_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_posts_shared_post_id ON posts(shared_post_id) WHERE shared_post_id IS NOT NULL;
    `,
  },
  {
    name: "113_create_trg_posts_updated_at",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_posts_updated_at'
        ) THEN
          CREATE TRIGGER trg_posts_updated_at
            BEFORE UPDATE ON posts
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── post_attachments ──────────────────────────────────────────────────────
  {
    name: "120_create_post_attachments",
    sql: `
      CREATE TABLE IF NOT EXISTS post_attachments (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        url        TEXT        NOT NULL,
        s3_key     TEXT,
        kind       TEXT        NOT NULL DEFAULT 'image',
        sort_order INTEGER     NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "121_create_idx_post_attachments_post_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_post_attachments_post_id ON post_attachments(post_id);
    `,
  },

  // ── friendships ───────────────────────────────────────────────────────────
  {
    name: "130_create_friendships",
    sql: `
      CREATE TABLE IF NOT EXISTS friendships (
        id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        requester_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        addressee_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status       TEXT        NOT NULL DEFAULT 'pending',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT friendships_unique_pair UNIQUE (requester_id, addressee_id),
        CONSTRAINT friendships_no_self_friend CHECK (requester_id <> addressee_id)
      );
    `,
  },
  {
    name: "131_create_idx_friendships_addressee_status",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_friendships_addressee_status ON friendships(addressee_id, status);
    `,
  },
  {
    name: "132_create_idx_friendships_requester_status",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_friendships_requester_status ON friendships(requester_id, status);
    `,
  },
  {
    name: "133_create_trg_friendships_updated_at",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_friendships_updated_at'
        ) THEN
          CREATE TRIGGER trg_friendships_updated_at
            BEFORE UPDATE ON friendships
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── post_reactions ────────────────────────────────────────────────────────
  {
    name: "140_create_post_reactions",
    sql: `
      CREATE TABLE IF NOT EXISTS post_reactions (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type       TEXT        NOT NULL DEFAULT 'like',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT post_reactions_unique_user_post UNIQUE (post_id, user_id)
      );
    `,
  },
  {
    name: "141_create_idx_post_reactions_post_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
    `,
  },

  // ── post_comments ─────────────────────────────────────────────────────────
  {
    name: "150_create_post_comments",
    sql: `
      CREATE TABLE IF NOT EXISTS post_comments (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        parent_id  UUID,
        body       TEXT        NOT NULL,
        deleted_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "151_create_idx_post_comments_post_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id, created_at ASC) WHERE deleted_at IS NULL;
    `,
  },
  {
    name: "152_create_trg_post_comments_updated_at",
    sql: `
      DO $body$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'trg_post_comments_updated_at'
        ) THEN
          CREATE TRIGGER trg_post_comments_updated_at
            BEFORE UPDATE ON post_comments
            FOR EACH ROW EXECUTE FUNCTION set_updated_at();
        END IF;
      END;
      $body$;
    `,
  },

  // ── post_shares ───────────────────────────────────────────────────────────
  {
    name: "160_create_post_shares",
    sql: `
      CREATE TABLE IF NOT EXISTS post_shares (
        id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `,
  },
  {
    name: "161_create_idx_post_shares_post_id",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_post_shares_post_id ON post_shares(post_id);
    `,
  },

  // ── users: avatar_url ─────────────────────────────────────────────────────
  {
    name: "162_add_avatar_url_to_users",
    sql: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `,
  },
];
