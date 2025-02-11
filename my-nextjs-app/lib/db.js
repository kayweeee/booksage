import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Make sure to set this in .env.local
    ssl: { rejectUnauthorized: false },
});

export default pool;
