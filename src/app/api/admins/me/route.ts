import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No token provided' }), { status: 401 });
    }

    // Decode the JWT to extract the admin ID
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as JwtPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401 }
      );
    }

    // Fetch admin details dynamically from the database
    const admin = await prisma.admins.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return new Response(JSON.stringify({ error: 'Admin not found.' }), { status: 404 });
    }

    // Respond with the admin details
    return new Response(
      JSON.stringify({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdat: admin.createdat,
        updatedat: admin.updatedat,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying token or fetching admin:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
