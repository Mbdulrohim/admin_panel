import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    // Log: Request received
    console.log('Request received at /api/login');

    // Parse request body with explicit typing
    const { email, password }: LoginRequestBody = await request.json();
    console.log('Parsed request body:', { email, passwordPresent: !!password });

    // Validate inputs
    if (!email || !password) {
      console.log('Validation failed: Missing email or password');
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
      });
    }

    // Log: Looking up email
    console.log('Looking up email:', email);

    // Fetch admin by email (case-insensitive)
    const admin = await prisma.admins.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive', // Case-insensitive match
        },
      },
    });

    if (!admin) {
      console.log('Email not found in database');
      return new Response(
        JSON.stringify({ error: 'Email does not exist. Database connected successfully.' }),
        { status: 401 }
      );
    }

    // Log: Admin found
    console.log('Admin found in database:', admin, admin.role);

    // Compare the entered password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, admin.passwordhash);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Incorrect password for email:', email);
      return new Response(
        JSON.stringify({ error: 'Incorrect password. Database connected successfully.' }),
        { status: 401 }
      );
    }

    // Log: Password is valid, generating JWT
    console.log('Password is valid. Generating JWT for:', admin.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    // Log: JWT generated successfully
    console.log('JWT generated successfully for:', admin.email);

    // Respond with the token
    return new Response(
      JSON.stringify({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          createdat: admin.createdat,
          updatedat: admin.updatedat,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    // Log: Unexpected error
    console.error('Error in login API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Could not connect to database.' }),
      { status: 500 }
    );
  }
}
