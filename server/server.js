const express = require('express')
const app = express()
const db = require('./db/db')
require('dotenv').config()
const pool = db.pool

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: 'Database connected!', 
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *', [email, password])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const user = result.rows[0]
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/auth/me', async (req, res) => {
  try {
    const { email } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const user = result.rows[0]
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/devices/register', async (req, res) => {
  try {
    const { user_id, device_id, platform, push_token } = req.body
    const result = await pool.query('INSERT INTO devices (user_id, device_id, platform, push_token) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, device_id, platform, push_token])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/devices/heartbeat', async (req, res) => {
  try {
    const { device_id } = req.body
    const result = await pool.query('UPDATE devices SET last_seen = NOW() WHERE device_id = $1 RETURNING *', [device_id])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/onboarding', async (req, res) => {
  const userId = req.user.id; // JWT middleware must set req.user.id

  const {
    goals,
    avg_screen_time_minutes,
    problem_apps,
    motivation_type,
    raw_answers
  } = req.body;

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO onboarding_answers
        (user_id, goals, avg_screen_time_minutes, problem_apps, motivation_type, raw_answers)
      VALUES ($1,$2,$3,$4,$5,$6)
      ON CONFLICT (user_id)
      DO UPDATE SET
        goals = EXCLUDED.goals,
        avg_screen_time_minutes = EXCLUDED.avg_screen_time_minutes,
        problem_apps = EXCLUDED.problem_apps,
        motivation_type = EXCLUDED.motivation_type,
        raw_answers = EXCLUDED.raw_answers
      `,
      [userId, goals, avg_screen_time_minutes, problem_apps, motivation_type, raw_answers]
    );

    await client.query(
      `UPDATE users SET onboarding_completed = TRUE WHERE id = $1`,
      [userId]
    );

    await client.query('COMMIT');

    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

app.get('/onboarding', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `
      SELECT goals, avg_screen_time_minutes, problem_apps, motivation_type, raw_answers, created_at
      FROM onboarding_answers
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ ok: true, data: null });
    }

    res.json({ ok: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/subscription/trial/start', async (req, res) => {
  const userId = req.user.id;

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO subscriptions
        (user_id, plan_type, is_active, trial_started_at, trial_expires_at, store, store_subscription_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        plan_type = EXCLUDED.plan_type,
        is_active = EXCLUDED.is_active,
        trial_started_at = EXCLUDED.trial_started_at,
        trial_expires_at = EXCLUDED.trial_expires_at,
        store = EXCLUDED.store,
        store_subscription_id = EXCLUDED.store_subscription_id
      `,
      [userId, 'trial', true, new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'manual', null]
    );

    await client.query('COMMIT');

    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

app.post('/subscription/verify', async (req, res) => {
  const userId = req.user.id;

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO subscriptions
        (user_id, plan_type, is_active, trial_started_at, trial_expires_at, store, store_subscription_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        plan_type = EXCLUDED.plan_type,
        is_active = EXCLUDED.is_active,
        trial_started_at = EXCLUDED.trial_started_at,
        trial_expires_at = EXCLUDED.trial_expires_at,
        store = EXCLUDED.store,
        store_subscription_id = EXCLUDED.store_subscription_id
      `,
      [userId, 'trial', true, new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'manual', null]
    );

    await client.query('COMMIT');

    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

app.post('/subscription/cancel', async (req, res) => {
  const userId = req.user.id;

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO subscriptions
        (user_id, plan_type, is_active, trial_started_at, trial_expires_at, store, store_subscription_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        plan_type = EXCLUDED.plan_type,
        is_active = EXCLUDED.is_active,
        trial_started_at = EXCLUDED.trial_started_at,
        trial_expires_at = EXCLUDED.trial_expires_at,
        store = EXCLUDED.store,
        store_subscription_id = EXCLUDED.store_subscription_id
      `,
      [userId, 'trial', true, new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'manual', null]
    );

    await client.query('COMMIT');

    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

app.get('/subscription/status', async (req, res) => {
  const userId = req.user.id;

  const client = await db.pool.connect();

  try {
    const result = await client.query(
      `
      SELECT plan_type, is_active, trial_started_at, trial_expires_at, store, store_subscription_id
      FROM subscriptions
      WHERE user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ ok: true, data: null });
    }

    res.json({ ok: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  } finally {
    client.release();
  }
});

app.post('/screen-time/report', async (req, res) => {
  const userId = req.user.id;
  const { device_id, date, total_minutes, per_app } = req.body;

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Insert or update daily aggregate
    const { rows } = await client.query(
      `INSERT INTO screen_time_daily
        (user_id, device_id, date, total_minutes)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, device_id, date)
       DO UPDATE SET total_minutes = EXCLUDED.total_minutes
       RETURNING id`,
      [userId, device_id, date, total_minutes]
    );

    const dailyId = rows[0].id;

    // Clear previous per-app entries for the same day
    await client.query(
      `DELETE FROM screen_time_app_daily WHERE screen_time_daily_id = $1`,
      [dailyId]
    );

    // Insert per-app usage
    const appInsertQuery = `
      INSERT INTO screen_time_app_daily
      (screen_time_daily_id, app_package, minutes)
      VALUES ($1,$2,$3)
    `;
    for (const app of per_app) {
      await client.query(appInsertQuery, [dailyId, app.app_package, app.minutes]);
    }

    await client.query('COMMIT');

    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

app.get('/screen-time/today', async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    const dailyRes = await db.query(
      `SELECT id, total_minutes FROM screen_time_daily
       WHERE user_id = $1 AND date = $2`,
      [userId, today]
    );

    if (dailyRes.rows.length === 0) {
      return res.json({ ok: true, data: { total_minutes: 0, apps: [] } });
    }

    const dailyId = dailyRes.rows[0].id;
    const total_minutes = dailyRes.rows[0].total_minutes;

    const appsRes = await db.query(
      `SELECT app_package, minutes FROM screen_time_app_daily
       WHERE screen_time_daily_id = $1`,
      [dailyId]
    );

    res.json({ ok: true, data: { total_minutes, apps: appsRes.rows } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/screen-time/range', async (req, res) => {
  const userId = req.user.id;
  const { from, to } = req.query;

  try {
    const result = await db.query(
      `SELECT date, total_minutes FROM screen_time_daily
       WHERE user_id = $1 AND date BETWEEN $2 AND $3
       ORDER BY date ASC`,
      [userId, from, to]
    );

    res.json({ ok: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/screen-time/top-apps', async (req, res) => {
  const userId = req.user.id;
  const { limit = 5 } = req.query;

  try {
    const result = await db.query(
      `SELECT app_package, SUM(minutes) as total_minutes
       FROM screen_time_daily d
       JOIN screen_time_app_daily a ON a.screen_time_daily_id = d.id
       WHERE d.user_id = $1
       GROUP BY app_package
       ORDER BY total_minutes DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({ ok: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/blocks', async (req, res) => {
  const userId = req.user.id;
  const {
    app_package,
    start_time,   // ISO string or timestamp
    end_time,
    duration_minutes,
    strict = false,
    task_required = true
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO blocks
        (user_id, app_package, start_time, end_time, duration_minutes, strict, task_required, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active')
       RETURNING id, status`,
      [userId, app_package, start_time, end_time, duration_minutes, strict, task_required]
    );

    res.json({ ok: true, block: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/blocks/active', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, app_package, start_time, end_time, duration_minutes, strict, task_required
       FROM blocks
       WHERE user_id = $1 AND status = 'active'
       ORDER BY start_time ASC`,
      [userId]
    );

    res.json({ ok: true, blocks: result.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/blocks/history', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, app_package, start_time, end_time, duration_minutes, status
       FROM blocks
       WHERE user_id = $1 AND status != 'active'
       ORDER BY start_time DESC`,
      [userId]
    );

    res.json({ ok: true, blocks: result.rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/blocks/:id', async (req, res) => {
  const userId = req.user.id;
  const blockId = req.params.id;

  try {
    // Only allow cancel if block is active and not started yet
    const result = await db.query(
      `UPDATE blocks
       SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2 AND start_time > NOW() AND status = 'active'
       RETURNING id, status`,
      [blockId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ ok: false, error: 'Block cannot be cancelled' });
    }

    res.json({ ok: true, block: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/blocks/:id/override-request', async (req, res) => {
  const userId = req.user.id;
  const blockId = req.params.id;
  const { reason } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO override_requests
       (block_id, user_id, reason, status)
       VALUES ($1,$2,$3,'pending')
       RETURNING id, status`,
      [blockId, userId, reason]
    );

    res.json({ ok: true, override_request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
