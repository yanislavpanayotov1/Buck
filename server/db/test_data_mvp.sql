-- ----------------------
-- Users
-- ----------------------
INSERT INTO users (id, email, password_hash, onboarding_completed)
VALUES 
('11111111-1111-1111-1111-111111111111', 'alice@test.com', 'hashedpassword1', true),
('22222222-2222-2222-2222-222222222222', 'bob@test.com', 'hashedpassword2', false)
ON CONFLICT (id) DO NOTHING;

-- ----------------------
-- Devices
-- ----------------------
INSERT INTO devices (id, user_id, device_id, platform, push_token)
VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'device-alice-1', 'android', 'push-token-1'),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'device-bob-1', 'ios', 'push-token-2')
ON CONFLICT (id) DO NOTHING;

-- ----------------------
-- Subscriptions
-- ----------------------
INSERT INTO subscriptions (id, user_id, plan_type, is_active, trial_started_at, trial_expires_at)
VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'premium', true, NOW(), NOW() + interval '7 day')
ON CONFLICT (id) DO NOTHING;

-- ----------------------
-- Onboarding Answers
-- ----------------------
INSERT INTO onboarding_answers (user_id, goals, avg_screen_time_minutes, problem_apps, motivation_type, raw_answers)
VALUES
('11111111-1111-1111-1111-111111111111',
 ARRAY['reduce_social', 'focus'],
 300,
 ARRAY['com.instagram.android', 'com.youtube.android'],
 'discipline',
 '{"q1":"yes","q2":5}')
ON CONFLICT (user_id) DO NOTHING;

-- ----------------------
-- Preferences
-- ----------------------
INSERT INTO preferences (user_id, daily_limit_minutes, strict_mode, task_difficulty)
VALUES
('11111111-1111-1111-1111-111111111111', 240, true, 'medium')
ON CONFLICT (user_id) DO NOTHING;

-- ----------------------
-- Screen Time Daily
-- ----------------------
INSERT INTO screen_time_daily (id, user_id, device_id, date, total_minutes)
VALUES
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '2026-01-29', 320)
ON CONFLICT (id) DO NOTHING;

-- ----------------------
-- Screen Time App Daily
-- ----------------------
INSERT INTO screen_time_app_daily (id, screen_time_daily_id, app_package, minutes)
VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444444', 'com.instagram.android', 120),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444444', 'com.youtube.android', 100),
('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444444', 'com.discord', 100)
ON CONFLICT (id) DO NOTHING;

-- ----------------------
-- Blocks
-- ----------------------
INSERT INTO blocks (id, user_id, app_package, start_time, end_time, duration_minutes, strict, task_required, status)
VALUES
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'com.instagram.android', '2026-01-29 09:00:00', '2026-01-29 11:00:00', 120, true, true, 'pending_task')
ON CONFLICT (id) DO NOTHING;


-- Insert the task first
INSERT INTO tasks (id, block_id, user_id, task_type, difficulty, payload, pass_criteria, expires_at)
VALUES
('77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'quiz', 'medium', '{"question":"Describe your plan to avoid distractions"}', '{"keywords":["focus","distraction"]}', '2026-01-29 10:50:00')
ON CONFLICT (id) DO NOTHING;

-- Then insert submission referencing that exact task ID
INSERT INTO task_submissions (id, task_id, user_id, submission, passed)
VALUES
('88888888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', '{"answer":"I will focus and avoid distractions while working today"}', true)
ON CONFLICT (id) DO NOTHING;
