import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import axios from 'axios';

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

type GoogleRequestBody = {
  googleToken: string;
};

export async function POST(req: NextRequest | Request) {
  if (req instanceof NextRequest) {
    const { email, name } = await req.json();

    try {
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            username: email.split("@")[0],
          },
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        SECRET_KEY,
        { expiresIn: "10d" }
      );

      return NextResponse.json(
        {
          success: true,
          message: "User successfully authenticated",
          data: { user, token },
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        {
          success: false,
          message: "Error processing request",
        },
        { status: 500 }
      );
    }
  } else {
    try {
      const { googleToken }: GoogleRequestBody = await req.json();

      if (!googleToken) {
        return NextResponse.json(
          { success: false, message: 'Missing Google token' },
          { status: 400 },
        );
      }

      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`,
      );

      const { email, name } = response.data;

      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Invalid Google token' },
          { status: 400 },
        );
      }

      let user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            username: email.split('@')[0],
            name,
            role: 'user' as any,
            isVerified: true,
          },
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' },
      );

      return NextResponse.json(
        {
          success: true,
          message: 'Google login successful',
          data: {
            userId: user.id,
            token,
          },
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error('Error during Google login:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error', data: error },
        { status: 500 },
      );
    }
  }
}