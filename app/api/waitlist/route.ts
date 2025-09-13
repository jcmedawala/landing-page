import { NextRequest, NextResponse } from 'next/server'
import { testConnection, createWaitlistTable, addEmailToWaitlist } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Test database connection
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      console.error('Database connection failed:', connectionTest.error)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Ensure table exists
    const tableCreation = await createWaitlistTable()
    if (!tableCreation.success) {
      console.error('Failed to create table:', tableCreation.error)
      return NextResponse.json(
        { error: 'Database setup failed' },
        { status: 500 }
      )
    }

    // Add email to waitlist
    const result = await addEmailToWaitlist(email.toLowerCase().trim())
    
    if (result.success) {
      return NextResponse.json({
        message: 'Successfully joined the waitlist!',
        data: result.data
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to join waitlist' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve waitlist (for admin purposes)
export async function GET() {
  try {
    // Test database connection
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
