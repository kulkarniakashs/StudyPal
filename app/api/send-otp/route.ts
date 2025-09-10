import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/lib/otp-store";
// in-memory (use Redis/DB in prod)

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // await transporter.sendMail({
    //   from: `"My App" <${process.env.GMAIL_USER}>`,
    //   to: email,
    //   subject: "Your OTP Code",
    //   text: `Your OTP is ${otp}`,
    // });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
