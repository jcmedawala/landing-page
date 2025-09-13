import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Test the connection
export async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    console.log('Database connected successfully:', result.rows[0])
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Create the waitlist table if it doesn't exist
export async function createWaitlistTable() {
  try {
    const client = await pool.connect()
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
    `
    
    await client.query(createTableQuery)
    client.release()
    console.log('Waitlist table created successfully')
    return { success: true, message: 'Waitlist table created successfully' }
  } catch (error) {
    console.error('Failed to create waitlist table:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Add email to waitlist
export async function addEmailToWaitlist(email: string) {
  try {
    const client = await pool.connect()
    
    const insertQuery = `
      INSERT INTO waitlist (email) 
      VALUES ($1) 
      ON CONFLICT (email) 
      DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id, email, created_at;
    `
    
    const result = await client.query(insertQuery, [email])
    client.release()
    
    return { 
      success: true, 
      data: result.rows[0],
      message: 'Email added to waitlist successfully' 
    }
  } catch (error) {
    console.error('Failed to add email to waitlist:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Get all waitlist emails (for admin purposes)
export async function getWaitlistEmails() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM waitlist ORDER BY created_at DESC')
    client.release()
    
    return { success: true, data: result.rows }
  } catch (error) {
    console.error('Failed to get waitlist emails:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export default pool
