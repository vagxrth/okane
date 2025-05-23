import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Transaction } from '@/app/api/db';
import { parse } from 'cookie';
import mongoose from 'mongoose';

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

    // Fetch all transactions where the user is either the sender or receiver
    const userTransactions = await Transaction.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) }
      ]
    }).sort({ createdAt: -1 });

    // Transform the transactions to include type (sent/received) based on userId
    const formattedTransactions = userTransactions.map((transaction) => {
      const isSender = transaction.senderId.toString() === userId;
      return {
        id: transaction._id.toString(),
        type: isSender ? 'sent' : 'received',
        amount: transaction.amount / 100, // Convert from paise to rupees
        userId: isSender ? transaction.receiverId.toString() : transaction.senderId.toString(),
        userName: isSender ? transaction.receiverName : transaction.senderName,
        createdAt: transaction.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 