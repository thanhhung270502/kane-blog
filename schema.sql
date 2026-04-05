-- ============================================
-- SweetPix App — Neon Postgres Schema
-- Auto-generated from src/libs/migrations-registry.ts
-- DO NOT EDIT MANUALLY. Run: npm run db:generate-schema
-- Generated at: 2026-03-10T15:04:48.744Z
-- ============================================

-- [001_create_set_updated_at_fn]
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $body$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$body$ LANGUAGE plpgsql;

-- [002_create_order_state_enum]
DO $body$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_state') THEN
    CREATE TYPE order_state AS ENUM (
      'pending',
      'processingPayment',
      'processedPayment',
      'processingShipstation',
      'processedShipstation',
      'sendingEmails',
      'processed',
      'imagesSent',
      'shipped'
    );
  END IF;
END;
$body$;

-- [003_create_tile_size_enum]
DO $body$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tile_size') THEN
    CREATE TYPE tile_size AS ENUM (
      '8x8',
      '12x12'
    );
  END IF;
END;
$body$;

-- [004_create_promo_code_type_enum]
DO $body$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'promo_code_type') THEN
    CREATE TYPE promo_code_type AS ENUM (
      'percentage',
      'discount',
      'free'
    );
  END IF;
END;
$body$;

-- [005_create_promo_code_size_enum]
DO $body$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'promo_code_size') THEN
    CREATE TYPE promo_code_size AS ENUM (
      'all',
      '8x8',
      '12x12'
    );
  END IF;
END;
$body$;

-- [006_create_users]
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  name          VARCHAR(255)  NOT NULL DEFAULT '',
  role          VARCHAR(50)   NOT NULL DEFAULT 'user',
  phone         VARCHAR(64),
  last_order_id UUID,
  search_terms  TEXT[],
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- [007_create_trg_users_updated_at]
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

-- [008_create_user_sessions]
CREATE TABLE IF NOT EXISTS user_sessions (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255)  NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ   NOT NULL,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- [009_create_idx_user_sessions_user_id]
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

-- [010_create_idx_user_sessions_expires_at]
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- [011_create_user_addresses]
CREATE TABLE IF NOT EXISTS user_addresses (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name  VARCHAR(255),
  address       VARCHAR(255),
  unit_or_suite VARCHAR(100),
  city          VARCHAR(100),
  state         VARCHAR(100),
  zip           VARCHAR(20),
  country       VARCHAR(2),
  is_primary    BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- [012_create_idx_user_addresses_user_id]
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- [013_create_trg_user_addresses_updated_at]
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_user_addresses_updated_at'
  ) THEN
    CREATE TRIGGER trg_user_addresses_updated_at
      BEFORE UPDATE ON user_addresses
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$body$;

-- [014_create_template_collections]
CREATE TABLE IF NOT EXISTS template_collections (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255)  NOT NULL,
  menu_name     VARCHAR(255),
  is_public     BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_index    INT,
  menu_icon_id  VARCHAR(128),
  search_terms  TEXT[],
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

-- [015_create_trg_template_collections_updated_at]
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_template_collections_updated_at'
  ) THEN
    CREATE TRIGGER trg_template_collections_updated_at
      BEFORE UPDATE ON template_collections
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$body$;

-- [016_create_template_images]
CREATE TABLE IF NOT EXISTS template_images (
  id                      UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  template_collection_id  UUID          NOT NULL REFERENCES template_collections(id) ON DELETE CASCADE,
  name                    VARCHAR(255)  NOT NULL,
  image_path              TEXT          NOT NULL
);

-- [017_create_idx_template_images_collection_id]
CREATE INDEX IF NOT EXISTS idx_template_images_collection_id ON template_images(template_collection_id);

-- [018_create_template_image_url_cache]
CREATE TABLE IF NOT EXISTS template_image_url_cache (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  template_image_id   UUID          NOT NULL UNIQUE REFERENCES template_images(id) ON DELETE CASCADE,
  url                 TEXT          NOT NULL,
  cached_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ   NOT NULL
);

-- [019_create_promo_codes]
CREATE TABLE IF NOT EXISTS promo_codes (
  id                        UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  code                      VARCHAR(128)     NOT NULL UNIQUE,
  type                      promo_code_type  NOT NULL,
  size                      promo_code_size  NOT NULL DEFAULT 'all',
  amount                    NUMERIC(10, 2)   NOT NULL DEFAULT 0,
  one_time_use              BOOLEAN          NOT NULL DEFAULT FALSE,
  used                      BOOLEAN          NOT NULL DEFAULT FALSE,
  valid_for_2_tiles_free    BOOLEAN          NOT NULL DEFAULT FALSE,
  valid_for_free_shipping   BOOLEAN          NOT NULL DEFAULT FALSE,
  only_valid_for_tile_size  tile_size,
  start_date                TIMESTAMPTZ      NOT NULL,
  end_date                  TIMESTAMPTZ,
  search_terms              TEXT[],
  created_at                TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  deleted_at                TIMESTAMPTZ
);

-- [020_create_idx_promo_codes_code]
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);

-- [021_create_trg_promo_codes_updated_at]
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_promo_codes_updated_at'
  ) THEN
    CREATE TRIGGER trg_promo_codes_updated_at
      BEFORE UPDATE ON promo_codes
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$body$;

-- [022_create_orders]
CREATE TABLE IF NOT EXISTS orders (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          REFERENCES users(id) ON DELETE SET NULL,
  email         VARCHAR(255),
  full_name     VARCHAR(255),
  tile_size     tile_size     NOT NULL,
  app_version   VARCHAR(64),
  state         order_state   NOT NULL DEFAULT 'pending',
  is_processed  BOOLEAN       NOT NULL DEFAULT FALSE,
  promo_code    VARCHAR(128)  REFERENCES promo_codes(code),
  token         VARCHAR(255)  NOT NULL,
  search_terms  TEXT[],
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

-- [023_create_idx_orders_user_id]
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- [024_create_idx_orders_state]
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state);

-- [025_create_idx_orders_promo_code]
CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);

-- [026_create_idx_orders_created_at]
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- [027_create_trg_orders_updated_at]
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_orders_updated_at'
  ) THEN
    CREATE TRIGGER trg_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$body$;

-- [028_create_order_addresses]
CREATE TABLE IF NOT EXISTS order_addresses (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID         NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  company_name  VARCHAR(255),
  address       VARCHAR(500),
  unit_or_suite VARCHAR(255),
  city          VARCHAR(255),
  state         VARCHAR(255),
  zip           VARCHAR(32),
  country       VARCHAR(255)
);

-- [029_create_order_groups]
CREATE TABLE IF NOT EXISTS order_groups (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name        VARCHAR(255)  NOT NULL,
  sort_order  INT           NOT NULL DEFAULT 0
);

-- [030_create_idx_order_groups_order_id]
CREATE INDEX IF NOT EXISTS idx_order_groups_order_id ON order_groups(order_id);

-- [031_create_order_tiles]
CREATE TABLE IF NOT EXISTS order_tiles (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_group_id UUID          NOT NULL REFERENCES order_groups(id) ON DELETE CASCADE,
  file_name      VARCHAR(255),
  image_path     TEXT          NOT NULL
);

-- [032_create_idx_order_tiles_group_id]
CREATE INDEX IF NOT EXISTS idx_order_tiles_group_id ON order_tiles(order_group_id);

-- [033_create_order_prices]
CREATE TABLE IF NOT EXISTS order_prices (
  id                         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                   UUID           NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  sub_total                  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sub_total_with_promo_code  NUMERIC(10, 2),
  shipping                   INT            NOT NULL DEFAULT 0,
  tax                        NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total                      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  promo_code_discount        NUMERIC(10, 2),
  promo_code_discount_string VARCHAR(64)
);

-- [034_create_order_group_prices]
CREATE TABLE IF NOT EXISTS order_group_prices (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  order_price_id  UUID           NOT NULL REFERENCES order_prices(id) ON DELETE CASCADE,
  order_group_id  UUID           NOT NULL REFERENCES order_groups(id) ON DELETE CASCADE,
  tile_price      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_price     NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- [035_create_idx_order_group_prices_price_id]
CREATE INDEX IF NOT EXISTS idx_order_group_prices_price_id ON order_group_prices(order_price_id);

-- [036_create_order_tile_metadata]
CREATE TABLE IF NOT EXISTS order_tile_metadata (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_tile_id  UUID          NOT NULL REFERENCES order_tiles(id) ON DELETE CASCADE,
  meta_key       VARCHAR(255)  NOT NULL,
  meta_value     TEXT
);

-- [037_create_idx_order_tile_metadata_tile_id]
CREATE INDEX IF NOT EXISTS idx_order_tile_metadata_tile_id ON order_tile_metadata(order_tile_id);

-- [038_create_order_reports]
CREATE TABLE IF NOT EXISTS order_reports (
  id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date     DATE           NOT NULL UNIQUE,
  total_quantity  INT            NOT NULL DEFAULT 0,
  total_amount    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- [039_create_order_report_sizes]
CREATE TABLE IF NOT EXISTS order_report_sizes (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id   UUID           NOT NULL REFERENCES order_reports(id) ON DELETE CASCADE,
  tile_size   tile_size      NOT NULL,
  quantity    INT            NOT NULL DEFAULT 0,
  amount      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  UNIQUE (report_id, tile_size)
);

-- [040_alter_users_add_last_order_fk]
DO $body$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_users_last_order'
      AND table_name = 'users'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_last_order
      FOREIGN KEY (last_order_id) REFERENCES orders(id);
  END IF;
END;
$body$;

-- [041_create_idx_order_report_sizes_report_id]
CREATE INDEX IF NOT EXISTS idx_order_report_sizes_report_id ON order_report_sizes(report_id);
