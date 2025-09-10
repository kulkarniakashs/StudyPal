import { NextResponse } from "next/server";
import { otp_send } from "@/lib/otp_send";
// in-memory (use Redis/DB in prod)

export async function POST(req: Request) {
  const { email } = await req.json();
  try{
    otp_send(email)
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
