import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { Types } from "mongoose";
import { otpStore } from "@/lib/otp-store";

export async function POST(req: Request) {
  const { name, email, password, otp } = await req.json();

  if(email && otp == otpStore.get(email)){
    console.log(email, "createdAt", Date.now().toLocaleString())
  }
  else {
    return NextResponse.json({status : 400}) 
  }

  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    _id: new Types.ObjectId(),
  });

  await newUser.save();

  otpStore.delete(email); // cleanup

  return NextResponse.json({ success: true });
}
