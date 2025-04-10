import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/app/api/db';
import { parse } from 'cookie';

export async function PATCH(req: Request) {
  try {
    // Get the token from cookies using cookie parser
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

    // Get the update data from request body
    const { password, firstName, lastName } = await req.json();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update object
    const updateData: {
      password?: string;
      name?: string;
    } = {};
    
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    // Update name if either firstName or lastName is provided
    if (firstName || lastName) {
      const currentName = user.name.split(' ');
      const newFirstName = firstName || currentName[0];
      const newLastName = lastName || (currentName[1] || '');
      updateData.name = `${newFirstName} ${newLastName}`.trim();
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 