import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Account, connection } from '@/app/api/db';
import { parse } from 'cookie';

export async function POST(req: Request) {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    // Get the token from cookies
    const cookies = parse(req.headers.get('cookie') || '');
    const token = cookies.token;

    if (!token) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const fromUserId = decoded.userId;

    // Get transfer details
    const { to, amount } = await req.json();
    const amountInPaise = Math.round(amount * 100); // Convert rupees to paise

    // Find sender's account
    const fromAccount = await Account.findOne({ userId: fromUserId }).session(session);
    if (!fromAccount) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: 'Invalid account' },
        { status: 400 }
      );
    }

    // Check if sender has sufficient balance
    if (fromAccount.balance < amountInPaise) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Find recipient's account
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: 'Invalid account' },
        { status: 400 }
      );
    }

    // Update balances
    fromAccount.balance -= amountInPaise;
    toAccount.balance += amountInPaise;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    await session.commitTransaction();

    return NextResponse.json(
      { message: 'Transfer successful' },
      { status: 200 }
    );

  } catch (error) {
    await session.abortTransaction();
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
} 