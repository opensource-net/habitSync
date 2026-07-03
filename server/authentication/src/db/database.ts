import { Pool } from 'pg';

const SUPABASE_CONNECTION_STRING =
  process.env.SUPABASE_DB_URL ??
  'postgresql://postgres.dvqjljrzjsxqycyfwjlz:codesmithapril8@aws-1-us-east-2.pooler.supabase.com:6543/postgres';

const shouldUseSSL =
  !SUPABASE_CONNECTION_STRING.includes('localhost') &&
  !SUPABASE_CONNECTION_STRING.includes('127.0.0.1');

const pool = new Pool({
  connectionString: SUPABASE_CONNECTION_STRING,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
});

export interface DbUser {
  user_id: string;
  password: string;
  email: string;
}

export const sessions: Record<
  string,
  { sessionId: string; email: string; valid: boolean; name: string }
> = {};

export function getSession(sessionId: string) {
  const session = sessions[sessionId];

  return session && session.valid ? session : null;
}

export function invalidateSession(sessionId: string) {
  const session = sessions[sessionId];

  if (session) {
    sessions[sessionId].valid = false;
  }

  return sessions[sessionId];
}

export function createSession(email: string, userId: string) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, email, valid: true, name: userId };

  sessions[sessionId] = session;

  return session;
}

export async function getUser(email: string): Promise<DbUser | null> {
  const result = await pool.query<DbUser>(
    'SELECT user_id, password, email FROM users WHERE email = $1 LIMIT 1',
    [email],
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  userId: string,
  email: string,
  password: string,
): Promise<DbUser> {
  const result = await pool.query<DbUser>(
    'INSERT INTO users (user_id, password, email) VALUES ($1, $2, $3) RETURNING user_id, password, email',
    [userId, password, email],
  );

  return result.rows[0];
}
