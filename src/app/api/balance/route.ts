import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Account } from '@/app/api/db';
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
    const userId = decoded.userId;

    // Find the account
    const account = await Account.findOne({ userId });
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      balance: account.balance / 100 // Convert paise to rupees
    }, { status: 200 });

  } catch (error) {
    console.error('Get balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 