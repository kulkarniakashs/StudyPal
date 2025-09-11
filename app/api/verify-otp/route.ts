import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { Types } from "mongoose";
import { otpStore } from "@/lib/otp-store";

export async function POST(req: Request) {
  try{
    const { name, email, password, otp } = await req.json();

    if (email && otp == otpStore.get(email)) {
      console.log(email, "createdAt", Date.now().toLocaleString())
    }
    else {
       console.log(otp,otpStore.get(email), otp == otpStore.get(email));
       throw new Error("Invalid Otp");
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

    return NextResponse.json({ success: true }, { status: 200 });
  }
  catch(e : any){
    console.log(e);
    if(e.message === "Invalid Otp"){
      return NextResponse.json({error: {message : "Invalid Otp"}, success : false},{status : 400})
    }
    else if (e.code == 11000){
      return NextResponse.json({error: {message : "Email is already in use"}, success : false},{status : 400})
    }
    else {
      return NextResponse.json({error: {message : "Something Went Wrong"}, success : false},{status : 400})
    }
  }
}
