import nodemailer from "nodemailer"
import { otpStore } from "./otp-store";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
export async function otp_send(email : string){
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    await transporter.sendMail({
        from: `"StudyPal" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your StudyPal OTP Code",
        html: `
  <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #f4f6fb; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
      
      <div style="background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%); color: white; text-align: center; padding: 30px 20px;">
        <h1 style="margin: 0; font-size: 28px;">StudyPal</h1>
        <p style="margin: 5px 0 0 0; font-size: 16px;">Your Learning Companion</p>
      </div>
      
      <div style="padding: 30px 20px; text-align: center;">
        <h2 style="color: #333333; font-size: 24px;">Your OTP Code</h2>
        <p style="font-size: 16px; color: #555555;">Use the OTP below to complete your verification.</p>
        
        <div style="margin: 20px 0;">
          <span style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #2575fc;">${otp}</span>
        </div>
        
        <p style="font-size: 14px; color: #999999;">This OTP is valid for the next 10 minutes.</p>
        
        <a href="#" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #6a11cb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to StudyPal</a>
      </div>
      
      <div style="background-color: #f4f6fb; text-align: center; padding: 15px; font-size: 12px; color: #999999;">
        © ${new Date().getFullYear()} StudyPal. All rights reserved.
      </div>
      
    </div>
  </div>
  `
    });

}