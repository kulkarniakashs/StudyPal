import { NextResponse } from "next/server";
import { otp_send } from "@/lib/otp_send";

export async function POST(req: Request) {
  const { email } = await req.json();
  try{
    await otp_send(email)
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
