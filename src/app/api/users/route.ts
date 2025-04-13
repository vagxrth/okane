import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/app/api/db';
import { parse } from 'cookie';

export async function GET(req: Request) {
  try {
    // Get the token from cookies
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const currentUserId = decoded.userId;

    // Find all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } });
    
    // Map users to safe objects (excluding password and other sensitive data)
    const safeUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email
    }));

    return NextResponse.json({
      users: safeUsers
    }, { status: 200 });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 