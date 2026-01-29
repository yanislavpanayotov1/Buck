-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- users
-- ======================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- devices
-- ======================
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  push_token TEXT,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- ======================
-- subscriptions
-- ======================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  trial_started_at TIMESTAMP,
  trial_expires_at TIMESTAMP,
  current_period_end TIMESTAMP,
  store TEXT,
  store_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- ======================
-- onboarding_answers
-- ======================
CREATE TABLE onboarding_answers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  goals TEXT[],
  avg_screen_time_minutes INT,
  problem_apps TEXT[],
  motivation_type TEXT,
  raw_answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ======================
-- preferences
-- ======================
CREATE TABLE preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_limit_minutes INT,
  strict_mode BOOLEAN DEFAULT FALSE,
  task_difficulty TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ======================
-- screen_time_daily
-- ======================
CREATE TABLE screen_time_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_minutes INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, device_id, date)
);

CREATE INDEX idx_screen_time_daily_user_date
ON screen_time_daily(user_id, date);

-- ======================
-- screen_time_app_daily
-- ======================
CREATE TABLE screen_time_app_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screen_time_daily_id UUID NOT NULL REFERENCES screen_time_daily(id) ON DELETE CASCADE,
  app_package TEXT NOT NULL,
  minutes INT NOT NULL
);

CREATE INDEX idx_screen_time_app_daily_parent
ON screen_time_app_daily(screen_time_daily_id);

-- ======================
-- blocks
-- ======================
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_package TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration_minutes INT NOT NULL,
  strict BOOLEAN DEFAULT FALSE,
  task_required BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blocks_user_status
ON blocks(user_id, status);

CREATE INDEX idx_blocks_time
ON blocks(start_time, end_time);

-- ======================
-- override_requests
-- ======================
CREATE TABLE override_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ======================
-- tasks
-- ======================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  difficulty TEXT,
  payload JSONB NOT NULL,
  pass_criteria JSONB NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_block_id ON tasks(block_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- ======================
-- task_submissions
-- ======================
CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission JSONB NOT NULL,
  passed BOOLEAN,
  graded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_task_submissions_task_id
ON task_submissions(task_id);
