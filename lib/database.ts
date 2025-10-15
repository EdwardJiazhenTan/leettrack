import { Pool, PoolConfig } from 'pg';

// Database connection configuration
const dbConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Fallback configuration if DATABASE_URL is not set
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'leettrack',
  user: process.env.DB_USER || 'leettrack_user',
  password: process.env.DB_PASSWORD || 'leettrack_password',

  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established

  // SSL configuration for production databases (e.g., Vercel Postgres, Neon, etc.)
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
};

// Create connection pool
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig);

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  return pool;
}

// Helper function to execute queries
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Connection details:', {
      hasConnectionString: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    throw error;
  }

  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query details:', { text, params });
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Helper function to execute a single query and return first row
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

// Helper function for transactions
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Close all database connections (useful for testing and shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result[0]?.current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
