import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Account, Transaction, User, connection } from '@/app/api/db';
import { parse } from 'cookie';
import mongoose from 'mongoose';

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

    // Find sender's account and user details
    const [fromAccount, fromUser] = await Promise.all([
      Account.findOne({ userId: fromUserId }).session(session),
      User.findOne({ _id: fromUserId }).session(session)
    ]);

    if (!fromAccount || !fromUser) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: 'Invalid sender account' },
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

    // Find recipient's account and user details
    const [toAccount, toUser] = await Promise.all([
      Account.findOne({ userId: to }).session(session),
      User.findOne({ _id: to }).session(session)
    ]);

    if (!toAccount || !toUser) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: 'Invalid recipient account' },
        { status: 400 }
      );
    }

    // Update balances
    fromAccount.balance -= amountInPaise;
    toAccount.balance += amountInPaise;

    await Promise.all([
      fromAccount.save({ session }),
      toAccount.save({ session })
    ]);

    // Record the transaction with proper user names
    const transaction = new Transaction({
      amount: amountInPaise,
      senderId: new mongoose.Types.ObjectId(fromUserId),
      senderName: fromUser.name,
      receiverId: new mongoose.Types.ObjectId(to),
      receiverName: toUser.name,
    });
    await transaction.save({ session });

    await session.commitTransaction();

    return NextResponse.json(
      { message: 'Transfer successful' },
      { status: 200 }
    );

  } catch (error) {
    await session.abortTransaction();
    console.error('Transfer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
} 